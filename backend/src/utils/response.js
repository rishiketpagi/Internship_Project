/**
 * Uniform API response envelope.
 *
 * All successful responses look like:
 *   { "success": true,  "data": ..., "meta": {...} }
 *
 * All failed responses look like:
 *   { "success": false, "error": { "code", "message", "details"? } }
 *
 * The shape is enforced by the response middleware in app.js,
 * so controllers / services can simply call res.ok(data) or
 * res.fail(...).
 */

export const ok = (res, data, meta) =>
  res.json({
    success: true,
    data,
    ...(meta ? { meta } : {}),
  });

export const created = (res, data) =>
  res.status(201).json({ success: true, data });

export const noContent = (res) => res.status(204).send();

export const fail = (res, status, code, message, details) =>
  res.status(status).json({
    success: false,
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
  });
