import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { cards, decks, notes } from "@/db/schema";
import { buildClozeCards } from "@/data/verbs";
import { newCard } from "@/lib/fsrs";

const DECK_NAME = "Present Indicative — Irregulars";

export async function POST() {
  const existing = await db.select().from(decks).where(eq(decks.name, DECK_NAME));
  let deckId: string;
  if (existing.length > 0) {
    deckId = existing[0]!.id;
    return NextResponse.json({ ok: true, deckId, cardsCreated: 0, alreadyImported: true });
  }
  const [deck] = await db
    .insert(decks)
    .values({ name: DECK_NAME, settings: { type: "verbs_present_irregular" } })
    .returning();
  deckId = deck!.id;

  const clozes = buildClozeCards();
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
        tags: ["verb", "present", c.infinitive],
        source: "verbs_present_irregular",
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
  return NextResponse.json({ ok: true, deckId, cardsCreated: created });
}
