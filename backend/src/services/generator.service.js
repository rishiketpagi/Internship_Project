/**
 * Resume generation service.
 *
 * The generator turns the candidate's verified resume + the
 * blueprint into a polished, render-ready structured resume.
 *
 * Factuality is enforced by the prompt — the model is told
 * explicitly that it may only use information already in the
 * source resume. The quality-check service runs as a second
 * pass to catch drift.
 */
import aiService from "./aiService.js";
import { generationSystemPrompt, generationUserPrompt } from "../prompts/generatorPrompt.js";
import { assert } from "../utils/httpError.js";

const fallback = ({ resume, blueprint }) => {
  const header = {
    name: resume.personalInfo?.name || "",
    title: blueprint?.role || "",
  };
  const summary =
    resume.professionalSummary ||
    `${resume.personalInfo?.name || "Candidate"} — ${blueprint?.role || "professional"} with ` +
      `${(resume.workExperience || []).length} roles and ${(resume.skills || []).length} skills on file.`;

  const experience = (resume.workExperience || []).map((e) => ({
    company: e.company || "",
    role: e.jobTitle || "",
    startDate: e.startDate || "",
    endDate: e.endDate || "",
    location: e.location || "",
    bullets: [
      e.description,
      ...(e.responsibilities || []),
    ].filter(Boolean),
  }));

  const projects = (resume.projects || []).map((p) => ({
    name: p.name || "",
    description: p.description || "",
    technologies: p.technologies || [],
    url: p.url || "",
  }));

  const education = (resume.education || []).map((e) => ({
    institution: e.institution || "",
    degree: e.degree || "",
    field: e.field || "",
    startDate: e.startDate || "",
    endDate: e.endDate || "",
  }));

  const certifications = (resume.certifications || []).map((c) => ({
    name: c.name || "",
    issuer: c.issuer || "",
    date: c.date || "",
  }));

  return {
    resume: {
      header,
      summary,
      skills: (resume.skills || []).map((s) => ({ name: s, level: "" })),
      experience,
      projects,
      education,
      certifications,
      achievements: resume.achievements || [],
    },
    notes: "Generated without AI (GROQ_API_KEY not set) — please review carefully.",
  };
};

export const generateResume = async ({ role, jobDescription, resume, blueprint }) => {
  assert(role, "role is required");
  assert(resume && typeof resume === "object", "resume is required");
  assert(blueprint && typeof blueprint === "object", "blueprint is required");
  return aiService.aiOrFallback({
    system: generationSystemPrompt,
    user: generationUserPrompt({ role, jobDescription, resume, blueprint }),
    fallback: () => fallback({ resume, blueprint }),
  });
};

export const generatorService = { generateResume };
export default generatorService;
