/**
 * Resume extraction routes.
 *
 *   POST /extract-resume          — compat: JSON text OR multipart file
 *   POST /api/extract/text        — REST: JSON { text }
 *   POST /api/extract/file        — REST: multipart file (field "resume")
 */
import { Router } from "express";
import * as ctrl from "../controllers/resume.controller.js";
import { validate } from "../middleware/validate.js";
import { safeUploadSingle } from "../middleware/upload.js";
import { aiLimiter } from "../middleware/rateLimit.js";
import { extractFromTextBody } from "../validators/resumeSchemas.js";

const router = Router();

// Compatibility endpoint (used by the existing frontend).
router.post(
  "/extract-resume",
  ...safeUploadSingle("resume"),
  ctrl.extractResume
);

// REST-ish versions.
router.post(
  "/api/extract/text",
  aiLimiter,
  validate({ body: extractFromTextBody }),
  ctrl.extractFromText
);

router.post(
  "/api/extract/file",
  aiLimiter,
  ...safeUploadSingle("resume"),
  ctrl.extractFromFile
);

export default router;
