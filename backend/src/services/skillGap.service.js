/**
 * Skill gap analysis service.
 */
import aiService from "./aiService.js";
import { skillGapSystemPrompt, skillGapUserPrompt } from "../prompts/skillGapPrompt.js";
import { assert } from "../utils/httpError.js";

const fallback = ({ role }) => ({
  role,
  matchingSkills: [],
  partialSkills: [],
  missingSkills: [],
  improvementSuggestions: [
    {
      title: "Configure GROQ_API_KEY",
      details:
        "Skill-gap analysis requires the AI service. Set the GROQ_API_KEY environment variable to enable detailed suggestions.",
      estimatedEffort: "5 minutes",
    },
  ],
  summary:
    "AI is not configured — no concrete skill-gap suggestions are available.",
});

export const analyzeSkillGap = async ({ role, jobDescription, resume }) => {
  assert(role, "role is required");
  assert(resume && typeof resume === "object", "resume is required");
  return aiService.aiOrFallback({
    system: skillGapSystemPrompt,
    user: skillGapUserPrompt({ role, jobDescription, resume }),
    fallback: () => fallback({ role }),
  });
};

export const skillGapService = { analyzeSkillGap };
export default skillGapService;
