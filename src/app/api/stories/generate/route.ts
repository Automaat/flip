import { NextResponse } from "next/server";
import { z } from "zod";
import { getClaudeClient } from "@/lib/claude";

const BodySchema = z.object({
  topic: z.string().min(1).max(120).default("daily life"),
  level: z.enum(["A1", "A2", "B1", "B2"]).default("A1"),
  paragraphs: z.number().int().min(1).max(5).default(2),
});

const PROMPT = (topic: string, level: string, paragraphs: number) =>
  `Write a short Spanish story for an English learner at CEFR ${level} about: ${topic}.
${paragraphs} short paragraph(s). Use simple, concrete vocabulary appropriate for ${level}.
Then, on a new line, write '---' on its own.
Then provide the English translation, paragraph by paragraph in the same order.`;

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
    PROMPT(parsed.data.topic, parsed.data.level, parsed.data.paragraphs),
    1200,
  );
  const [es, en] = text.split(/^\s*---\s*$/m).map((s) => s.trim());
  return NextResponse.json({ spanish: es ?? text, english: en ?? "" });
}
