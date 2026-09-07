/**
 * Tests for the PDF export service.
 */
import { renderResumePDF, renderResumePreviewHTML } from "../src/services/pdfExport.service.js";

const sampleGenerated = {
  resume: {
    header: { name: "Ada Lovelace", title: "Senior Backend Engineer" },
    summary: "10+ years building distributed systems.",
    skills: [{ name: "Node.js" }, { name: "AWS" }, { name: "PostgreSQL" }],
    experience: [
      {
        role: "Staff Engineer",
        company: "Acme",
        startDate: "2020",
        endDate: "Present",
        location: "Remote",
        bullets: ["Built X", "Led Y"],
      },
    ],
    projects: [
      { name: "ResumeAI", description: "Tooling.", technologies: ["TypeScript"], url: "" },
    ],
    education: [{ institution: "MIT", degree: "BS", field: "CS", startDate: "2010", endDate: "2014" }],
    certifications: [{ name: "AWS SAA", issuer: "AWS", date: "2021" }],
    achievements: ["Top 1% Lint"],
  },
  notes: "n/a",
};

describe("renderResumePDF", () => {
  it("returns a non-empty PDF buffer", async () => {
    const buffer = await renderResumePDF(sampleGenerated, "classic");
    expect(Buffer.isBuffer(buffer)).toBe(true);
    expect(buffer.length).toBeGreaterThan(500);
    expect(buffer.slice(0, 4).toString()).toBe("%PDF");
  });

  it("supports the 'modern' and 'compact' templates", async () => {
    const a = await renderResumePDF(sampleGenerated, "modern");
    const b = await renderResumePDF(sampleGenerated, "compact");
    expect(a.length).toBeGreaterThan(500);
    expect(b.length).toBeGreaterThan(500);
  });

  it("throws on missing input", () => {
    // renderResumePDF throws synchronously when the input is
    // missing because the assert runs before the PDFKit setup.
    expect(() => renderResumePDF(null)).toThrow(/generatedResume is required/);
  });
});

describe("renderResumePreviewHTML", () => {
  it("returns a full HTML document with the candidate name", () => {
    const html = renderResumePreviewHTML(sampleGenerated, "classic");
    expect(html).toMatch(/<!doctype html>/i);
    expect(html).toContain("Ada Lovelace");
    expect(html).toContain("Summary");
    expect(html).toContain("Experience");
  });
});
