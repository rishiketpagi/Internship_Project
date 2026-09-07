/**
 * Resume extraction service.
 *
 * The single entry point used by the API to turn raw text into
 * a structured resume. Uses Groq when available, otherwise
 * falls back to the deterministic extractor.
 */
import aiService from "./aiService.js";
import { extractWithHeuristics } from "./extractorFallback.js";
import {
  extractionSystemPrompt,
  extractionUserPrompt,
} from "../prompts/extractionPrompt.js";
import { sanitizeResume } from "../data/resumeSchema.js";
import { logger } from "../config/logger.js";

export const extractResumeFromText = async (text) => {
  if (!text || !text.trim()) {
    return sanitizeResume({});
  }

  const result = await aiService.aiOrFallback({
    system: extractionSystemPrompt,
    user: extractionUserPrompt(text),
    fallback: () => extractWithHeuristics(text),
  });

  const safe = sanitizeResume(result);
  logger.info(
    {
      mode: aiService.isEnabled() ? "groq" : "fallback",
      skills: safe.skills.length,
      experiences: safe.workExperience.length,
      projects: safe.projects.length,
    },
    "resume extracted"
  );
  return safe;
};

export const extractionService = { extractResumeFromText };
export default extractionService;
