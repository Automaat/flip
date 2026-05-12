import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/client";
import { cards, decks, notes } from "@/db/schema";
import { getClaudeClient } from "@/lib/claude";
import { newCard } from "@/lib/fsrs";

const BodySchema = z.object({
  text: z.string().min(20).max(8000),
  level: z.enum(["A1", "A2", "B1", "B2"]).default("A1"),
  max: z.number().int().min(1).max(20).default(8),
  /** If true, immediately import the suggested cards into an "Auto" deck. */
  importToDeck: z.boolean().default(false),
});

type Card = { spanish: string; english: string; example: string; exampleEnglish: string };

const DECK_NAME = "Auto-generated";

const PROMPT = (text: string, level: string, max: number) =>
  `From this Spanish text, pick the ${max} most useful learnable words for a CEFR ${level} learner.
For each, output one JSON object on its own line (newline-delimited JSON, no markdown):
{"spanish":"<lemma>","english":"<short gloss>","example":"<simple Spanish sentence using it>","exampleEnglish":"<English translation>"}

Text:
"""
${text}
"""`;

function parseCards(raw: string): Card[] {
  const out: Card[] = [];
  for (const line of raw.split("\n")) {
    const trimmed = line.trim().replace(/^[-*]\s*/, "");
    if (!trimmed.startsWith("{")) continue;
    try {
      const obj = JSON.parse(trimmed) as Partial<Card>;
      if (obj.spanish && obj.english) {
        out.push({
          spanish: String(obj.spanish).toLowerCase(),
          english: String(obj.english),
          example: String(obj.example ?? ""),
          exampleEnglish: String(obj.exampleEnglish ?? ""),
        });
      }
    } catch {
      // skip malformed line
    }
  }
  return out;
}

async function ensureDeck(): Promise<string> {
  const existing = await db.select().from(decks).where(eq(decks.name, DECK_NAME));
  if (existing.length > 0) return existing[0]!.id;
  const [created] = await db
    .insert(decks)
    .values({ name: DECK_NAME, settings: { type: "auto" } })
    .returning();
  return created!.id;
}

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
    PROMPT(parsed.data.text, parsed.data.level, parsed.data.max),
    1500,
  );
  const cardsList = parseCards(text);
  if (cardsList.length === 0) {
    return NextResponse.json({ error: "no parsable cards", raw: text }, { status: 502 });
  }

  if (!parsed.data.importToDeck) {
    return NextResponse.json({ cards: cardsList });
  }

  const deckId = await ensureDeck();
  let created = 0;
  for (const c of cardsList) {
    const [note] = await db
      .insert(notes)
      .values({
        noteType: "vocab",
        fields: c,
        tags: ["auto"],
        source: "auto-gen",
      })
      .returning();
    if (!note) continue;
    const empty = newCard();
    await db.insert(cards).values({
      noteId: note.id,
      deckId,
      state: "new",
      due: empty.due,
      stability: empty.stability,
      difficulty: empty.difficulty,
      elapsedDays: empty.elapsed_days,
      scheduledDays: empty.scheduled_days,
      reps: empty.reps,
      lapses: empty.lapses,
    });
    created++;
  }
  return NextResponse.json({ cards: cardsList, deckId, cardsCreated: created });
}
