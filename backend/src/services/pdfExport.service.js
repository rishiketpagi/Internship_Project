/**
 * PDF export service.
 *
 * Renders a generated resume (the structured object the
 * `generatorService` produces) into a PDF buffer using PDFKit.
 *
 * The layout is driven by a `templateId` — see `data/templates.js`.
 * Adding a new template only requires registering it there; the
 * exporter picks it up automatically.
 */
import PDFDocument from "pdfkit";
import { getTemplate } from "../data/templates.js";
import { assert } from "../utils/httpError.js";

const hex = (c) => (typeof c === "string" && /^#?[0-9a-f]{6}$/i.test(c) ? c : null);

const drawHeader = (doc, gen, template) => {
  const heading = template.typography.fontSize.heading;
  const base = template.typography.fontSize.base;
  const head = gen?.header || {};
  if (head.name) {
    doc.font("Helvetica-Bold").fontSize(heading + 4).text(head.name);
  }
  if (head.title) {
    doc.font("Helvetica-Oblique").fontSize(base + 1).fillColor("#444").text(head.title);
    doc.fillColor("black");
  }
  doc.moveDown(0.6);
};

const drawSummary = (doc, gen, template) => {
  const summary = gen?.summary;
  if (!summary) return;
  doc.font("Helvetica-Bold").fontSize(template.typography.fontSize.heading).text("Summary");
  doc.moveDown(0.2);
  doc.font("Helvetica").fontSize(template.typography.fontSize.base).text(summary, {
    align: "left",
    lineGap: 2,
  });
  doc.moveDown(0.6);
};

const drawSkills = (doc, gen, template) => {
  const skills = gen?.skills || [];
  if (!skills.length) return;
  doc.font("Helvetica-Bold").fontSize(template.typography.fontSize.heading).text("Skills");
  doc.moveDown(0.2);
  const text = skills
    .map((s) => (typeof s === "string" ? s : s?.name))
    .filter(Boolean)
    .join("  •  ");
  doc.font("Helvetica").fontSize(template.typography.fontSize.base).text(text, { lineGap: 1 });
  doc.moveDown(0.6);
};

const drawExperience = (doc, gen, template) => {
  const items = gen?.experience || [];
  if (!items.length) return;
  doc.font("Helvetica-Bold").fontSize(template.typography.fontSize.heading).text("Experience");
  doc.moveDown(0.2);
  for (const exp of items) {
    const title = [exp.role, exp.company].filter(Boolean).join(" — ");
    const dates = [exp.startDate, exp.endDate].filter(Boolean).join(" – ");
    const meta = [dates, exp.location].filter(Boolean).join(" · ");
    if (title) {
      doc.font("Helvetica-Bold").fontSize(template.typography.fontSize.base + 1).text(title);
    }
    if (meta) {
      doc.font("Helvetica-Oblique").fontSize(template.typography.fontSize.base - 1).fillColor("#555").text(meta);
      doc.fillColor("black");
    }
    for (const bullet of exp.bullets || []) {
      doc.font("Helvetica").fontSize(template.typography.fontSize.base).text(`• ${bullet}`, { lineGap: 1 });
    }
    doc.moveDown(0.4);
  }
};

const drawProjects = (doc, gen, template) => {
  const items = gen?.projects || [];
  if (!items.length) return;
  doc.font("Helvetica-Bold").fontSize(template.typography.fontSize.heading).text("Projects");
  doc.moveDown(0.2);
  for (const p of items) {
    doc.font("Helvetica-Bold").fontSize(template.typography.fontSize.base + 1).text(p.name || "Project");
    if (p.description) {
      doc.font("Helvetica").fontSize(template.typography.fontSize.base).text(p.description, { lineGap: 1 });
    }
    if (Array.isArray(p.technologies) && p.technologies.length) {
      doc.font("Helvetica-Oblique").fontSize(template.typography.fontSize.base - 1).fillColor("#555")
        .text(`Tech: ${p.technologies.join(", ")}`);
      doc.fillColor("black");
    }
    if (p.url) {
      doc.font("Helvetica").fontSize(template.typography.fontSize.base - 1).fillColor("#1a56db").text(p.url);
      doc.fillColor("black");
    }
    doc.moveDown(0.3);
  }
};

const drawEducation = (doc, gen, template) => {
  const items = gen?.education || [];
  if (!items.length) return;
  doc.font("Helvetica-Bold").fontSize(template.typography.fontSize.heading).text("Education");
  doc.moveDown(0.2);
  for (const e of items) {
    const line = [e.degree, e.field].filter(Boolean).join(", ");
    const meta = [e.institution, [e.startDate, e.endDate].filter(Boolean).join(" – ")]
      .filter(Boolean)
      .join(" · ");
    if (line) {
      doc.font("Helvetica-Bold").fontSize(template.typography.fontSize.base + 1).text(line);
    }
    if (meta) {
      doc.font("Helvetica").fontSize(template.typography.fontSize.base - 1).fillColor("#555").text(meta);
      doc.fillColor("black");
    }
    doc.moveDown(0.3);
  }
};

const drawCertifications = (doc, gen, template) => {
  const items = gen?.certifications || [];
  if (!items.length) return;
  doc.font("Helvetica-Bold").fontSize(template.typography.fontSize.heading).text("Certifications");
  doc.moveDown(0.2);
  for (const c of items) {
    const line = [c.name, c.issuer, c.date].filter(Boolean).join(" — ");
    if (line) doc.font("Helvetica").fontSize(template.typography.fontSize.base).text(`• ${line}`);
  }
  doc.moveDown(0.4);
};

const drawAchievements = (doc, gen, template) => {
  const items = gen?.achievements || [];
  if (!items.length) return;
  doc.font("Helvetica-Bold").fontSize(template.typography.fontSize.heading).text("Achievements");
  doc.moveDown(0.2);
  for (const a of items) {
    doc.font("Helvetica").fontSize(template.typography.fontSize.base).text(`• ${a}`);
  }
};

/**
 * Render a generated resume into a PDF buffer.
 *
 * @param {object} generatedResume  Output of the generator service
 * @param {string} [templateId]     One of the keys in data/templates.js
 * @returns {Promise<Buffer>}
 */
export const renderResumePDF = (generatedResume, templateId = "classic") => {
  assert(generatedResume && typeof generatedResume === "object", "generatedResume is required");
  const template = getTemplate(templateId);
  const gen = generatedResume.resume || generatedResume;

  const doc = new PDFDocument({
    size: template.layout.pageSize || "LETTER",
    margins: template.layout.margins,
    info: { Title: "Resume", Producer: "Resume Generator Backend" },
  });

  const chunks = [];
  return new Promise((resolve, reject) => {
    doc.on("data", (c) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const order = template.sectionOrder || [];

    // Header is always at the top, then sections per the template order.
    drawHeader(doc, gen, template);
    for (const section of order) {
      switch (section) {
        case "summary":
          drawSummary(doc, gen, template);
          break;
        case "skills":
          drawSkills(doc, gen, template);
          break;
        case "experience":
          drawExperience(doc, gen, template);
          break;
        case "projects":
          drawProjects(doc, gen, template);
          break;
        case "education":
          drawEducation(doc, gen, template);
          break;
        case "certifications":
          drawCertifications(doc, gen, template);
          break;
        case "achievements":
          drawAchievements(doc, gen, template);
          break;
        default:
          break;
      }
    }

    doc.end();
  });
};

/**
 * Render a small, dependency-free HTML preview of a generated
 * resume. Useful for the "Preview" step before exporting to PDF.
 */
export const renderResumePreviewHTML = (generatedResume, templateId = "classic") => {
  assert(generatedResume && typeof generatedResume === "object", "generatedResume is required");
  const template = getTemplate(templateId);
  const gen = generatedResume.resume || generatedResume;

  const escape = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const sectionHtml = (title, inner) =>
    `<section class="rg-section"><h2>${escape(title)}</h2>${inner}</section>`;

  const expHtml = (gen.experience || [])
    .map(
      (e) => `
      <article class="rg-item">
        <h3>${escape([e.role, e.company].filter(Boolean).join(" — "))}</h3>
        <p class="rg-meta">${escape([ [e.startDate, e.endDate].filter(Boolean).join(" – "), e.location].filter(Boolean).join(" · "))}</p>
        <ul>${(e.bullets || []).map((b) => `<li>${escape(b)}</li>`).join("")}</ul>
      </article>`
    )
    .join("");

  const projHtml = (gen.projects || [])
    .map(
      (p) => `
      <article class="rg-item">
        <h3>${escape(p.name || "Project")}</h3>
        <p>${escape(p.description || "")}</p>
        ${p.technologies?.length ? `<p class="rg-meta">Tech: ${escape(p.technologies.join(", "))}</p>` : ""}
        ${p.url ? `<p><a href="${escape(p.url)}">${escape(p.url)}</a></p>` : ""}
      </article>`
    )
    .join("");

  const eduHtml = (gen.education || [])
    .map(
      (e) => `
      <article class="rg-item">
        <h3>${escape([e.degree, e.field].filter(Boolean).join(", "))}</h3>
        <p class="rg-meta">${escape([e.institution, [e.startDate, e.endDate].filter(Boolean).join(" – ")].filter(Boolean).join(" · "))}</p>
      </article>`
    )
    .join("");

  const certHtml = (gen.certifications || [])
    .map((c) => `<li>${escape([c.name, c.issuer, c.date].filter(Boolean).join(" — "))}</li>`)
    .join("");

  const achHtml = (gen.achievements || []).map((a) => `<li>${escape(a)}</li>`).join("");

  const skillsHtml = (gen.skills || [])
    .map((s) => (typeof s === "string" ? s : s?.name))
    .filter(Boolean)
    .map((s) => `<span class="rg-chip">${escape(s)}</span>`)
    .join(" ");

  const sections = [];
  for (const section of template.sectionOrder || []) {
    if (section === "summary" && gen.summary) {
      sections.push(sectionHtml("Summary", `<p>${escape(gen.summary)}</p>`));
    } else if (section === "skills" && skillsHtml) {
      sections.push(sectionHtml("Skills", `<div class="rg-chips">${skillsHtml}</div>`));
    } else if (section === "experience" && expHtml) {
      sections.push(sectionHtml("Experience", expHtml));
    } else if (section === "projects" && projHtml) {
      sections.push(sectionHtml("Projects", projHtml));
    } else if (section === "education" && eduHtml) {
      sections.push(sectionHtml("Education", eduHtml));
    } else if (section === "certifications" && certHtml) {
      sections.push(sectionHtml("Certifications", `<ul>${certHtml}</ul>`));
    } else if (section === "achievements" && achHtml) {
      sections.push(sectionHtml("Achievements", `<ul>${achHtml}</ul>`));
    }
  }

  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8" />
<title>${escape(gen?.header?.name || "Resume Preview")}</title>
<style>
  :root { color-scheme: light; }
  body { font-family: ${template.typography.fontFamily}, system-ui, sans-serif;
         max-width: 780px; margin: 32px auto; padding: 0 24px;
         color: #111; line-height: ${template.typography.lineHeight}; }
  header h1 { margin: 0 0 4px; font-size: 28px; }
  header p  { margin: 0 0 24px; color: #555; font-style: italic; }
  .rg-section { margin: 24px 0; }
  .rg-section h2 { font-size: 16px; text-transform: uppercase; letter-spacing: 1px;
                   border-bottom: 1px solid #ddd; padding-bottom: 4px; margin: 0 0 12px; }
  .rg-item { margin: 0 0 16px; }
  .rg-item h3 { margin: 0 0 2px; font-size: 15px; }
  .rg-meta { color: #666; font-size: 12px; margin: 0 0 6px; }
  ul { padding-left: 18px; margin: 4px 0 0; }
  .rg-chip { display: inline-block; background: #eef2ff; color: #1e3a8a;
             padding: 2px 8px; border-radius: 999px; font-size: 12px; margin: 2px; }
</style>
</head><body>
<header>
  <h1>${escape(gen?.header?.name || "Your Name")}</h1>
  <p>${escape(gen?.header?.title || "")}</p>
</header>
${sections.join("\n")}
</body></html>`;
};

export const pdfExportService = { renderResumePDF, renderResumePreviewHTML };
export default pdfExportService;
