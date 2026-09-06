import PDFDocument from "pdfkit";
import { resumeTemplates } from "../templates/resumeTemplates.js";

export async function generateResumePDF(resumeContent, templateId = "classic", options = {}) {
  const template = resumeTemplates[templateId] || resumeTemplates.classic;
  const doc = new PDFDocument({
    font: template.typography.fontFamily,
    autoFirstPage: true,
    margin: template.layout.margins,
  });

  const chunks = [];
  return new Promise((resolve, reject) => {
    doc.on("data", chunk => chunks.push(chunk));
    doc.on("end", () => {
      const buffer = Buffer.concat(chunks);
      resolve(buffer);
    });
    doc.on("error", reject);

    // ===== HEADER / SUMMARY =====
    const fontSizeBase = template.typography.fontSize.base;
    const fontSizeHeading = template.typography.fontSize.heading;
    const lineHeight = template.typography.lineHeight;

    doc.fontSize(fontSizeHeading);

    // Write summary if present
    if (resumeContent.summary) {
      doc.font("Helvetica-Bold").text(resumeContent.summary, {
        indent: template.layout.margins.left,
        lineHeight: lineHeight,
      });
      doc.moveDown(0.5);
    }

    // ===== EXPERIENCE SECTION =====
    if (resumeContent.experience && resumeContent.experience.length > 0) {
      doc.font("Helvetica-Bold").text("Experience", {
        indent: template.layout.margins.left,
        color: "#1a1a2e",
      });
      doc.moveDown(0.3);

      resumeContent.experience.forEach((exp, expIndex) => {
        const expStartSize = fontSizeBase - 1;
        doc.fontSize(expStartSize);

        // Job title and company
        const titleLine = `${exp.jobTitle || "Position"} ${exp.company || ""}`.trim();
        if (titleLine) {
          doc.font("Helvetica-Bold").text(titleLine, {
            indent: template.layout.margins.left,
          });
        }

        // Dates and location
        const metaLine = [
          exp.startDate || "",
          exp.endDate || ""
          .filter(Boolean)
          .map(d => ` - ${d}`)
          .join("")
        ].join(" ").trim();

        if (metaLine) {
          doc.fontSize(fontSizeBase - 2).text(metaLine, {
            indent: template.layout.margins.left + 10,
          });
          doc.fontSize(expStartSize);
        }

        // Location
        if (exp.location) {
          doc.text(`Location: ${exp.location}`, {
            indent: template.layout.margins.left + 10,
          });
        }

        // Description/responsibilities
        if (exp.description) {
          doc.font("Helvetica").text(exp.description, {
            indent: template.layout.margins.left + 10,
            lineHeight: lineHeight - 0.2,
          });
        }

        // Responsibilities bullet points
        if (exp.responsibilities && exp.responsibilities.length > 0) {
          doc.moveDown(0.2);
          exp.responsibilities.forEach((resp, respIndex) => {
            doc.font("Helvetica").text(`• ${resp}`, {
              indent: template.layout.margins.left + 14,
              lineHeight: lineHeight,
            });
          });
        }

        // Move down for next experience
        doc.moveDown(0.5);
      });
    }

    // ===== PROJECTS SECTION =====
    if (resumeContent.projects && resumeContent.projects.length > 0) {
      doc.font("Helvetica-Bold").text("Projects", {
        indent: template.layout.margins.left,
        color: "#1a1a2e",
      });
      doc.moveDown(0.3);

      resumeContent.projects.forEach((proj, projIndex) => {
        doc.fontSize(fontSizeBase - 1).text(`${proj.name || "Project ${projIndex + 1}"}`, {
          indent: template.layout.margins.left,
        });

        if (proj.description) {
          doc.font("Helvetica").text(proj.description, {
            indent: template.layout.margins.left + 10,
            lineHeight: lineHeight - 0.2,
          });
        }

        if (proj.technologies && proj.technologies.length > 0) {
          doc.fontSize(fontSizeBase - 2).text(
            `Technologies: ${proj.technologies.join(", ")}`,
            indent: template.layout.margins.left + 10
          );
        }

        doc.moveDown(0.3);
      });
    }

    // ===== SKILLS SECTION =====
    if (resumeContent.skills && resumeContent.skills.length > 0) {
      doc.font("Helvetica-Bold").text("Skills", {
        indent: template.layout.margins.left,
        color: "#1a1a2e",
      });
      doc.moveDown(0.3);

      resumeContent.skills.forEach((skill, skillIndex) => {
        doc.font("Helvetica").text(skill, {
          indent: template.layout.margins.left + 10,
          lineHeight: lineHeight,
        });
      });
    }

    // ===== EDUCATION SECTION =====
    if (resumeContent.education && resumeContent.education.length > 0) {
      doc.font("Helvetica-Bold").text("Education", {
        indent: template.layout.margins.left,
        color: "#1a1a2e",
      });
      doc.moveDown(0.3);

      resumeContent.education.forEach((edu, eduIndex) => {
        doc.fontSize(fontSizeBase - 1).text(`${edu.degree || "Degree"} in ${edu.field || "Field"}`, {
          indent: template.layout.margins.left,
        });

        if (edu.institution) {
          doc.fontSize(fontSizeBase - 2).text(edu.institution, {
            indent: template.layout.margins.left + 10,
          });
        }

        if (edu.startDate || edu.endDate) {
          const dates = `${edu.startDate || ""} ${edu.endDate || ""}`.trim();
          if (dates) {
            doc.fontSize(fontSizeBase - 3).text(dates, {
              indent: template.layout.margins.left + 10,
            });
          }
        }

        if (edu.grade) {
          doc.text(`Grade: ${edu.grade}`, {
            indent: template.layout.margins.left + 10,
          });
        }

        doc.moveDown(0.3);
      });
    }

    // ===== CERTIFICATIONS SECTION =====
    if (resumeContent.certifications && resumeContent.certifications.length > 0) {
      doc.font("Helvetica-Bold").text("Certifications", {
        indent: template.layout.margins.left,
        color: "#1a1a2e",
      });
      doc.moveDown(0.3);

      resumeContent.certifications.forEach((cert, certIndex) => {
        doc.fontSize(fontSizeBase - 1).text(`${cert.name || "Certification ${certIndex + 1}"}`, {
          indent: template.layout.margins.left,
        });

        if (cert.issuer) {
          doc.fontSize(fontSizeBase - 2).text(`Issuer: ${cert.issuer}`, {
            indent: template.layout.margins.left + 10,
          });
        }

        if (cert.date) {
          doc.text(`Date: ${cert.date}`, {
            indent: template.layout.margins.left + 10,
          });
        }

        doc.moveDown(0.2);
      });
    }

    // ===== ACHIEVEMENTS SECTION =====
    if (resumeContent.achievements && resumeContent.achievements.length > 0) {
      doc.font("Helvetica-Bold").text("Achievements", {
        indent: template.layout.margins.left,
        color: "#1a1a2e",
      });
      doc.moveDown(0.3);

      resumeContent.achievements.forEach((ach, achIndex) => {
        doc.fontSize(fontSizeBase - 1).text(`${ach.title || "Achievement ${achIndex + 1}"}`, {
          indent: template.layout.margins.left,
        });

        if (ach.description) {
          doc.font("Helvetica").text(ach.description, {
            indent: template.layout.margins.left + 10,
            lineHeight: lineHeight - 0.2,
          });
        }

        if (ach.date) {
          doc.text(`Date: ${ach.date}`, {
            indent: template.layout.margins.left + 10,
          });
        }

        doc.moveDown(0.2);
      });
    }

    doc.end();
  });
}

/**
 * Generate a preview HTML string for the resume
 * This can be rendered in the browser for preview before PDF export
 */
export function generateResumePreviewHTML(resumeContent, templateId = "classic") {
  const template = resumeTemplates[templateId] || resumeTemplates.classic;

  const formatDate = (date) => {
    if (!date) return "";
    return typeof date === "string" ? date : `${date.startDate || ""} - ${date.endDate || ""}`;
  };

  const experienceHTML = resumeContent.experience
    .map(
      (exp, i) => `
      <div class="experience">
        <div class="job-title">${exp.jobTitle || "Position"} at ${exp.company || "Company"}</div>
        <div class="meta">${formatDate(exp.startDate)} ${exp.endDate ? ` - ${exp.endDate}` : ""} ${exp.location ? ` | ${exp.location}` : ""}</div>
        <div class="description">${exp.description || ""}</div>
        ${exp.responsibilities && exp.responsibilities.length > 0
          ? `<ul class="responsibilities">
              ${exp.responsibilities.map(r => `<li>${r}</li>`).join("")}
            </ul>`
          : ""
        }
      </div>`
    )
    .join("");

  const projectsHTML = resumeContent.projects
    .map(
      (proj, i) => `
      <div class="project">
        <div class="project-name">${proj.name || "Project ${i + 1}"}</div>
        <div class="project-desc">${proj.description || ""}</div>
        ${proj.technologies && proj.technologies.length > 0
          ? `<div class="technologies">Tech: ${proj.technologies.join(", ")}</div>`
          : ""
        }
      </div>`
    )
    .join("");

  const skillsHTML = resumeContent.skills
    .map(skill => `<span class="skill">${skill}</span>`)
    .join(" ");

  const educationHTML = resumeContent.education
    .map(
      (edu, i) => `
      <div class="education">
        <div>${edu.degree || "Degree"} in ${edu.field || "Field"}</div>
        <div>${edu.institution || "Institution"}</div>
        ${edu.startDate || ""} ${edu.endDate ? ` - ${edu.endDate}` : ""}</div>
      </div>`
    )
    .join("");

  const certificationsHTML = resumeContent.certifications
    .map(
      (cert, i) => `
      <div class="certification">
        ${cert.name || "Certification ${i + 1}"}
        ${cert.issuer ? `<div>Issuer: ${cert.issuer}</div>` : ""}
        ${cert.date ? `<div>Date: ${cert.date}</div>` : ""}
      </div>`
    )
    .join("");

  const achievementsHTML = resumeContent.achievements
    .map(
      (ach, i) => `
      <div class="achievement">
        ${ach.title || "Achievement ${i + 1}"}
        ${ach.description ? `<div>${ach.description}</div>` : ""}
        ${ach.date ? `<div>Date: ${ach.date}</div>` : ""}
      </div>`
    )
    .join("");

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resume Preview</title>
    <style>
      body {
        font-family: ${template.typography.fontFamily};
        margin: 0;
        padding: 20px;
        line-height: ${template.typography.lineHeight};
        color: #333;
        max-width: 8.5in;
        margin: 0 auto;
      }
      h1, h2, h3, .section-title {
        font-weight: bold;
        color: #1a1a2e;
        margin-top: 24px;
      }
      .section {
        margin-bottom: 32px;
      }
      .experience, .project, .education, .certification, .achievement {
        margin-bottom: 16px;
        page-break-inside: avoid;
      }
      .job-title {
        font-size: 14px;
        margin-bottom: 4px;
      }
      .meta {
        font-size: 11px;
        color: #666;
        margin-bottom: 8px;
      }
      .description {
        font-size: 11px;
        margin-bottom: 8px;
      }
      .skills {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        margin-top: 8px;
      }
      .skill {
        font-size: 10px;
        background: #e2e8f0;
        color: #1a1a2e;
        padding: 2px 6px;
        border-radius: 3px;
        font-family: ${template.typography.fontFamily};
      }
      .technologies {
        font-size: 10px;
        color: #666;
        margin-top: 4px;
      }
      h1 {
        font-size: 24px;
        text-align: center;
        margin-bottom: 16px;
      }
    </style>
  </head>
  <body>
    <h1>Resume Preview</h1>
    
    ${resumeContent.summary ? `<p>${resumeContent.summary}</p>` : ""}
    
    <div class="section" id="experience">
      <div class="section-title">Experience</div>
      ${experienceHTML}
    </div>

    <div class="section" id="projects">
      <div class="section-title">Projects</div>
      ${projectsHTML}
    </div>

    <div class="section" id="skills">
      <div class="section-title">Skills</div>
      <div class="skills">${skillsHTML}</div>
    </div>

    <div class="section" id="education">
      <div class="section-title">Education</div>
      ${educationHTML}
    </div>

    <div class="section" id="certifications">
      <div class="section-title">Certifications</div>
      ${certificationsHTML}
    </div>

    <div class="section" id="achievements">
      <div class="section-title">Achievements</div>
      ${achievementsHTML}
    </div>
  </body>
  </html>
  `;
}