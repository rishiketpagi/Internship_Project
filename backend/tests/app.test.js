/**
 * Smoke tests for the API surface.
 *
 * These tests verify that the server boots, returns the right
 * shape of envelope, exposes the documented routes, and applies
 * the right error handling.
 */
import { jest } from "@jest/globals";
import request from "supertest";
import { buildApp } from "../src/app.js";

const SAMPLE_RESUME = `Rishiket Pagi
Goa, India
rishiket@example.com
github.com/rishiketpagi
linkedin.com/in/rishiketpagi

EDUCATION
Goa College of Engineering
Bachelor of Engineering in Computer Engineering
2022 - 2026

SKILLS
JavaScript, React, Node.js, Express.js, Firebase, Git, HTML, CSS

PROJECTS
Resume Generator
Built a web application using React and Firebase that allows users
to create job-specific resumes from existing resume data.

EXPERIENCE
Software Development Intern
ABC Technologies
June 2026 - August 2026
Worked on React applications and implemented REST API integrations.

CERTIFICATIONS
JavaScript Web Development Course

ACHIEVEMENTS
Participated in two hackathons.`;

let app;

beforeAll(async () => {
  app = buildApp();
});

describe("GET /api/info", () => {
  it("returns API metadata", async () => {
    const res = await request(app).get("/api/info");
    expect(res.status).toBe(200);
    expect(res.body.name).toMatch(/Resume/i);
    expect(res.body.endpoints.health).toBe("/health");
    expect(res.body.endpoints.openapi).toBe("/openapi.json");
  });
});

describe("GET /", () => {
  it("serves the minimal HTML UI", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/html/);
    expect(res.text).toMatch(/Resume Generator/);
  });
});

describe("GET /health", () => {
  it("reports a healthy status", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toMatch(/ok|degraded/);
    expect(res.body.data.checks).toBeDefined();
    expect(res.body.data.checks.ai).toBeDefined();
  });
});

describe("POST /api/extract/text", () => {
  it("rejects empty text", async () => {
    const res = await request(app)
      .post("/api/extract/text")
      .send({ text: "" });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("extracts a resume from text", async () => {
    const res = await request(app)
      .post("/api/extract/text")
      .send({ text: SAMPLE_RESUME });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.resume.personalInfo.email).toBe("rishiket@example.com");
    expect(res.body.data.resume.personalInfo.github).toContain("github.com");
    expect(Array.isArray(res.body.data.resume.skills)).toBe(true);
    expect(res.body.data.resume.skills.length).toBeGreaterThan(0);
  });
});

describe("POST /extract-resume (compat)", () => {
  it("accepts JSON text", async () => {
    const res = await request(app)
      .post("/extract-resume")
      .send({ text: SAMPLE_RESUME });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.source).toBe("text");
  });

  it("returns 400 when nothing is provided", async () => {
    const res = await request(app).post("/extract-resume").send({});
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("EMPTY_INPUT");
  });
});

describe("404 handling", () => {
  it("returns a structured 404 envelope", async () => {
    const res = await request(app).get("/nope");
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("ROUTE_NOT_FOUND");
  });
});

describe("Project flow", () => {
  it("runs the full happy path", async () => {
    const created = await request(app).post("/api/projects").send({});
    expect(created.status).toBe(201);
    const id = created.body.data.id;
    expect(id).toBeDefined();

    const roleRes = await request(app)
      .post(`/api/projects/${id}/target-role`)
      .send({ role: "Backend Engineer" });
    expect(roleRes.status).toBe(200);

    const jdRes = await request(app)
      .post(`/api/projects/${id}/job-description`)
      .send({ jobDescription: "Looking for a Node.js engineer with AWS experience." });
    expect(jdRes.status).toBe(200);

    const attachRes = await request(app)
      .post(`/api/projects/${id}/resume`)
      .send({ rawText: SAMPLE_RESUME });
    expect(attachRes.status).toBe(200);
    expect(attachRes.body.data.project.resume.skills.length).toBeGreaterThan(0);

    const analysis = await request(app)
      .post(`/api/projects/${id}/role-analysis`)
      .send({});
    expect(analysis.status).toBe(200);
    expect(analysis.body.data.project.roleAnalysis).toBeDefined();

    const gap = await request(app)
      .post(`/api/projects/${id}/skill-gap`)
      .send({});
    expect(gap.status).toBe(200);
    expect(gap.body.data.project.skillGap).toBeDefined();

    const blueprint = await request(app)
      .post(`/api/projects/${id}/blueprint`)
      .send({});
    expect(blueprint.status).toBe(200);
    expect(blueprint.body.data.project.blueprint).toBeDefined();

    const generated = await request(app)
      .post(`/api/projects/${id}/generate`)
      .send({});
    expect(generated.status).toBe(200);
    expect(generated.body.data.project.generatedResume).toBeDefined();
    expect(generated.body.data.project.qualityCheck).toBeDefined();
  });

  it("blocks generation when prerequisites are missing", async () => {
    const created = await request(app).post("/api/projects").send({});
    const id = created.body.data.id;

    const res = await request(app).post(`/api/projects/${id}/generate`).send({});
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("BAD_REQUEST");
  });
});

describe("Validation", () => {
  it("returns detailed validation errors for /api/extract/text", async () => {
    const res = await request(app)
      .post("/api/extract/text")
      .send({ text: 12345 });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
    expect(Array.isArray(res.body.error.details)).toBe(true);
  });
});
