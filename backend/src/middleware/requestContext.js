/**
 * Attaches a unique request ID to every request so logs and
 * downstream services can be correlated.
 *
 *   - Honors `X-Request-Id` from the client when present.
 *   - Generates a fresh UUID v4 otherwise.
 *   - Echoes the ID back via the `X-Request-Id` response header.
 *   - Adds `req.id` so handlers / services can include it in
 *     their own log entries.
 */
import { v4 as uuidv4 } from "uuid";
import { logger } from "../config/logger.js";

export const REQUEST_ID_HEADER = "x-request-id";

export const requestContext = (req, res, next) => {
  const incoming = req.headers[REQUEST_ID_HEADER];
  req.id = typeof incoming === "string" && incoming.length <= 128
    ? incoming
    : uuidv4();
  res.setHeader("X-Request-Id", req.id);

  // Lightweight access log — pino-http is wired in app.js for
  // full request/response logging, this is just to make a
  // request boundary visible in tests.
  const started = process.hrtime.bigint();
  res.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - started) / 1e6;
    logger.debug(
      {
        requestId: req.id,
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        durationMs: Math.round(durationMs * 100) / 100,
      },
      "request complete"
    );
  });

  next();
};
