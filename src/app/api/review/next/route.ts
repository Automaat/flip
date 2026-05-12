import { NextResponse } from "next/server";
import { and, asc, eq, lte, or, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { cards, notes } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  const now = new Date();

  const due = await db
    .select({
      id: cards.id,
      state: cards.state,
      due: cards.due,
      reps: cards.reps,
      lapses: cards.lapses,
      noteType: notes.noteType,
      fields: notes.fields,
    })
    .from(cards)
    .innerJoin(notes, eq(cards.noteId, notes.id))
    .where(or(eq(cards.state, "new"), lte(cards.due, now)))
    .orderBy(
      sql`case when ${cards.state} = 'new' then 1 else 0 end`,
      asc(cards.due),
    )
    .limit(1);

  if (due.length === 0) {
    const remaining = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(cards)
      .where(and(eq(cards.state, "new")));
    return NextResponse.json({ card: null, remaining: remaining[0]?.count ?? 0 });
  }

  return NextResponse.json({ card: due[0] });
}
