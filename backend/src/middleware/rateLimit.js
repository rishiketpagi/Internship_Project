/**
 * Sliding-window rate limit middleware.
 *
 * Configurable via RATE_LIMIT_WINDOW_MS / RATE_LIMIT_MAX.
 * In test mode it is a no-op so tests can hammer the API.
 */
import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";
import { HttpError } from "../utils/httpError.js";

const buildLimiter = () => {
  if (env.NODE_ENV === "test") {
    return (_req, _res, next) => next();
  }
  return rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    handler: (_req, _res, next) => {
      next(
        new HttpError(429, "Too many requests, please slow down.", {
          code: "TOO_MANY_REQUESTS",
        })
      );
    },
  });
};

export const apiLimiter = buildLimiter();

/**
 * Stricter limiter for AI endpoints — these are expensive and
 * a noisy client should not be able to rack up a big Groq bill.
 */
export const aiLimiter = (() => {
  if (env.NODE_ENV === "test") {
    return (_req, _res, next) => next();
  }
  return rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: Math.max(5, Math.floor(env.RATE_LIMIT_MAX / 6)),
    standardHeaders: "draft-7",
    legacyHeaders: false,
    handler: (_req, _res, next) => {
      next(
        new HttpError(429, "Too many AI requests, please slow down.", {
          code: "TOO_MANY_REQUESTS",
        })
      );
    },
  });
})();
