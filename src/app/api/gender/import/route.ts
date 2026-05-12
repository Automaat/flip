import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { cards, decks, notes } from "@/db/schema";
import { GENDER_EXCEPTIONS } from "@/data/gender-exceptions";
import { newCard } from "@/lib/fsrs";

const DECK_NAME = "Gender Exceptions";

export async function POST() {
  const existing = await db.select().from(decks).where(eq(decks.name, DECK_NAME));
  let deckId: string;
  if (existing.length > 0) {
    deckId = existing[0]!.id;
    return NextResponse.json({ ok: true, deckId, cardsCreated: 0, alreadyImported: true });
  }
  const [deck] = await db
    .insert(decks)
    .values({ name: DECK_NAME, settings: { type: "gender_exceptions" } })
    .returning();
  deckId = deck!.id;

  let created = 0;
  for (const g of GENDER_EXCEPTIONS) {
    const article = g.gender === "m" ? "el" : "la";
    const [note] = await db
      .insert(notes)
      .values({
        noteType: "gender",
        fields: {
          spanish: g.spanish,
          english: `${article} ${g.spanish} (${g.english})`,
          gender: g.gender,
          trickReason: g.trickReason,
          example: g.example,
          exampleEnglish: g.exampleEnglish,
        },
        tags: ["gender_exception", g.gender === "m" ? "masc" : "fem"],
        source: "gender_exceptions_seed",
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
