import { NextResponse } from "next/server";
import { z } from "zod";
import { getClaudeClient } from "@/lib/claude";

const Message = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(2000),
});

const BodySchema = z.object({
  level: z.enum(["A1", "A2", "B1", "B2"]).default("A1"),
  scenario: z.string().min(1).max(120).optional(),
  messages: z.array(Message).min(1).max(40),
});

const SYSTEM_PROMPT = (level: string, scenario?: string) =>
  `You are a friendly Spanish tutor for an English speaker at CEFR ${level}.
Reply ONLY in Spanish, in 1–3 short sentences. Use vocabulary appropriate for ${level}.
If the learner makes a grammar mistake, gently restate the correct form before answering.
${scenario ? `Stay in this scenario: ${scenario}.` : ""}
End your reply with a short follow-up question.`;

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
  const reply = await claude.chat(
    parsed.data.messages,
    400,
    SYSTEM_PROMPT(parsed.data.level, parsed.data.scenario),
  );
  return NextResponse.json({ reply });
}
