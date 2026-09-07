/**
 * Tests for the deterministic extraction fallback.
 */
import { extractWithHeuristics } from "../src/services/extractorFallback.js";
import { emptyResume } from "../src/data/resumeSchema.js";

describe("extractWithHeuristics", () => {
  it("returns an empty resume for empty input", () => {
    const result = extractWithHeuristics("");
    expect(result).toEqual(emptyResume());
  });

  it("extracts email, github and linkedin from the header", () => {
    const text = `John Doe
New York, NY
john@example.com
github.com/johndoe
linkedin.com/in/johndoe

EXPERIENCE
Senior Engineer at Foo`;

    const r = extractWithHeuristics(text);
    expect(r.personalInfo.name).toBe("John Doe");
    expect(r.personalInfo.email).toBe("john@example.com");
    expect(r.personalInfo.github).toBe("github.com/johndoe");
    expect(r.personalInfo.linkedin).toBe("linkedin.com/in/johndoe");
  });

  it("detects skills from the SKILLS section", () => {
    const text = `Jane Doe

SKILLS
JavaScript, React, Node.js, AWS, Docker`;
    const r = extractWithHeuristics(text);
    expect(r.skills).toEqual(expect.arrayContaining(["JavaScript", "React", "Node.js", "AWS", "Docker"]));
  });

  it("falls back to a sane empty shape on garbage input", () => {
    const r = extractWithHeuristics("!@#$%^&*()12345");
    expect(r).toEqual(emptyResume());
  });
});
