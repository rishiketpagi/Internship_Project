/**
 * Standalone AI routes — useful for integration tests, batch
 * jobs, and third-party tooling.
 */
import { Router } from "express";
import * as ctrl from "../controllers/ai.controller.js";
import { validate } from "../middleware/validate.js";
import { aiLimiter } from "../middleware/rateLimit.js";
import {
  roleAnalysisBody,
  skillGapBody,
  blueprintBody,
  generatorBody,
} from "../validators/analysisSchemas.js";
import { qualityCheckBody } from "../validators/aiSchemas.js";

const router = Router();
router.use(aiLimiter);

router.post("/role-analysis", validate({ body: roleAnalysisBody }), ctrl.analyzeRole);
router.post("/skill-gap", validate({ body: skillGapBody }), ctrl.analyzeSkillGap);
router.post("/blueprint", validate({ body: blueprintBody }), ctrl.buildBlueprint);
router.post("/generate", validate({ body: generatorBody }), ctrl.generate);
router.post("/quality-check", validate({ body: qualityCheckBody }), ctrl.qualityCheck);
router.get("/templates", ctrl.templates);

export default router;
