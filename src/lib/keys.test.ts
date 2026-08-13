import { describe, expect, it } from "vitest";
import { isEditableTarget } from "./keys";

describe("isEditableTarget", () => {
  it.each([
    ["input", { tagName: "INPUT" }, true],
    ["lowercase tag name", { tagName: "input" }, true],
    ["textarea", { tagName: "TEXTAREA" }, true],
    ["select", { tagName: "SELECT" }, true],
    ["contenteditable div", { tagName: "DIV", isContentEditable: true }, true],
    ["plain div", { tagName: "DIV" }, false],
    ["button", { tagName: "BUTTON" }, false],
    ["body", { tagName: "BODY", isContentEditable: false }, false],
  ])("%s", (_name, target, expected) => {
    expect(isEditableTarget(target)).toBe(expected);
  });

  it("handles a missing target", () => {
    expect(isEditableTarget(null)).toBe(false);
    expect(isEditableTarget(undefined)).toBe(false);
  });

  it("ignores a non-string tagName", () => {
    expect(isEditableTarget({ tagName: 42 })).toBe(false);
  });
});
