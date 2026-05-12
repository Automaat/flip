import { describe, expect, it } from "vitest";
import { DEEP_PROMPTS, pickPrompt, shouldPrompt } from "./prompts";

describe("shouldPrompt", () => {
  it("never triggers for 'new'", () => {
    expect(shouldPrompt("new", () => 0)).toBe(false);
  });
  it("never triggers for 'review'", () => {
    expect(shouldPrompt("review", () => 0)).toBe(false);
  });
  it("triggers for 'learning' when random < 0.1", () => {
    expect(shouldPrompt("learning", () => 0.05)).toBe(true);
    expect(shouldPrompt("learning", () => 0.5)).toBe(false);
  });
  it("triggers for 'relearning' when random < 0.1", () => {
    expect(shouldPrompt("relearning", () => 0.0)).toBe(true);
    expect(shouldPrompt("relearning", () => 0.2)).toBe(false);
  });
});

describe("pickPrompt", () => {
  it("returns a prompt from the canonical list", () => {
    const p = pickPrompt(0);
    expect(DEEP_PROMPTS).toContain(p);
  });
  it("is deterministic for the same seed", () => {
    expect(pickPrompt(42)).toBe(pickPrompt(42));
  });
  it("produces the expected substitution", () => {
    const p = pickPrompt(0);
    expect(p.text("hola").includes("hola")).toBe(true);
  });
});
