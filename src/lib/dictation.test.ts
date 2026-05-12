import { describe, expect, it } from "vitest";
import { normalizeWord, scoreDictation, tokenize } from "./dictation";

describe("normalizeWord", () => {
  it("lowercases and strips accents (preserves ñ)", () => {
    expect(normalizeWord("Año")).toBe("año");
    expect(normalizeWord("Nación")).toBe("nacion");
    expect(normalizeWord("¿Cómo?")).toBe("como");
  });
  it("strips punctuation", () => {
    expect(normalizeWord("hola,")).toBe("hola");
    expect(normalizeWord("¡hola!")).toBe("hola");
  });
});

describe("tokenize", () => {
  it("splits on whitespace, trims, filters empty", () => {
    expect(tokenize("  Yo  soy  feliz.  ")).toEqual(["Yo", "soy", "feliz."]);
  });
});

describe("scoreDictation", () => {
  it("100% on identical", () => {
    const r = scoreDictation("Yo soy de México.", "Yo soy de México.");
    expect(r.percent).toBe(100);
    expect(r.correctCount).toBe(4);
    expect(r.expected.every((t) => t.status === "correct")).toBe(true);
  });

  it("accent insensitive on otherwise correct words", () => {
    const r = scoreDictation("Nación", "nacion");
    expect(r.percent).toBe(100);
  });

  it("punctuation-insensitive", () => {
    const r = scoreDictation("¡Hola!", "Hola");
    expect(r.percent).toBe(100);
  });

  it("marks wrong words", () => {
    const r = scoreDictation("Yo soy feliz", "Yo era feliz");
    expect(r.percent).toBe(67); // 2/3 = 66.67% → 67
    expect(r.expected[1]!.status).toBe("wrong");
    expect(r.given[1]!.status).toBe("wrong");
  });

  it("marks missing when given is shorter", () => {
    const r = scoreDictation("Yo soy feliz", "Yo soy");
    expect(r.expected[2]!.status).toBe("missing");
    expect(r.correctCount).toBe(2);
    expect(r.percent).toBe(67);
  });

  it("marks extra when given is longer", () => {
    const r = scoreDictation("Yo soy", "Yo soy muy feliz");
    expect(r.given[2]!.status).toBe("extra");
    expect(r.given[3]!.status).toBe("extra");
  });

  it("empty given → 0%", () => {
    const r = scoreDictation("Yo soy feliz", "");
    expect(r.percent).toBe(0);
    expect(r.correctCount).toBe(0);
  });
});
