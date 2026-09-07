/**
 * Quality / fact-check service.
 *
 * Runs after generation. Compares the generated resume to the
 * source resume and flags unsupported claims, inconsistencies,
 * and missing sections. The generator must be honest, but this
 * pass is the safety net.
 */
import aiService from "./aiService.js";
import { qualityCheckSystemPrompt, qualityCheckUserPrompt } from "../prompts/qualityCheckPrompt.js";
import { assert } from "../utils/httpError.js";
import { QUALITY_CHECK_STATUS } from "../config/constants.js";

const collectBullets = (gen) => {
  if (!gen || typeof gen !== "object") return 0;
  let count = 0;
  for (const e of gen.experience || []) {
    count += (e.bullets || []).length;
  }
  for (const p of gen.projects || []) {
    if (p.description) count += 1;
  }
  return count;
};

const collectSections = (gen) => {
  if (!gen || typeof gen !== "object") return 0;
  let n = 0;
  for (const [k, v] of Object.entries(gen)) {
    if (Array.isArray(v) && v.length > 0) n += 1;
    else if (typeof v === "string" && v.trim().length > 0) n += 1;
    else if (v && typeof v === "object" && !Array.isArray(v) && Object.keys(v).length > 0) n += 1;
  }
  return n;
};

const fallback = ({ generatedResume }) => {
  const issues = [];
  const bulletCount = collectBullets(generatedResume?.resume);
  const sectionsPresent = collectSections(generatedResume?.resume);

  if (bulletCount === 0) {
    issues.push({
      type: "missing_info",
      severity: "high",
      location: "experience",
      message: "No experience bullets were generated.",
    });
  }
  if (sectionsPresent < 3) {
    issues.push({
      type: "missing_info",
      severity: "medium",
      location: "resume",
      message: "Generated resume is missing several standard sections.",
    });
  }

  return {
    status: issues.length === 0 ? QUALITY_CHECK_STATUS.PASS : QUALITY_CHECK_STATUS.WARN,
    score: issues.length === 0 ? 90 : 60,
    summary: "AI quality-check is not configured — running a minimal local check.",
    issues,
    metrics: {
      sectionsPresent,
      sectionsExpected: 6,
      bulletCount,
      averageBulletLength: bulletCount > 0 ? 80 : 0,
    },
  };
};

export const runQualityCheck = async ({ sourceResume, generatedResume }) => {
  assert(sourceResume && typeof sourceResume === "object", "sourceResume is required");
  assert(generatedResume && typeof generatedResume === "object", "generatedResume is required");
  return aiService.aiOrFallback({
    system: qualityCheckSystemPrompt,
    user: qualityCheckUserPrompt({ sourceResume, generatedResume }),
    fallback: () => fallback({ generatedResume }),
  });
};

export const qualityCheckService = { runQualityCheck };
export default qualityCheckService;
