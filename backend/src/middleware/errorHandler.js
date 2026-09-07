/**
 * Centralized error handling middleware.
 *
 * Every thrown error ends up here. The middleware:
 *   1. Normalizes unknown errors into the standard envelope.
 *   2. Logs full details (with stack) for 5xx and a single
 *      info line for 4xx.
 *   3. Strips out the request body from logs (it may contain
 *      resume content or PII).
 */
import { logger } from "../config/logger.js";
import { HttpError } from "../utils/httpError.js";

export const notFoundHandler = (req, res, next) => {
  // Defer to the error handler so the response envelope is consistent.
  next(new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`, {
    code: "ROUTE_NOT_FOUND",
  }));
};

export const errorHandler = (err, req, res, _next) => {
  const status = Number.isInteger(err.status) ? err.status : 500;
  const code = err.code || (status >= 500 ? "INTERNAL_SERVER_ERROR" : "ERROR");
  const message = status >= 500 && !err.expose
    ? "An unexpected error occurred."
    : err.message || "An unexpected error occurred.";

  const logPayload = {
    requestId: req.id,
    method: req.method,
    url: req.originalUrl,
    status,
    code,
    err: err.name === "HttpError" ? { message: err.message } : err,
  };

  if (status >= 500) {
    logger.error(logPayload, "request failed");
  } else {
    logger.warn({ ...logPayload, err: undefined }, `request rejected: ${message}`);
  }

  const body = {
    success: false,
    error: {
      code,
      message,
      requestId: req.id,
    },
  };

  if (err.details && err.expose !== false) {
    body.error.details = err.details;
  }

  res.status(status).json(body);
};

/**
 * Wrap any thrown error from a sync handler in an HttpError(500)
 * — only used by Express when no error is propagated.
 */
export const fallbackErrorHandler = (err, req, res, next) => errorHandler(err, req, res, next);
