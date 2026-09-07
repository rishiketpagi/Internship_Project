/**
 * Role analysis service.
 *
 * Given a role + (optional JD) + a candidate resume, produces
 * a structured relevance ranking.
 */
import aiService from "./aiService.js";
import {
  roleAnalysisSystemPrompt,
  roleAnalysisUserPrompt,
} from "../prompts/roleAnalysisPrompt.js";
import { assert, HttpError } from "../utils/httpError.js";
import { ROLES } from "../config/constants.js";

const fallback = ({ role }) => ({
  role,
  overallScore: 50,
  summary:
    "AI is not configured — this is a placeholder analysis. " +
    "Set GROQ_API_KEY to receive a detailed role-fit report.",
  skillMatch: { score: 50, matching: [], partial: [], missing: [] },
  projectMatch: { score: 50, highlights: [], gaps: [] },
  experienceMatch: { score: 50, strengths: [], gaps: [] },
  recommendations: [
    "Configure GROQ_API_KEY to enable real role analysis.",
  ],
});

export const analyzeRole = async ({ role, jobDescription, resume }) => {
  assert(role, "role is required");
  assert(resume && typeof resume === "object", "resume is required");
  if (ROLES.length && !ROLES.includes(role) && !looksFreeForm(role)) {
    throw new HttpError(400, `Unknown role '${role}'`, { code: "UNKNOWN_ROLE" });
  }

  return aiService.aiOrFallback({
    system: roleAnalysisSystemPrompt,
    user: roleAnalysisUserPrompt({ role, jobDescription, resume }),
    fallback: () => fallback({ role }),
  });
};

const looksFreeForm = (role) => role && role.length >= 2 && role.length <= 80;

export const roleAnalysisService = { analyzeRole };
export default roleAnalysisService;
