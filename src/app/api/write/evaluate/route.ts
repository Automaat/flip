import { NextResponse } from "next/server";
import { z } from "zod";
import { getClaudeClient } from "@/lib/claude";

const BodySchema = z.object({
  text: z.string().min(1).max(2000),
  level: z.enum(["A1", "A2", "B1", "B2"]).default("A1"),
});

const PROMPT = (text: string, level: string) =>
  `A learner at CEFR ${level} wrote this Spanish paragraph:

"""
${text}
"""

Score it 0–100 on grammar, 0–100 on vocabulary, 0–100 on naturalness. Then write a short list of inline corrections (≤6). Finally, write the corrected paragraph.

Respond EXACTLY in this format with no extra commentary:
GRAMMAR: <int>
VOCAB: <int>
NATURAL: <int>
CORRECTIONS:
- <inline correction 1>
- ...
CORRECTED:
<the corrected paragraph>`;

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
  const text = await claude.complete(PROMPT(parsed.data.text, parsed.data.level), 800);
  return NextResponse.json({ raw: text });
}
