/**
 * Health routes.
 *
 *   GET /health           Liveness + readiness (cached)
 *   GET /health/live      Process liveness (no checks)
 *   GET /health/ready     Full readiness probe
 */
import { Router } from "express";
import * as ctrl from "../controllers/health.controller.js";

const router = Router();

router.get("/", ctrl.getHealth);
router.get("/live", ctrl.getLiveness);
router.get("/ready", ctrl.getReadiness);

export default router;
