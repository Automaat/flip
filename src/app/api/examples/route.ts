import { NextResponse } from "next/server";
import { z } from "zod";
import { getClaudeClient } from "@/lib/claude";

const BodySchema = z.object({
  spanish: z.string().min(1).max(80),
  english: z.string().min(0).max(120).optional(),
  level: z.enum(["A1", "A2", "B1", "B2"]).default("A1"),
});

const PROMPT = (spanish: string, english: string | undefined, level: string) =>
  `Give 3 short example Spanish sentences using the word "${spanish}"${english ? ` (means "${english}")` : ""} at CEFR ${level} level.
Each sentence on its own line. Then a blank line. Then 3 English translations on their own lines, in the same order.
No numbering, no markdown.`;

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const claude = getClaudeClient();
  if (!claude) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured" },
      { status: 503 },
    );
  }
  const text = await claude.complete(
    PROMPT(parsed.data.spanish, parsed.data.english, parsed.data.level),
    500,
  );
  const sections = text.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);
  if (sections.length < 2) {
    return NextResponse.json({ error: "could not parse response", raw: text }, { status: 502 });
  }
  const spanishLines = sections[0]!.split("\n").map((s) => s.trim()).filter(Boolean);
  const englishLines = sections[1]!.split("\n").map((s) => s.trim()).filter(Boolean);
  const pairs = spanishLines.slice(0, 3).map((es, i) => ({
    es,
    en: englishLines[i] ?? "",
  }));
  return NextResponse.json({ examples: pairs });
}
