import { describe, expect, it } from "vitest";
import { clipText, extractTextFromHtml } from "./extract";

describe("extractTextFromHtml", () => {
  it("strips tags", () => {
    expect(extractTextFromHtml("<p>Hola <b>mundo</b>.</p>")).toBe("Hola mundo .");
  });
  it("removes script and style blocks entirely", () => {
    const html = `<style>p{color:red}</style><script>alert('hi')</script><p>Real text.</p>`;
    expect(extractTextFromHtml(html)).toBe("Real text.");
  });
  it("decodes common HTML entities", () => {
    expect(extractTextFromHtml("Tom &amp; Jerry &quot;rock&quot;.")).toBe(
      'Tom & Jerry "rock".',
    );
  });
  it("keeps line breaks at block elements", () => {
    const out = extractTextFromHtml("<h1>Title</h1><p>One.</p><p>Two.</p>");
    expect(out).toContain("Title");
    expect(out).toContain("One.");
    expect(out).toContain("Two.");
    expect(out.split("\n").length).toBeGreaterThanOrEqual(3);
  });
});

describe("clipText", () => {
  it("returns input unchanged if under limit", () => {
    expect(clipText("hello", 100)).toBe("hello");
  });
  it("clips with ellipsis when over limit", () => {
    const long = "a".repeat(50);
    expect(clipText(long, 10)).toBe("aaaaaaaaaa…");
  });
});
