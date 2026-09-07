/**
 * Canonical, empty resume schema — single source of truth for
 * the shape every service is expected to return.
 *
 * The legacy `resumeSchema.json` is kept around for backwards
 * compat with any tooling that already imports it; the live
 * code should import from here.
 */
import { ROLES } from "../config/constants.js";

export const emptyResume = () => ({
  personalInfo: {
    name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    portfolio: "",
  },
  professionalSummary: "",
  education: [],
  workExperience: [],
  internships: [],
  projects: [],
  skills: [],
  certifications: [],
  achievements: [],
  awards: [],
  hackathons: [],
  volunteerExperience: [],
  publications: [],
  courses: [],
});

export const ROLES_LIST = ROLES;

export const RESUME_FIELDS = Object.freeze([
  "personalInfo",
  "professionalSummary",
  "education",
  "workExperience",
  "internships",
  "projects",
  "skills",
  "certifications",
  "achievements",
  "awards",
  "hackathons",
  "volunteerExperience",
  "publications",
  "courses",
]);

/**
 * Defensive deep-clean that strips any non-string/non-array
 * garbage the LLM might invent (functions, symbols, etc.) and
 * caps list lengths so a single rogue generation can't blow up
 * the database.
 */
export const sanitizeResume = (input, { maxArrayLen = 200 } = {}) => {
  if (!input || typeof input !== "object") return emptyResume();
  const base = emptyResume();
  const safe = (v, fallback = "") => (typeof v === "string" ? v : fallback);
  const safeArr = (v) => (Array.isArray(v) ? v.slice(0, maxArrayLen) : []);
  const safeObj = (v) => (v && typeof v === "object" && !Array.isArray(v) ? v : {});

  const pi = safeObj(input.personalInfo);
  base.personalInfo = {
    name: safe(pi.name),
    email: safe(pi.email),
    phone: safe(pi.phone),
    location: safe(pi.location),
    linkedin: safe(pi.linkedin),
    github: safe(pi.github),
    portfolio: safe(pi.portfolio),
  };
  base.professionalSummary = safe(input.professionalSummary);
  base.skills = safeArr(input.skills).map(safe).filter(Boolean);
  base.achievements = safeArr(input.achievements).map(safe).filter(Boolean);
  base.awards = safeArr(input.awards).map(safe).filter(Boolean);
  base.hackathons = safeArr(input.hackathons).map(safe).filter(Boolean);
  base.volunteerExperience = safeArr(input.volunteerExperience).map(safe).filter(Boolean);
  base.publications = safeArr(input.publications).map(safe).filter(Boolean);

  for (const key of ["education", "workExperience", "internships"]) {
    base[key] = safeArr(input[key]).map((e) => safeObj(e));
  }
  base.projects = safeArr(input.projects).map((p) => safeObj(p));
  base.certifications = safeArr(input.certifications).map((c) => safeObj(c));
  base.courses = safeArr(input.courses).map((c) => safeObj(c));

  return base;
};
