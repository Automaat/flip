import { describe, expect, it } from "vitest";
import { matchesAnswer, normalize } from "./cognates";

describe("normalize", () => {
  it("lowercases", () => {
    expect(normalize("Nación")).toBe("nacion");
  });

  it("strips accents", () => {
    expect(normalize("año")).toBe("año");
    expect(normalize("nación")).toBe("nacion");
    expect(normalize("rápidamente")).toBe("rapidamente");
  });

  it("trims whitespace", () => {
    expect(normalize("  hola  ")).toBe("hola");
  });
});

describe("matchesAnswer", () => {
  it.each([
    ["nacion", "nación"],
    ["nación", "nación"],
    ["Nación", "nación"],
    ["NACIÓN", "nación"],
    ["  nación  ", "nación"],
    ["absolutamente", "absolutamente"],
    ["absolutaMENTE", "absolutamente"],
  ])("treats %j as matching %j", (actual, expected) => {
    expect(matchesAnswer(actual, expected)).toBe(true);
  });

  it.each([
    ["nation", "nación"],
    ["nacionn", "nación"],
    ["", "nación"],
    ["acción", "nación"],
  ])("rejects %j against %j", (actual, expected) => {
    expect(matchesAnswer(actual, expected)).toBe(false);
  });
});
