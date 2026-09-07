/**
 * Health controller. Exposes a single endpoint that monitoring
 * tools (k8s, uptime services) can hit.
 */
import asyncHandler from "../utils/asyncHandler.js";
import { ok } from "../utils/response.js";
import healthService from "../services/health.service.js";

export const getHealth = asyncHandler(async (req, res) => {
  const force = req.query.force === "1" || req.query.force === "true";
  const data = await healthService.getHealth({ force });
  ok(res, data);
});

export const getLiveness = asyncHandler(async (_req, res) => {
  ok(res, { status: "ok", timestamp: new Date().toISOString() });
});

export const getReadiness = asyncHandler(async (_req, res) => {
  const data = await healthService.getHealth({ force: true });
  ok(res, data);
});
