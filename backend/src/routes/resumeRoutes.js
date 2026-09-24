import { Router } from "express";
import { extractResume, generateDocx, analyzeAts } from "../controllers/resumeController.js";
import { uploadFields } from "../middleware/uploadMiddleware.js";

const router = Router();

/**
 * POST /api/resumes/extract-resume
 * Extracts data from resume and returns parsed info + ATS analysis
 */
router.post("/extract-resume", uploadFields, extractResume);

/**
 * POST /api/resumes/generate-docx
 * Body: { resumeData: { ... } }
 * Returns the generated .docx file as a download.
 */
router.post("/generate-docx", generateDocx);

/**
 * POST /api/resumes/analyze-ats
 * Body: { resumeData: { ... }, targetRole: "...", jobDescription: "..." }
 * Returns the ATS analysis result.
 */
router.post("/analyze-ats", analyzeAts);

export default router;
