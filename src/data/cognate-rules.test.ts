import { describe, expect, it } from "vitest";
import { COGNATE_RULES, findRule } from "./cognate-rules";

const stripAccents = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "");

describe("COGNATE_RULES", () => {
  it("has the FEATURES.md target of 24 rules", () => {
    expect(COGNATE_RULES.length).toBeGreaterThanOrEqual(24);
  });

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
      const suffix = stripAccents(r.esSuffix.replace(/^-/, "").toLowerCase());
      const items = [...r.examples, ...r.quiz];
      for (const entry of items) {
        const normalized = stripAccents(entry.es.toLowerCase());
        expect(
          normalized.endsWith(suffix),
          `${r.id}: '${entry.es}' should end with '${r.esSuffix}'`,
        ).toBe(true);
      }
    }
  });

  it("English entries (loosely) match the rule's suffix", () => {
    for (const r of COGNATE_RULES) {
      const suffix = r.enSuffix.replace(/^-/, "");
      for (const entry of r.quiz) {
        expect(
          entry.en.toLowerCase().endsWith(suffix),
          `${r.id}: '${entry.en}' should end with '${suffix}'`,
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
