// Vercel serverless entry. The function is mounted at /api/* in vercel.json
// and proxies any /extract-resume or /api/* request to this handler.
//
// For local development use backend/src/index.js (which boots on PORT 5000).
import app from "../src/app.js";

export default app;
