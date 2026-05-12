import Link from "next/link";
import { desc, eq, gte } from "drizzle-orm";
import { db } from "@/db/client";
import { cards, decks, notes } from "@/db/schema";

export const dynamic = "force-dynamic";

const DEFAULT_THRESHOLD = 8;

type Props = { searchParams: Promise<{ n?: string }> };

async function fetchLeeches(threshold: number) {
  return db
    .select({
      id: cards.id,
      lapses: cards.lapses,
      reps: cards.reps,
      state: cards.state,
      lastReview: cards.lastReview,
      fields: notes.fields,
      noteType: notes.noteType,
      deckName: decks.name,
    })
    .from(cards)
    .innerJoin(notes, eq(notes.id, cards.noteId))
    .innerJoin(decks, eq(decks.id, cards.deckId))
    .where(gte(cards.lapses, threshold))
    .orderBy(desc(cards.lapses), desc(cards.lastReview));
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

export default async function LeechesPage({ searchParams }: Props) {
  const sp = await searchParams;
  const parsed = sp?.n ? parseInt(sp.n, 10) : DEFAULT_THRESHOLD;
  const threshold = Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_THRESHOLD;
  const rows = await fetchLeeches(threshold);

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-12">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Leeches</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Cards you&apos;ve failed {threshold}+ times — candidates to rewrite or split.
          </p>
        </header>

        {rows.length === 0 ? (
          <p className="text-center text-zinc-500">
            No leeches above lapses ≥ {threshold}. Try{" "}
            <Link
              href={{ pathname: "/leeches", query: { n: Math.max(1, threshold - 4).toString() } }}
              className="underline"
            >
              a lower threshold
            </Link>
            .
          </p>
        ) : (
          <ul className="rounded-lg border border-zinc-300 dark:border-zinc-700 divide-y divide-zinc-200 dark:divide-zinc-800">
            {rows.map((r) => {
              const f = r.fields as { spanish?: string; english?: string };
              return (
                <li key={r.id} className="p-4 flex items-baseline justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold truncate">
                      {f.spanish ?? "(no spanish)"}
                    </div>
                    <div className="text-xs text-zinc-500 truncate">
                      {f.english ?? "—"} · {r.deckName}
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-1">
                      last reviewed {relativeTime(r.lastReview)}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-2xl font-bold text-rose-500">{r.lapses}</div>
                    <div className="text-[10px] uppercase text-zinc-400">lapses</div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <div className="flex justify-between text-xs text-zinc-500">
          <Link
            href={{ pathname: "/leeches", query: { n: "4" } }}
            className="hover:underline"
          >
            ≥ 4
          </Link>
          <Link
            href={{ pathname: "/leeches", query: { n: "6" } }}
            className="hover:underline"
          >
            ≥ 6
          </Link>
          <Link
            href={{ pathname: "/leeches", query: { n: "8" } }}
            className="hover:underline"
          >
            ≥ 8
          </Link>
          <Link
            href={{ pathname: "/leeches", query: { n: "12" } }}
            className="hover:underline"
          >
            ≥ 12
          </Link>
        </div>

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
