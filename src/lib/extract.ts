/** Strip HTML/scripts/styles to plain text. Conservative; not a real DOM parser. */
export function extractTextFromHtml(html: string): string {
  let s = html;
  s = s.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ");
  s = s.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ");
  s = s.replace(/<!--[\s\S]*?-->/g, " ");
  s = s.replace(/<\/?(p|br|div|h[1-6]|li|tr|td)[^>]*>/gi, "\n");
  s = s.replace(/<[^>]+>/g, " ");
  s = s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  s = s
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n");
  return s;
}

/** Truncate to a sensible chunk size for downstream Claude calls. */
export function clipText(text: string, maxChars = 6000): string {
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars) + "…";
}
