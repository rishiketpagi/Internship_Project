export const resumeTemplates = {
  classic: {
    id: "classic",
    name: "Classic",
    description: "A clean, traditional resume layout",
    sectionOrder: ["summary", "experience", "education", "skills", "projects"],
    typography: {
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      fontSize: {
        base: 11,
        heading: 14,
        subheading: 12,
      },
      lineHeight: 1.5,
    },
    spacing: {
      sectionMargin: 24,
      subsectionMargin: 12,
      bulletMargin: 4,
    },
    layout: {
      pageSize: "US Letter",
      margins: { top: 1, bottom: 1, left: 1.5, right: 1.5 },
      useColumns: false,
    },
    previewUrl: "/templates/classic-preview.html",
  },

  modern: {
    id: "modern",
    name: "Modern",
    description: "A contemporary layout with accent color and clean lines",
    sectionOrder: ["summary", "experience", "projects", "skills", "education"],
    typography: {
      fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      fontSize: {
        base: 10,
        heading: 13,
        subheading: 11,
      },
      lineHeight: 1.4,
    },
    spacing: {
      sectionMargin: 20,
      subsectionMargin: 10,
      bulletMargin: 3,
    },
    layout: {
      pageSize: "US Letter",
      margins: { top: 0.8, bottom: 0.8, left: 1, right: 1 },
      useColumns: false,
    },
    previewUrl: "/templates/modern-preview.html",
  },

  creative: {
    id: "creative",
    name: "Creative",
    description: "A visually distinctive layout for creative roles",
    sectionOrder: ["summary", "projects", "experience", "skills", "education"],
    typography: {
      fontFamily: "'Playfair Display', serif',
      headingFont: "'Playfair Display', serif',
      accentFont: "'Inter', sans-serif",
      fontSize: {
        base: 11,
        heading: 16,
        subheading: 13,
      },
      lineHeight: 1.6,
    },
    spacing: {
      sectionMargin: 28,
      subsectionMargin: 14,
      bulletMargin: 5,
    },
    layout: {
      pageSize: "US Letter",
      margins: { top: 1, bottom: 1, left: 2, right: 2 },
      useColumns: false,
    },
    previewUrl: "/templates/creative-preview.html",
  },
};