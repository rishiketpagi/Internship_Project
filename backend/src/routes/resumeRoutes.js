import { Router } from "express";
import {
  createResumeProject,
  setTargetRole,
  setJobDescription,
  uploadResume,
  parseResume,
  connectGitHub,
  githubCallback,
  analyzeGitHub,
  startInterview,
  getInterview,
  submitAnswer,
  getProfile,
  updateProfile,
  verifyProfile,
  roleAnalysis,
  skillGapAnalysis,
  createBlueprint,
  generateResume,
  qualityCheck,
  getResumeVersions,
  saveResumeVersion,
} from "../controllers/resumeProjectController.js";

const router = Router();

// ===== RESUME PROJECT CREATION =====
router.post("/", createResumeProject);

// ===== TARGET ROLE & JD =====
router.post("/:id/target-role", setTargetRole);
router.post("/:id/job-description", setJobDescription);

// ===== RESUME UPLOAD & PARSING =====
router.post("/:id/resume/upload", uploadResume);
router.post("/:id/resume/parse", parseResume);

// ===== GITHUB INTEGRATION =====
router.get("/:id/github/connect", connectGitHub);
router.get("/:id/github/callback", githubCallback);
router.post("/:id/github/analyze", analyzeGitHub);

// ===== INTERVIEW SESSION =====
router.post("/:id/interview/start", startInterview);
router.get("/:id/interview", getInterview);
router.post("/:id/interview/answer", submitAnswer);

// ===== PROFILE CONSOLIDATION & VERIFICATION =====
router.get("/:id/profile", getProfile);
router.patch("/:id/profile", updateProfile);
router.post("/:id/profile/verify", verifyProfile);

// ===== ROLE ANALYSIS =====
router.post("/:id/role-analysis", roleAnalysis);
router.get("/:id/role-analysis", roleAnalysis);

// ===== SKILL GAP ANALYSIS =====
router.post("/:id/skill-gap", skillGapAnalysis);
router.get("/:id/skill-gap", skillGapAnalysis);

// ===== RESUME BLUEPRINT =====
router.post("/:id/blueprint", createBlueprint);
router.get("/:id/blueprint", getBlueprint);

// ===== RESUME GENERATION =====
router.post("/:id/generate", generateResume);
router.get("/:id/generated-resume", getGeneratedResume);

// ===== QUALITY CHECK =====
router.post("/:id/quality-check", qualityCheck);
router.get("/:id/quality-check", getQualityCheck);

// ===== RESUME VERSIONS =====
router.get("/:id/resume-versions", getResumeVersions);
router.post("/:id/resume-versions", saveResumeVersion);

// ===== PDF EXPORT =====
router.post("/:id/export/pdf", exportResumePDF);
router.get("/:id/export/pdf-status/:jobId", getPDFStatus);

export default router;