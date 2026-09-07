/**
 * Top-level router. Mounts every API surface under one place.
 *
 *   /            root metadata
 *   /health      health checks
 *   /docs        Swagger UI
 *   /api/auth    auth (currently just /me)
 *   /api/ai      standalone AI endpoints
 *   /api/projects  project-scoped flow
 *   /extract-resume, /api/extract/*  raw extraction
 */
import { Router } from "express";
import { APP_DESCRIPTION, APP_NAME, APP_VERSION } from "../config/constants.js";
import healthRoutes from "./health.routes.js";
import resumeRoutes from "./resume.routes.js";
import projectRoutes from "./project.routes.js";
import aiRoutes from "./ai.routes.js";
import authRoutes from "./auth.routes.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.get("/api/info", (_req, res) => {
  res.json({
    name: APP_NAME,
    version: APP_VERSION,
    description: APP_DESCRIPTION,
    endpoints: {
      ui: "/",
      health: "/health",
      docs: "/docs",
      openapi: "/openapi.json",
      auth: "/api/auth",
      ai: "/api/ai",
      projects: "/api/projects",
      extract: ["/extract-resume", "/api/extract/text", "/api/extract/file"],
    },
  });
});

router.use("/health", healthRoutes);
router.use("/", resumeRoutes);
router.use("/api/auth", authRoutes);
router.use("/api/ai", aiRoutes);
router.use("/api/projects", projectRoutes);

export default router;
