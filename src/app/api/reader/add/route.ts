import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/client";
import { cards, decks, notes } from "@/db/schema";
import { newCard } from "@/lib/fsrs";

const BodySchema = z.object({
  spanish: z.string().min(1).max(80),
  english: z.string().min(0).max(200).optional(),
  context: z.string().max(500).optional(),
});

const DECK_NAME = "Reading";

async function ensureReadingDeck(): Promise<string> {
  const existing = await db.select().from(decks).where(eq(decks.name, DECK_NAME));
  if (existing.length > 0) return existing[0]!.id;
  const [created] = await db
    .insert(decks)
    .values({ name: DECK_NAME, settings: { type: "reading" } })
    .returning();
  return created!.id;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { spanish, english, context } = parsed.data;
  const deckId = await ensureReadingDeck();
  const lower = spanish.trim().toLowerCase();

  const [note] = await db
    .insert(notes)
    .values({
      noteType: "vocab",
      fields: {
        spanish: lower,
        english: english ?? "",
        example: context ?? "",
        source: "reader",
      },
      tags: ["reader"],
      source: "reader",
    })
    .returning();
  if (!note) return NextResponse.json({ error: "insert failed" }, { status: 500 });

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
  return NextResponse.json({ ok: true, deckId, noteId: note.id });
}
