import Link from "next/link";
import { sql } from "drizzle-orm";
import { db } from "@/db/client";
import { cards, decks, reviewLog } from "@/db/schema";

export const dynamic = "force-dynamic";

type DeckRow = {
  id: string;
  name: string;
  total: number;
  due: number;
  newCount: number;
  lastReview: Date | string | null;
};

async function fetchDecks(): Promise<DeckRow[]> {
  const allDecks = await db.select().from(decks).orderBy(decks.name);
  if (allDecks.length === 0) return [];

  const cardsAgg = await db
    .select({
      deckId: cards.deckId,
      total: sql<number>`count(*)::int`.as("total"),
      due: sql<number>`count(*) filter (where ${cards.state} = 'new' or ${cards.due} <= now())::int`.as(
        "due",
      ),
      newCount: sql<number>`count(*) filter (where ${cards.state} = 'new')::int`.as("new_count"),
    })
    .from(cards)
    .groupBy(cards.deckId);

  const lastByDeck = await db
    .select({
      deckId: cards.deckId,
      last: sql<Date | null>`max(${reviewLog.reviewedAt})`.as("last"),
    })
    .from(reviewLog)
    .innerJoin(cards, sql`${cards.id} = ${reviewLog.cardId}`)
    .groupBy(cards.deckId);

  const aggMap = new Map(cardsAgg.map((c) => [c.deckId, c]));
  const lastMap = new Map(lastByDeck.map((l) => [l.deckId, l.last]));

  return allDecks.map((d) => {
    const a = aggMap.get(d.id);
    return {
      id: d.id,
      name: d.name,
      total: a?.total ?? 0,
      due: a?.due ?? 0,
      newCount: a?.newCount ?? 0,
      lastReview: lastMap.get(d.id) ?? null,
    };
  });
}

function relativeTime(d: Date | string | null): string {
  if (!d) return "never";
  const date = d instanceof Date ? d : new Date(d);
  const ms = Date.now() - date.getTime();
  const m = Math.round(ms / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.round(h / 24);
  return `${days}d ago`;
}

export default async function DecksPage() {
  const items = await fetchDecks();
  return (
    <main className="flex flex-1 flex-col items-center px-6 py-12">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Decks</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {items.length} deck{items.length === 1 ? "" : "s"} ·{" "}
            {items.reduce((a, b) => a + b.total, 0)} cards total
          </p>
        </header>

        {items.length === 0 ? (
          <p className="text-center text-zinc-500">
            No decks yet. Import one from <Link href="/cognates" className="underline">Cognates</Link>,{" "}
            <Link href="/false-friends" className="underline">False friends</Link>, or{" "}
            <Link href="/verbs" className="underline">Verbs</Link>.
          </p>
        ) : (
          <ul className="rounded-lg border border-zinc-300 dark:border-zinc-700 divide-y divide-zinc-200 dark:divide-zinc-800">
            {items.map((d) => (
              <li key={d.id} className="p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-medium truncate">{d.name}</div>
                  <div className="text-xs text-zinc-500 mt-1">
                    last reviewed: {relativeTime(d.lastReview)}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Stat label="due" n={d.due} accent={d.due > 0 ? "text-emerald-500" : "text-zinc-500"} />
                  <Stat label="new" n={d.newCount} />
                  <Stat label="total" n={d.total} />
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            ← back
          </Link>
        </div>
      </div>
    </main>
  );
}

function Stat({ label, n, accent }: { label: string; n: number; accent?: string }) {
  return (
    <div className="flex flex-col items-center min-w-[40px]">
      <span className={`font-semibold ${accent ?? ""}`}>{n}</span>
      <span className="text-[10px] uppercase text-zinc-400">{label}</span>
    </div>
  );
}
