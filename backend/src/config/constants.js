/**
 * Static, process-wide constants. Anything environment-specific
 * lives in `config/env.js`; this file is for things that never
 * change between deployments.
 */

export const APP_NAME = "Resume Generator API";
export const APP_VERSION = "1.0.0";
export const APP_DESCRIPTION =
  "REST API for the Resume Generator — extraction, role analysis, " +
  "skill gap, blueprint, generation, and PDF export.";

export const SUPPORTED_UPLOAD_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export const SUPPORTED_UPLOAD_EXTENSIONS = new Set([".pdf", ".docx"]);

export const DEFAULT_PAGINATION = Object.freeze({
  page: 1,
  pageSize: 20,
  maxPageSize: 100,
});

export const ROLES = Object.freeze([
  "frontend",
  "backend",
  "fullstack",
  "data-analyst",
  "data-engineer",
  "data-scientist",
  "ml-engineer",
  "devops",
  "mobile",
  "ui-ux",
  "product-manager",
  "qa",
  "security",
  "other",
]);

export const RESUME_STATUS = Object.freeze({
  DRAFT: "draft",
  IN_REVIEW: "in_review",
  GENERATED: "generated",
  EXPORTED: "exported",
});

export const EXPORT_STATUS = Object.freeze({
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
});

export const QUALITY_CHECK_STATUS = Object.freeze({
  PASS: "pass",
  WARN: "warn",
  FAIL: "fail",
});

export const INTERVIEW_STATUS = Object.freeze({
  ACTIVE: "active",
  COMPLETED: "completed",
  ABANDONED: "abandoned",
});
