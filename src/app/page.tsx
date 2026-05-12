import Link from "next/link";
import { gte, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { cards, reviewLog, vocabulary } from "@/db/schema";
import { computeStreak } from "@/lib/streaks";

export const dynamic = "force-dynamic";

async function fetchStats() {
  const since = new Date();
  since.setDate(since.getDate() - 365);

  const [cardCounts, vocabCount, dueCount, recentReviews] = await Promise.all([
    db
      .select({ state: cards.state, count: sql<number>`count(*)::int` })
      .from(cards)
      .groupBy(cards.state),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(vocabulary)
      .then((r) => r[0]?.count ?? 0),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(cards)
      .where(sql`${cards.state} = 'new' or ${cards.due} <= now()`)
      .then((r) => r[0]?.count ?? 0),
    db
      .select({ at: reviewLog.reviewedAt })
      .from(reviewLog)
      .where(gte(reviewLog.reviewedAt, since)),
  ]);
  const states = { new: 0, learning: 0, review: 0, relearning: 0 };
  for (const r of cardCounts) states[r.state] = r.count;
  const streak = computeStreak(recentReviews.map((r) => r.at));
  return { states, vocab: vocabCount, due: dueCount, streak };
}

export default async function Home() {
  const stats = await fetchStats();
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-12">
      <div className="flex flex-col items-center gap-8 max-w-md w-full">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Flip
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400 text-sm">
            FSRS spaced repetition for Spanish.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-2xl">
          <span aria-label="streak" title="Current streak">
            🔥
          </span>
          <span className="font-bold text-zinc-900 dark:text-zinc-50">{stats.streak.current}</span>
          <span className="text-sm text-zinc-500">
            day{stats.streak.current === 1 ? "" : "s"}
            {stats.streak.longest > stats.streak.current && (
              <> · best {stats.streak.longest}</>
            )}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 w-full text-center">
          <Stat label="due" value={stats.due} accent="text-emerald-500" />
          <Stat label="new" value={stats.states.new} />
          <Stat label="learn" value={stats.states.learning} accent="text-amber-500" />
          <Stat label="review" value={stats.states.review} accent="text-sky-500" />
        </div>

        <div className="text-xs text-zinc-500">
          vocab database:{" "}
          <span className="text-zinc-900 dark:text-zinc-100 font-semibold">
            {stats.vocab.toLocaleString()}
          </span>{" "}
          words
        </div>

        <div className="flex gap-3">
          <Link
            href="/review"
            className="inline-flex items-center justify-center rounded-full bg-zinc-900 dark:bg-zinc-50 px-6 py-3 text-sm font-medium text-zinc-50 dark:text-zinc-900 hover:opacity-90 transition"
          >
            {stats.due > 0 ? `Start review (${stats.due})` : "Browse"}
          </Link>
          <Link
            href="/cognates"
            className="inline-flex items-center justify-center rounded-full border border-zinc-300 dark:border-zinc-700 px-6 py-3 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
          >
            Cognates
          </Link>
          <Link
            href="/false-friends"
            className="inline-flex items-center justify-center rounded-full border border-zinc-300 dark:border-zinc-700 px-6 py-3 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
          >
            False friends
          </Link>
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <div className="flex flex-col py-3 rounded-lg bg-zinc-100 dark:bg-zinc-900">
      <span className={`text-2xl font-bold ${accent ?? "text-zinc-900 dark:text-zinc-100"}`}>
        {value}
      </span>
      <span className="text-[10px] uppercase tracking-wide text-zinc-500">{label}</span>
    </div>
  );
}
