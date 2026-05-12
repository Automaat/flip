import { describe, expect, it } from "vitest";
import { familiarityFromState, tokenizeForReader } from "./reader";

describe("tokenizeForReader", () => {
  it("preserves whitespace and punctuation between words", () => {
    const tokens = tokenizeForReader("Hola, mundo.");
    expect(tokens.map((t) => t.raw)).toEqual(["Hola", ", ", "mundo", "."]);
    expect(tokens[0]!.word).toBe("hola");
    expect(tokens[1]!.word).toBeNull();
    expect(tokens[2]!.word).toBe("mundo");
    expect(tokens[3]!.word).toBeNull();
  });

  it("handles Spanish accents and ñ", () => {
    const tokens = tokenizeForReader("Año, está cerca.");
    const words = tokens.filter((t) => t.word).map((t) => t.word);
    expect(words).toEqual(["año", "está", "cerca"]);
  });

  it("lowercases word field but preserves raw case", () => {
    const tokens = tokenizeForReader("MÉXICO es grande.");
    expect(tokens[0]!.raw).toBe("MÉXICO");
    expect(tokens[0]!.word).toBe("méxico");
  });

  it("empty input → empty tokens", () => {
    expect(tokenizeForReader("")).toEqual([]);
  });
});

describe("familiarityFromState", () => {
  it("null → unknown", () => {
    expect(familiarityFromState(null)).toBe("unknown");
  });
  it("review → known", () => {
    expect(familiarityFromState("review")).toBe("known");
  });
  it("new/learning/relearning → learning", () => {
    expect(familiarityFromState("new")).toBe("learning");
    expect(familiarityFromState("learning")).toBe("learning");
    expect(familiarityFromState("relearning")).toBe("learning");
  });
});
