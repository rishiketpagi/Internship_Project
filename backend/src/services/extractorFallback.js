/**
 * Deterministic, regex/heuristic resume extractor.
 *
 * Used as a fallback when no GROQ_API_KEY is configured. The
 * output is intentionally conservative — it only emits fields
 * it can find clear evidence for in the text.
 *
 * Not "smart" — that's the whole point. It's predictable,
 * dependency-free, and keeps the API working in offline mode.
 */
import { emptyResume, sanitizeResume } from "../data/resumeSchema.js";

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const PHONE_RE = /(?:\+?\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/;
const LINKEDIN_RE = /linkedin\.com\/(?:in|pub)\/[a-zA-Z0-9_-]+/i;
const GITHUB_RE = /github\.com\/[a-zA-Z0-9_-]+/i;
const URL_RE = /https?:\/\/[^\s)]+/i;

const SKILL_DICT = [
  // Languages
  "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Go", "Rust", "PHP", "Ruby", "Kotlin", "Swift",
  // Frontend
  "React", "Vue", "Angular", "Svelte", "Next.js", "Redux", "HTML", "CSS", "Sass", "Tailwind", "Bootstrap",
  // Backend
  "Node.js", "Express", "NestJS", "Django", "Flask", "FastAPI", "Spring", "Spring Boot", "GraphQL", "REST",
  // Mobile
  "React Native", "Flutter", "Android", "iOS",
  // Data
  "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "SQL", "NoSQL", "Kafka", "Airflow",
  // Cloud / DevOps
  "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Helm", "Terraform", "Ansible", "Jenkins", "CI/CD", "Linux",
  // Tools
  "Git", "GitHub", "GitLab", "Jira", "Figma",
  // ML
  "TensorFlow", "PyTorch", "scikit-learn", "Pandas", "NumPy",
  // Data / Other
  "Firebase", "Supabase", "Stripe", "OAuth", "JWT", "WebSockets",
];

const SECTION_HEADS = {
  education: /\b(education|academic|qualifications)\b/i,
  experience: /\b(experience|employment|work experience|professional experience)\b/i,
  projects: /\b(projects?|personal projects|key projects)\b/i,
  skills: /\b(skills|technical skills|technologies)\b/i,
  certifications: /\b(certifications?|licenses?)\b/i,
  achievements: /\b(achievements?|honors?)\b/i,
  awards: /\b(awards?|recognitions?)\b/i,
  hackathons: /\b(hackathons?|competitions?)\b/i,
  volunteer: /\b(volunteer(?:ing| experience)?|community)\b/i,
  publications: /\b(publications?|papers?|research)\b/i,
  courses: /\b(courses?|coursework)\b/i,
  internships: /\b(internships?|internship experience)\b/i,
};

const splitSections = (text) => {
  const lines = text.split(/\r?\n/);
  const sections = {};
  let current = "_top";
  sections[current] = [];
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      sections[current].push("");
      continue;
    }
    let matched = null;
    for (const [name, re] of Object.entries(SECTION_HEADS)) {
      if (re.test(line) && line.length < 50) {
        matched = name;
        break;
      }
    }
    if (matched) {
      current = matched;
      sections[current] = sections[current] || [];
    } else {
      sections[current].push(line);
    }
  }
  return sections;
};

const findFirst = (text, re) => {
  const m = text.match(re);
  return m ? m[0] : "";
};

export const extractWithHeuristics = (text) => {
  const result = emptyResume();
  if (!text || !text.trim()) return result;

  // ---- Personal info from the first ~8 lines ----
  const headLines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean).slice(0, 8);
  const headBlob = headLines.join("\n");

  const nameCandidate = headLines.find((l) =>
    /^[A-Z][a-z]+(?:[ -][A-Z][a-z'’]+){1,3}$/.test(l)
  );
  if (nameCandidate) result.personalInfo.name = nameCandidate;

  result.personalInfo.email = findFirst(headBlob, EMAIL_RE);
  result.personalInfo.phone = findFirst(headBlob, PHONE_RE);
  result.personalInfo.linkedin = findFirst(headBlob, LINKEDIN_RE);
  result.personalInfo.github = findFirst(headBlob, GITHUB_RE);
  result.personalInfo.portfolio = findFirst(headBlob, URL_RE);

  // Location: best-effort, only if a clear "City, State" pattern is on
  // one of the first lines.
  const locLine = headLines.find((l) => /^[A-Z][\w .'-]+,\s*[A-Z]{2,}/.test(l));
  if (locLine) result.personalInfo.location = locLine;

  // ---- Skills ----
  const lower = text.toLowerCase();
  const found = new Set();
  for (const skill of SKILL_DICT) {
    const needle = skill.toLowerCase();
    // Word boundary search
    const re = new RegExp(`(^|[^a-z0-9])${escapeRegex(needle)}([^a-z0-9]|$)`, "i");
    if (re.test(lower)) found.add(skill);
  }
  result.skills = [...found];

  // ---- Sections ----
  const sections = splitSections(text);

  if (sections.education) {
    result.education = sections.education
      .filter((l) => l && l.length > 1)
      .slice(0, 20)
      .map((line) => ({
        institution: line,
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
        grade: "",
      }));
  }
  if (sections.experience) {
    result.workExperience = sections.experience
      .filter((l) => l && l.length > 1)
      .slice(0, 40)
      .map((line) => ({
        jobTitle: line,
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
        responsibilities: [],
      }));
  }
  if (sections.internships) {
    result.internships = sections.internships
      .filter((l) => l && l.length > 1)
      .slice(0, 20)
      .map((line) => ({
        jobTitle: line,
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
        responsibilities: [],
      }));
  }
  if (sections.projects) {
    result.projects = sections.projects
      .filter((l) => l && l.length > 1)
      .slice(0, 30)
      .map((line) => ({
        name: line,
        description: "",
        technologies: [],
        url: "",
        startDate: "",
        endDate: "",
      }));
  }
  if (sections.certifications) {
    result.certifications = sections.certifications
      .filter((l) => l && l.length > 1)
      .slice(0, 20)
      .map((line) => ({ name: line, issuer: "", date: "" }));
  }
  if (sections.achievements) {
    result.achievements = sections.achievements
      .filter((l) => l && l.length > 1)
      .slice(0, 20);
  }
  if (sections.awards) {
    result.awards = sections.awards.filter((l) => l && l.length > 1).slice(0, 20);
  }
  if (sections.hackathons) {
    result.hackathons = sections.hackathons.filter((l) => l && l.length > 1).slice(0, 20);
  }
  if (sections.volunteer) {
    result.volunteerExperience = sections.volunteer
      .filter((l) => l && l.length > 1)
      .slice(0, 20);
  }
  if (sections.publications) {
    result.publications = sections.publications.filter((l) => l && l.length > 1).slice(0, 20);
  }
  if (sections.courses) {
    result.courses = sections.courses
      .filter((l) => l && l.length > 1)
      .slice(0, 20)
      .map((line) => ({ name: line, provider: "", date: "" }));
  }

  return sanitizeResume(result);
};

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export default extractWithHeuristics;
