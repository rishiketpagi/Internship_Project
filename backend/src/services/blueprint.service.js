/**
 * Resume blueprint service.
 *
 * The blueprint tells the generator what to highlight, de-
 * emphasize, drop, and in which order. It must be fact-bound
 * (the generator refuses to invent new information).
 */
import aiService from "./aiService.js";
import { blueprintSystemPrompt, blueprintUserPrompt } from "../prompts/blueprintPrompt.js";
import { assert } from "../utils/httpError.js";

const DEFAULT_SECTION_ORDER = [
  "summary",
  "skills",
  "experience",
  "projects",
  "education",
  "certifications",
  "achievements",
];

const fallback = ({ role, resume }) => {
  const highlights = (resume.workExperience || [])
    .map((exp, i) => ({
      section: "experience",
      id: i,
      reason: exp.jobTitle ? `Most recent role: ${exp.jobTitle}` : "Recent role",
    }))
    .slice(0, 3);
  return {
    role,
    summary: "AI is not configured — using a conservative default ordering.",
    sectionOrder: DEFAULT_SECTION_ORDER,
    highlights,
    deEmphasize: [],
    drop: [],
    targetSkills: (resume.skills || []).slice(0, 12),
    tone: "concise and impact-driven",
  };
};

export const buildBlueprint = async ({ role, jobDescription, resume, roleAnalysis, skillGap }) => {
  assert(role, "role is required");
  assert(resume && typeof resume === "object", "resume is required");
  return aiService.aiOrFallback({
    system: blueprintSystemPrompt,
    user: blueprintUserPrompt({ role, jobDescription, resume, roleAnalysis, skillGap }),
    fallback: () => fallback({ role, resume }),
  });
};

export const blueprintService = { buildBlueprint };
export default blueprintService;
