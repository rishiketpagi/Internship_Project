/**
 * Tests for the AI service's JSON extraction logic.
 */
import { extractJson } from "../src/services/aiService.js";

describe("extractJson", () => {
  it("parses pure JSON", () => {
    const out = extractJson('{"a": 1, "b": "x"}');
    expect(out).toEqual({ a: 1, b: "x" });
  });

  it("strips ```json fences", () => {
    const out = extractJson('```json\n{"ok": true}\n```');
    expect(out).toEqual({ ok: true });
  });

  it("extracts JSON out of surrounding prose", () => {
    const out = extractJson('Here you go: {"a": 2} cheers!');
    expect(out).toEqual({ a: 2 });
  });

  it("throws on garbage", () => {
    expect(() => extractJson("not json at all")).toThrow(/not valid JSON/);
  });

  it("throws on empty input", () => {
    expect(() => extractJson("")).toThrow(/empty response/);
  });
});
