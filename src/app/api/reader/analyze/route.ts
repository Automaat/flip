import { NextResponse } from "next/server";
import { inArray, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/client";
import { cards, notes } from "@/db/schema";
import { familiarityFromState, tokenizeForReader, type Familiarity } from "@/lib/reader";

const BodySchema = z.object({
  text: z.string().min(1).max(20_000),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const tokens = tokenizeForReader(parsed.data.text);
  const uniqueWords = [...new Set(tokens.map((t) => t.word).filter((w): w is string => !!w))];

  // Look up best state per word: prefer 'review' > 'learning' > 'new'.
  const rows = uniqueWords.length === 0
    ? []
    : await db
        .select({
          word: sql<string>`lower(${notes.fields}->>'spanish')`.as("word"),
          state: cards.state,
        })
        .from(notes)
        .innerJoin(cards, sql`${cards.noteId} = ${notes.id}`)
        .where(inArray(sql`lower(${notes.fields}->>'spanish')`, uniqueWords));

  const order: Record<typeof cards.$inferSelect.state, number> = {
    relearning: 0,
    new: 1,
    learning: 2,
    review: 3,
  };
  const best = new Map<string, typeof cards.$inferSelect.state>();
  for (const r of rows) {
    const prev = best.get(r.word);
    if (!prev || order[r.state] > order[prev]) best.set(r.word, r.state);
  }

  const familiarity: Record<string, Familiarity> = {};
  for (const w of uniqueWords) {
    familiarity[w] = familiarityFromState(best.get(w) ?? null);
  }
  return NextResponse.json({ tokens, familiarity });
}
