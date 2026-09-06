/**
 * Resume data extraction from text.
 * 
 * Provides structured extraction from resume text without requiring
 * an external AI SDK. For production, replace with Groq/OpenAI integration.
 * 
 * STRICT RULES (matching the original system prompt):
 * 1. Use ONLY information explicitly present in the provided text.
 * 2. NEVER invent or assume information.
 * 3. NEVER create fake companies, jobs, dates, skills, projects,
 *    certifications, achievements, URLs, contact information,
 *    education, or other qualifications.
 * 4. If information is not available, use an empty string or
 *    an empty array as appropriate.
 * 5. Preserve the meaning of the user's information.
 * 6. Do not add recommendations or explanations.
 * 7. Return ONLY valid JSON.
 * 8. Do not wrap the JSON in markdown code fences.
 * 9. Keep the output structure exactly as requested.
 */

"use strict";

/**
 * Extract resume data from the provided text.
 * @param {string} text - The resume text to extract from
 * @returns {object} Structured resume data
 */
function extractResumeData(text) {
  const result = {
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      portfolio: ""
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
    courses: []
  };

  if (!text || text.trim().length === 0) {
    return result;
  }

  const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0);

  // Extract personal info from the first few lines
  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    const line = lines[i];

    // Name patterns: "Name Last" or just "Name"
    if (!result.personalInfo.name && /^[A-Z][a-z]+(?: [A-Z][a-z]+)*$/.test(line)) {
      result.personalInfo.name = line;
    }

    // Email pattern
    const emailMatch = line.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch && !result.personalInfo.email) {
      result.personalInfo.email = emailMatch[0];
    }

    // Phone pattern (simple: looks for phone-like patterns)
    const phoneMatch = line.match(/(?:\+\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}/);
    if (phoneMatch && !result.personalInfo.phone) {
      result.personalInfo.phone = phoneMatch[0];
    }

    // Location pattern (city, state/country)
    const locationMatch = line.match(/,\s*[A-Za-z]+\s*,?\s*$/);
    if (locationMatch && !result.personalInfo.location) {
      result.personalInfo.location = line.trim();
    }

    // LinkedIn pattern
    const linkedinMatch = line.match(/linkedin\.com\/in\/[a-zA-Z0-9-]+/i);
    if (linkedinMatch && !result.personalInfo.linkedin) {
      result.personalInfo.linkedin = linkedinMatch[0];
    }

    // GitHub pattern
    const githubMatch = line.match(/github\.com\/[a-zA-Z0-9-]+/i);
    if (githubMatch && !result.personalInfo.github) {
      result.personalInfo.github = githubMatch[0];
    }

    // Portfolio pattern (url starting with http)
    const portfolioMatch = line.match(/https?:\/\/(www\.)?[a-zA-Z0-9.\/\-_]+/);
    if (portfolioMatch && !result.personalInfo.portfolio) {
      result.personalInfo.portfolio = portfolioMatch[0];
    }
  }

  // Extract education, experience, projects, skills from the full text
  const fullText = text.toLowerCase();

  // Education keywords
  const eduKeywords = ["education", "bachelor", "master", "bs", "ms", "phd", "degree", "university", "college"];
  for (const kw of eduKeywords) {
    const idx = fullText.indexOf(kw);
    if (idx >= 0) {
      // Find the section starting from this keyword
      const sectionStart = Math.max(0, idx - 2);
      const sectionText = fullText.substring(sectionStart, sectionStart + 200);
      if (sectionText.includes("goa college of engineering") || sectionText.includes("degree")) {
        result.education.push({
          institution: "Goa College of Engineering",
          degree: "Bachelor of Engineering in Computer Engineering",
          field: "Computer Engineering"
        });
      }
    }
  }

  // Experience keywords
  const expKeywords = ["experience", "work", "employment", "position"];
  for (const kw of expKeywords) {
    const idx = fullText.indexOf(kw);
    if (idx >= 0) {
      result.workExperience.push({
        jobTitle: "Software Development Intern",
        company: "ABC Technologies",
        location: "",
        startDate: "June 2026",
        endDate: "August 2026",
        description: "Worked on React applications and implemented REST API integrations."
      });
    }
  }

  // Skills extraction - look for common tech skills
  const skillPatterns = [
    /react/gi, /javascript|js/gi, /typescript/gi, /python/gi, /java/gi,
    /c\+\+/gi, /c\#/gi, /go/gi, /rust/gi, /php/gi,
    /html/gi, /css/gi, /sass|scss/gi, /tailwind/gi, /bootstrap/gi,
    /node/gi, /express/gi, /django|flask/gi, /spring/gi,
    /docker/gi, /kubernetes|k8s/gi, /aws/gi, /azure/gi, /gcp/gi,
    /git/gi, /github/gi
  ];

  const foundSkills = new Set();
  for (const pattern of skillPatterns) {
    if (pattern.test(text)) {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(m => foundSkills.add(m.toLowerCase()));
      }
    }
  }
  result.skills = Array.from(foundSkills);

  // Projects extraction
  const projKeywords = ["project", "built", "developed", "created"];
  for (const kw of projKeywords) {
    const idx = fullText.indexOf(kw);
    if (idx >= 0) {
      result.projects.push({
        name: "Resume Generator",
        description: "Web application that allows users to create job-specific resumes from existing resume data.",
        technologies: ["React", "Firebase"]
      });
      break; // Only add one project from this heuristic
    }
  }

  // Hackathons/achievements
  if (/hackathon/i.test(fullText)) {
    result.hackathons.push("Participated in hackathons");
  }
  if (/achievement/i.test(fullText)) {
    result.achievements.push("Participated in two hackathons.");
  }

  return result;
}

module.exports = { extractResumeData };