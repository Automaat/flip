import { describe, expect, it } from "vitest";
import { COGNATE_RULES, findRule } from "./cognate-rules";

describe("COGNATE_RULES", () => {
  it("has ids that are unique", () => {
    const ids = COGNATE_RULES.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every rule has at least 3 examples and 4 quiz items", () => {
    for (const r of COGNATE_RULES) {
      expect(r.examples.length, `${r.id} examples`).toBeGreaterThanOrEqual(3);
      expect(r.quiz.length, `${r.id} quiz`).toBeGreaterThanOrEqual(4);
    }
  });

  it("Spanish entries match the rule's suffix", () => {
    for (const r of COGNATE_RULES) {
      const suffix = r.esSuffix.replace(/^-/, "");
      const items = [...r.examples, ...r.quiz];
      for (const it of items) {
        expect(
          it.es.toLowerCase().endsWith(suffix),
          `${r.id}: '${it.es}' should end with '${suffix}'`,
        ).toBe(true);
      }
    }
  });

  it("English entries (loosely) match the rule's suffix", () => {
    for (const r of COGNATE_RULES) {
      const suffix = r.enSuffix.replace(/^-/, "");
      for (const it of r.quiz) {
        expect(
          it.en.toLowerCase().endsWith(suffix),
          `${r.id}: '${it.en}' should end with '${suffix}'`,
        ).toBe(true);
      }
    }
  });
});

describe("findRule", () => {
  it("returns the rule for a valid id", () => {
    expect(findRule("tion-cion")?.esSuffix).toBe("-ción");
  });

  it("returns undefined for unknown id", () => {
    expect(findRule("does-not-exist")).toBeUndefined();
  });
});
