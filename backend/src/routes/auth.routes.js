/**
 * Auth routes.
 *
 *   GET /api/auth/me   — return the currently authenticated user
 */
import { Router } from "express";
import * as ctrl from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();
router.use(authMiddleware);

router.get("/me", ctrl.me);

export default router;
