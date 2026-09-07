/**
 * Built-in resume templates. Each template describes typography
 * and a section ordering; the PDF exporter consumes this.
 *
 *   id, name, description, sectionOrder, typography, layout
 *
 * Keep the field names stable — the frontend reads them.
 */

export const resumeTemplates = {
  classic: {
    id: "classic",
    name: "Classic",
    description: "A clean, traditional resume layout.",
    sectionOrder: ["summary", "experience", "education", "skills", "projects", "certifications"],
    typography: {
      fontFamily: "Helvetica",
      fontSize: { base: 11, heading: 14, subheading: 12 },
      lineHeight: 1.4,
    },
    layout: {
      pageSize: "LETTER",
      margins: { top: 54, bottom: 54, left: 72, right: 72 },
    },
  },
  modern: {
    id: "modern",
    name: "Modern",
    description: "Contemporary with a tighter grid and minimal chrome.",
    sectionOrder: ["summary", "experience", "projects", "skills", "education"],
    typography: {
      fontFamily: "Helvetica",
      fontSize: { base: 10, heading: 13, subheading: 11 },
      lineHeight: 1.35,
    },
    layout: {
      pageSize: "LETTER",
      margins: { top: 50, bottom: 50, left: 64, right: 64 },
    },
  },
  compact: {
    id: "compact",
    name: "Compact",
    description: "Dense single-page layout for senior candidates.",
    sectionOrder: ["summary", "skills", "experience", "projects", "education", "certifications"],
    typography: {
      fontFamily: "Helvetica",
      fontSize: { base: 10, heading: 12, subheading: 10 },
      lineHeight: 1.25,
    },
    layout: {
      pageSize: "LETTER",
      margins: { top: 40, bottom: 40, left: 50, right: 50 },
    },
  },
};

export const listTemplates = () => Object.values(resumeTemplates);
export const getTemplate = (id) => resumeTemplates[id] || resumeTemplates.classic;
