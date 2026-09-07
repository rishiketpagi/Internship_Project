/**
 * Build the Express app.
 *
 * Kept separate from `index.js` so the app can be mounted
 * inside tests without binding a real port.
 */
import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import router from "./routes/index.js";
import { requestContext } from "./middleware/requestContext.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { openapiSpec } from "./config/openapi.js";
import { apiLimiter } from "./middleware/rateLimit.js";
import swaggerUi from "swagger-ui-express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const buildApp = () => {
  const app = express();

  // Trust X-Forwarded-* headers only when explicitly configured.
  app.set("trust proxy", env.TRUST_PROXY);

  // Disable the X-Powered-By header to make stack fingerprinting harder.
  app.disable("x-powered-by");

  // ---- Security / network hardening ----
  app.use(
    helmet({
      contentSecurityPolicy: false, // the inline minimal UI disables CSP
      crossOriginEmbedderPolicy: false,
    })
  );
  app.use(
    cors({
      origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN,
      credentials: true,
      methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Request-Id", "X-Dev-Bypass", "X-Dev-Uid", "X-Dev-Email"],
      exposedHeaders: ["X-Request-Id", "X-Export-Job-Id", "X-Export-Template"],
    })
  );
  app.use(compression());

  // ---- Request context ----
  app.use(requestContext);

  // ---- Body parsers ----
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true, limit: "2mb" }));

  // ---- API routes (registered BEFORE the static UI so they
  //      always win for paths they own) ----
  app.use(router);

  // ---- Swagger UI ----
  app.get("/openapi.json", (_req, res) => res.json(openapiSpec));
  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(openapiSpec, {
      customSiteTitle: "Resume Generator API Docs",
    })
  );

  // ---- Rate limit on the AI surface ----
  app.use("/api/ai", apiLimiter);

  // ---- Minimal UI (serves /index.html for any unmatched GET) ----
  app.use("/", express.static(path.resolve(__dirname, "../public"), { index: "index.html" }));

  // ---- 404 + error handlers (must be last) ----
  app.use(notFoundHandler);
  app.use(errorHandler);

  // Logger attaches for every request (pino-http is a thin wrapper
  // around the same logger we use elsewhere).
  app.use((req, _res, next) => {
    logger.debug({ requestId: req.id, url: req.originalUrl, method: req.method }, "incoming");
    next();
  });

  return app;
};

export default buildApp;
