/**
 * Project routes.
 *
 *   /api/projects                  CRUD
 *   /api/projects/:id/target-role
 *   /api/projects/:id/job-description
 *   /api/projects/:id/resume       attach by JSON or rawText
 *   /api/projects/:id/role-analysis
 *   /api/projects/:id/skill-gap
 *   /api/projects/:id/blueprint
 *   /api/projects/:id/generate
 *   /api/projects/:id/quality-check
 *   /api/projects/:id/preview       (HTML)
 *   /api/projects/:id/export/pdf
 *   /api/projects/:id/export/jobs/:jobId
 *   /api/projects/:id/versions
 *   /api/projects/:id/versions/:versionId
 */
import { Router } from "express";
import Joi from "joi";
import * as ctrl from "../controllers/project.controller.js";
import { validate } from "../middleware/validate.js";
import { aiLimiter, apiLimiter } from "../middleware/rateLimit.js";
import { authMiddleware, requireAuth } from "../middleware/auth.js";
import { idSchema } from "../validators/commonSchemas.js";
import {
  createProjectBody,
  idParam,
  setTargetRoleBody,
  setJobDescriptionBody,
  attachResumeBody,
  analyzeBody,
  generateBody,
  saveVersionBody,
  exportBody,
} from "../validators/projectSchemas.js";

const idAndJobId = Joi.object({ id: idSchema, jobId: idSchema });
const idAndVersionId = Joi.object({ id: idSchema, versionId: idSchema });

const router = Router();

router.use(apiLimiter);
router.use(authMiddleware);

router.get("/", (_req, res) => res.json({ message: "projects root" }));
router.post("/", validate({ body: createProjectBody }), ctrl.createProject);
router.get("/list", ctrl.listProjects);

router.get("/:id", validate({ params: idParam }), ctrl.getProject);
router.delete("/:id", requireAuth, validate({ params: idParam }), ctrl.deleteProject);

router.post(
  "/:id/target-role",
  validate({ params: idParam, body: setTargetRoleBody }),
  ctrl.setTargetRole
);
router.post(
  "/:id/job-description",
  validate({ params: idParam, body: setJobDescriptionBody }),
  ctrl.setJobDescription
);

router.post(
  "/:id/resume",
  aiLimiter,
  validate({ params: idParam, body: attachResumeBody }),
  ctrl.attachResume
);

router.post(
  "/:id/role-analysis",
  aiLimiter,
  validate({ params: idParam, body: analyzeBody }),
  ctrl.analyzeRole
);
router.post(
  "/:id/skill-gap",
  aiLimiter,
  validate({ params: idParam, body: analyzeBody }),
  ctrl.analyzeSkillGap
);
router.post(
  "/:id/blueprint",
  aiLimiter,
  validate({ params: idParam }),
  ctrl.createBlueprint
);
router.post(
  "/:id/generate",
  aiLimiter,
  validate({ params: idParam, body: generateBody }),
  ctrl.generateResume
);
router.get(
  "/:id/quality-check",
  validate({ params: idParam }),
  ctrl.getQualityCheck
);
router.get(
  "/:id/preview",
  validate({ params: idParam }),
  ctrl.renderPreview
);

router.post(
  "/:id/export/pdf",
  validate({ params: idParam, body: exportBody }),
  ctrl.exportPDF
);
router.get(
  "/:id/export/jobs/:jobId",
  validate({ params: idAndJobId }),
  ctrl.getExportJob
);

router.get(
  "/:id/versions",
  validate({ params: idParam }),
  ctrl.listVersions
);
router.post(
  "/:id/versions",
  validate({ params: idParam, body: saveVersionBody }),
  ctrl.saveVersion
);
router.get(
  "/:id/versions/:versionId",
  validate({ params: idAndVersionId }),
  ctrl.getVersion
);

export default router;
