/**
 * Tests for the validation middleware.
 */
import request from "supertest";
import { buildApp } from "../src/app.js";

const app = buildApp();

describe("Validation middleware", () => {
  it("returns 400 with field details on invalid body", async () => {
    const res = await request(app)
      .post("/api/extract/text")
      .send({ text: 123 });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
    expect(res.body.error.details).toBeDefined();
    expect(res.body.error.details[0]).toHaveProperty("part");
    expect(res.body.error.details[0]).toHaveProperty("path");
  });

  it("rejects unknown id patterns", async () => {
    const res = await request(app).get("/api/projects/not%20valid");
    // %20 (space) is encoded, but our pattern is more strict;
    // the request will be caught by 404.
    expect([400, 404]).toContain(res.status);
  });
});
