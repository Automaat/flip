import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/client";
import { cards, decks, notes } from "@/db/schema";
import { findRule } from "@/data/cognate-rules";
import { newCard } from "@/lib/fsrs";

const BodySchema = z.object({
  ruleId: z.string().min(1),
});

const DECK_PREFIX = "Cognates: ";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const rule = findRule(parsed.data.ruleId);
  if (!rule) return NextResponse.json({ error: "rule not found" }, { status: 404 });

  const deckName = DECK_PREFIX + rule.id;
  const existing = await db.select().from(decks).where(eq(decks.name, deckName));
  let deckId: string;
  if (existing.length > 0) {
    deckId = existing[0]!.id;
    return NextResponse.json({ ok: true, deckId, cardsCreated: 0, alreadyUnlocked: true });
  }
  const [deck] = await db
    .insert(decks)
    .values({ name: deckName, settings: { cognateRule: rule.id } })
    .returning();
  deckId = deck!.id;

  const words = [...rule.examples, ...rule.quiz];
  let created = 0;
  for (const w of words) {
    const [note] = await db
      .insert(notes)
      .values({
        noteType: "vocab",
        fields: {
          spanish: w.es,
          english: w.en,
          source: "cognate",
          cognateRule: rule.id,
        },
        tags: ["cognate", rule.id],
        source: "cognate",
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
