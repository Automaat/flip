import { and, asc, eq, lte, or, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { cards, decks, notes } from "@/db/schema";
import { ReviewClient, type ReviewCard } from "./review-client";

export const dynamic = "force-dynamic";

async function fetchNextCard(deckId?: string): Promise<ReviewCard | null> {
  const now = new Date();
  const baseWhere = or(eq(cards.state, "new"), lte(cards.due, now));
  const whereExpr = deckId ? and(baseWhere, eq(cards.deckId, deckId)) : baseWhere;
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
    .where(whereExpr)
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

async function fetchCounts(deckId?: string) {
  const rows = await db
    .select({
      state: cards.state,
      count: sql<number>`count(*)::int`,
    })
    .from(cards)
    .where(deckId ? eq(cards.deckId, deckId) : undefined)
    .groupBy(cards.state);
  const out = { new: 0, learning: 0, review: 0, relearning: 0 };
  for (const r of rows) out[r.state] = r.count;
  return out;
}

async function fetchDeckName(deckId: string): Promise<string | null> {
  const rows = await db.select({ name: decks.name }).from(decks).where(eq(decks.id, deckId));
  return rows[0]?.name ?? null;
}

type Props = { searchParams: Promise<{ deck?: string }> };

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function ReviewPage({ searchParams }: Props) {
  const sp = await searchParams;
  const deckId = sp?.deck && UUID_RE.test(sp.deck) ? sp.deck : undefined;
  const [card, counts, deckName] = await Promise.all([
    fetchNextCard(deckId),
    fetchCounts(deckId),
    deckId ? fetchDeckName(deckId) : Promise.resolve(null),
  ]);
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-12">
      <ReviewClient
        key={card?.id ?? "done"}
        card={card}
        counts={counts}
        deckName={deckName}
      />
    </main>
  );
}
