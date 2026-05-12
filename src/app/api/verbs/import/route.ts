import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/client";
import { cards, decks, notes } from "@/db/schema";
import {
  buildClozeCards,
  IRREGULAR_VERBS_IMPERFECT,
  IRREGULAR_VERBS_PRESENT,
  IRREGULAR_VERBS_PRETERITE,
  type Tense,
} from "@/data/verbs";
import { newCard } from "@/lib/fsrs";

const BodySchema = z
  .object({ tense: z.enum(["present", "preterite", "imperfect"]).optional() })
  .optional();

const DECK_NAMES: Record<Tense, string> = {
  present: "Present Indicative — Irregulars",
  preterite: "Preterite — Irregulars",
  imperfect: "Imperfect — Irregulars",
};

const TABLES: Record<Tense, typeof IRREGULAR_VERBS_PRESENT> = {
  present: IRREGULAR_VERBS_PRESENT,
  preterite: IRREGULAR_VERBS_PRETERITE,
  imperfect: IRREGULAR_VERBS_IMPERFECT,
};

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(body);
  const tense: Tense = parsed.success ? (parsed.data?.tense ?? "present") : "present";
  const deckName = DECK_NAMES[tense];

  const existing = await db.select().from(decks).where(eq(decks.name, deckName));
  let deckId: string;
  if (existing.length > 0) {
    deckId = existing[0]!.id;
    return NextResponse.json({ ok: true, deckId, tense, cardsCreated: 0, alreadyImported: true });
  }
  const [deck] = await db
    .insert(decks)
    .values({ name: deckName, settings: { type: `verbs_${tense}_irregular`, tense } })
    .returning();
  deckId = deck!.id;

  const clozes = buildClozeCards(TABLES[tense]);
  let created = 0;
  for (const c of clozes) {
    const [note] = await db
      .insert(notes)
      .values({
        noteType: "cloze",
        fields: {
          spanish: c.answer,
          english: c.english,
          sentence: c.sentence,
          answer: c.answer,
          sentenceEnglish: c.sentenceEnglish,
          infinitive: c.infinitive,
          person: c.person,
          tense: c.tense,
        },
        tags: ["verb", tense, c.infinitive],
        source: `verbs_${tense}_irregular`,
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
  return NextResponse.json({ ok: true, deckId, tense, cardsCreated: created });
}
