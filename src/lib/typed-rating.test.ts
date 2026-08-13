import { describe, expect, it } from "vitest";
import { typedRating } from "./typed-rating";

describe("typedRating", () => {
  it("rates a correct answer good", () => {
    expect(typedRating("correct")).toBe("good");
  });

  it("rates a wrong answer again so the card comes back", () => {
    expect(typedRating("wrong")).toBe("again");
  });
});
