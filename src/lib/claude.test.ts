import { describe, expect, it } from "vitest";
import { buildMnemonicPrompt, parseMnemonic } from "./claude";

describe("buildMnemonicPrompt", () => {
  it("contains both Spanish and English forms", () => {
    const p = buildMnemonicPrompt("perro", "dog");
    expect(p).toContain("perro");
    expect(p).toContain("dog");
    expect(p).toContain("KEYWORD");
    expect(p).toContain("SCENE");
  });
});

describe("parseMnemonic", () => {
  it("parses well-formed response", () => {
    const m = parseMnemonic(`KEYWORD: pear-o
SCENE: A dog balancing a pear on its nose.`);
    expect(m).toEqual({
      keyword: "pear-o",
      scene: "A dog balancing a pear on its nose.",
    });
  });
  it("returns null when format missing", () => {
    expect(parseMnemonic("just a paragraph")).toBeNull();
  });
  it("trims whitespace", () => {
    const m = parseMnemonic("KEYWORD:    apple   \nSCENE:    A scene here.   ");
    expect(m?.keyword).toBe("apple");
    expect(m?.scene).toBe("A scene here.");
  });
});
