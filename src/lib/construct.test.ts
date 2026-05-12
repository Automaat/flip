import { describe, expect, it } from "vitest";
import { constructTokens, isConstructionCorrect, shuffle } from "./construct";

describe("constructTokens", () => {
  it("splits on whitespace, keeps punctuation on tokens", () => {
    expect(constructTokens("Yo soy de México.")).toEqual(["Yo", "soy", "de", "México."]);
  });
});

describe("shuffle", () => {
  it("preserves all items", () => {
    const out = shuffle([1, 2, 3, 4, 5], 42);
    expect(out.toSorted()).toEqual([1, 2, 3, 4, 5]);
  });
  it("is deterministic for the same seed", () => {
    expect(shuffle([1, 2, 3, 4, 5], 7)).toEqual(shuffle([1, 2, 3, 4, 5], 7));
  });
});

describe("isConstructionCorrect", () => {
  it("returns true on exact match", () => {
    const t = constructTokens("Yo soy de México.");
    expect(isConstructionCorrect(t, t)).toBe(true);
  });
  it("ignores accents and case", () => {
    expect(
      isConstructionCorrect(
        constructTokens("Yo soy de México."),
        constructTokens("yo SOY de mexico"),
      ),
    ).toBe(true);
  });
  it("wrong order → false", () => {
    expect(
      isConstructionCorrect(
        constructTokens("Yo soy de México."),
        constructTokens("Soy yo de México."),
      ),
    ).toBe(false);
  });
  it("missing word → false", () => {
    expect(
      isConstructionCorrect(
        constructTokens("Yo soy de México."),
        constructTokens("Yo soy México."),
      ),
    ).toBe(false);
  });
});
