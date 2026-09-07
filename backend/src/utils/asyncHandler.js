/**
 * Wrap an async route handler so any rejection is forwarded to
 * the Express error middleware instead of crashing the process.
 *
 *   router.get("/foo", asyncHandler(async (req, res) => { ... }))
 *
 * Without this, a thrown error inside an async handler would
 * result in an unhandled promise rejection.
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
