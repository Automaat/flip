import { asc, eq, lte, or, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { cards, notes } from "@/db/schema";
import { ReviewClient, type ReviewCard } from "./review-client";

export const dynamic = "force-dynamic";

async function fetchNextCard(): Promise<ReviewCard | null> {
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
  if (due.length === 0) return null;
  const row = due[0]!;
  return {
    id: row.id,
    state: row.state,
    due: row.due.toISOString(),
    reps: row.reps,
    lapses: row.lapses,
    noteType: row.noteType,
    fields: row.fields as ReviewCard["fields"],
  };
}

async function fetchCounts() {
  const rows = await db
    .select({
      state: cards.state,
      count: sql<number>`count(*)::int`,
    })
    .from(cards)
    .groupBy(cards.state);
  const out = { new: 0, learning: 0, review: 0, relearning: 0 };
  for (const r of rows) out[r.state] = r.count;
  return out;
}

export default async function ReviewPage() {
  const [card, counts] = await Promise.all([fetchNextCard(), fetchCounts()]);
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-12">
      <ReviewClient key={card?.id ?? "done"} card={card} counts={counts} />
    </main>
  );
}
