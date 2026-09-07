/**
 * Health check service.
 *
 * Performs a shallow liveness + readiness probe. Does NOT hit
 * the database or AI provider on every call (the result is
 * cached for a few seconds) so monitoring traffic doesn't
 * become a load test.
 */
import { env } from "../config/env.js";
import aiService from "./aiService.js";
import { getStore } from "../repositories/memoryStore.js";
import { firebaseReady } from "../config/firebaseAdmin.js";

let _cache = null;
let _cacheTs = 0;
const CACHE_MS = 5_000;

const collect = async () => {
  const checks = {
    server: { status: "ok" },
    ai: {
      status: env.AI_ENABLED ? "ok" : "degraded",
      mode: env.AI_ENABLED ? "groq" : "fallback",
      model: env.AI_ENABLED ? env.GROQ_MODEL : null,
    },
    storage: {
      status: "ok",
      backend: env.STORAGE,
      ready: env.STORAGE === "firebase" ? firebaseReady : true,
    },
  };
  if (env.STORAGE === "memory") {
    try {
      checks.storage.collections = getStore().stats();
    } catch (err) {
      checks.storage.status = "degraded";
      checks.storage.error = err.message;
    }
  }
  if (env.STORAGE === "firebase" && !firebaseReady) {
    checks.storage.status = "fail";
  }
  const allOk = Object.values(checks).every((c) => c.status !== "fail");
  return {
    status: allOk ? "ok" : "degraded",
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION || "1.0.0",
    checks,
  };
};

export const getHealth = async ({ force = false } = {}) => {
  const now = Date.now();
  if (!force && _cache && now - _cacheTs < CACHE_MS) return _cache;
  const data = await collect();
  _cache = data;
  _cacheTs = now;
  return data;
};

export const healthService = { getHealth };
export default healthService;
