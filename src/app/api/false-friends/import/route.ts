import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { cards, decks, notes } from "@/db/schema";
import { UNIQUE_FALSE_FRIENDS } from "@/data/false-friends";
import { newCard } from "@/lib/fsrs";

const DECK_NAME = "False Friends";

export async function POST() {
  const existing = await db.select().from(decks).where(eq(decks.name, DECK_NAME));
  let deckId: string;
  if (existing.length > 0) {
    deckId = existing[0]!.id;
    return NextResponse.json({ ok: true, deckId, cardsCreated: 0, alreadyImported: true });
  }
  const [deck] = await db
    .insert(decks)
    .values({ name: DECK_NAME, settings: { type: "false_friends" } })
    .returning();
  deckId = deck!.id;

  let created = 0;
  for (const f of UNIQUE_FALSE_FRIENDS) {
    const [note] = await db
      .insert(notes)
      .values({
        noteType: "false_friend",
        fields: {
          spanish: f.spanish,
          english: f.englishReal,
          englishTrap: f.englishTrap,
          example: f.example,
          exampleEnglish: f.exampleEnglish,
        },
        tags: ["false_friend"],
        source: "false_friends_seed",
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
