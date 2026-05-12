import Link from "next/link";
import { and, gte, inArray, isNotNull, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { cards, notes, reviewLog, vocabulary } from "@/db/schema";
import { computeStreak } from "@/lib/streaks";
import { bandCoverage } from "@/lib/coverage";
import { forecast } from "@/lib/forecast";

export const dynamic = "force-dynamic";

async function fetchKnownRanks(): Promise<number[]> {
  // Distinct Spanish words across all notes — joined to vocabulary for rank.
  const noteWords = await db
    .selectDistinct({
      word: sql<string>`lower(${notes.fields}->>'spanish')`.as("word"),
    })
    .from(notes)
    .where(sql`${notes.fields} ? 'spanish'`);
  const words = noteWords.map((r) => r.word).filter(Boolean);
  if (words.length === 0) return [];
  const rows = await db
    .select({ rank: vocabulary.frequencyRank })
    .from(vocabulary)
    .where(and(inArray(vocabulary.word, words), isNotNull(vocabulary.frequencyRank)));
  return rows.map((r) => r.rank).filter((r): r is number => r !== null);
}

async function fetchStats() {
  const since = new Date();
  since.setDate(since.getDate() - 365);

  const horizon = new Date();
  horizon.setDate(horizon.getDate() + 7);

  const [cardCounts, vocabCount, dueCount, recentReviews, knownRanks, upcomingDues] = await Promise.all([
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
    fetchKnownRanks(),
    db
      .select({ due: cards.due })
      .from(cards)
      .where(sql`${cards.state} != 'new' AND ${cards.due} < ${horizon.toISOString()}::timestamptz`),
  ]);
  const states = { new: 0, learning: 0, review: 0, relearning: 0 };
  for (const r of cardCounts) states[r.state] = r.count;
  const streak = computeStreak(recentReviews.map((r) => r.at));
  const coverage = bandCoverage(knownRanks, Math.min(vocabCount, 5000));
  const forecast7 = forecast(upcomingDues.map((r) => r.due));
  return { states, vocab: vocabCount, due: dueCount, streak, coverage, forecast: forecast7 };
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

        <div className="w-full space-y-2">
          <div className="flex items-baseline justify-between text-xs text-zinc-500">
            <span>review forecast (7 days)</span>
            <span>
              <span className="text-zinc-900 dark:text-zinc-100 font-semibold">
                {stats.forecast.reduce((a, b) => a + b.count, 0)}
              </span>{" "}
              upcoming
            </span>
          </div>
          <div className="grid grid-cols-7 gap-1 items-end h-16">
            {stats.forecast.map((b) => {
              const max = Math.max(1, ...stats.forecast.map((x) => x.count));
              const h = Math.round((b.count / max) * 100);
              return (
                <div key={b.date} className="flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-sm bg-zinc-200 dark:bg-zinc-800 relative"
                    style={{ height: "100%" }}
                    title={`${b.weekday} ${b.date}: ${b.count}`}
                  >
                    <div
                      className={`absolute bottom-0 w-full rounded-sm ${
                        b.isToday ? "bg-emerald-500" : "bg-zinc-500"
                      }`}
                      style={{ height: `${h}%` }}
                    />
                  </div>
                  <span
                    className={`text-[10px] ${b.isToday ? "text-emerald-500 font-semibold" : "text-zinc-400"}`}
                  >
                    {b.weekday}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-full space-y-2">
          <div className="flex items-baseline justify-between text-xs text-zinc-500">
            <span>frequency coverage</span>
            <span>
              <span className="text-zinc-900 dark:text-zinc-100 font-semibold">
                {stats.coverage.totalKnown}
              </span>{" "}
              / {stats.vocab.toLocaleString()}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-1">
            {stats.coverage.bands.map((b) => (
              <div key={b.band} className="flex flex-col items-center">
                <div
                  className="w-full h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden"
                  title={`${b.band}: ${b.covered}/${b.total}`}
                >
                  <div
                    className="h-full bg-emerald-500"
                    style={{ width: `${b.percent}%` }}
                  />
                </div>
                <span className="mt-1 text-[10px] text-zinc-400">{b.band.split("–")[0]}</span>
              </div>
            ))}
          </div>
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
          <Link
            href="/verbs"
            className="inline-flex items-center justify-center rounded-full border border-zinc-300 dark:border-zinc-700 px-6 py-3 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
          >
            Verbs
          </Link>
          <Link
            href="/dictate"
            className="inline-flex items-center justify-center rounded-full border border-zinc-300 dark:border-zinc-700 px-6 py-3 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
          >
            Dictate
          </Link>
          <Link
            href="/gender"
            className="inline-flex items-center justify-center rounded-full border border-zinc-300 dark:border-zinc-700 px-6 py-3 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
          >
            Gender
          </Link>
          <Link
            href="/pairs"
            className="inline-flex items-center justify-center rounded-full border border-zinc-300 dark:border-zinc-700 px-6 py-3 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
          >
            Pairs
          </Link>
          <Link
            href="/reader"
            className="inline-flex items-center justify-center rounded-full border border-zinc-300 dark:border-zinc-700 px-6 py-3 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
          >
            Reader
          </Link>
          <Link
            href="/stats"
            className="inline-flex items-center justify-center rounded-full border border-zinc-300 dark:border-zinc-700 px-6 py-3 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
          >
            Stats
          </Link>
          <Link
            href="/etymology"
            className="inline-flex items-center justify-center rounded-full border border-zinc-300 dark:border-zinc-700 px-6 py-3 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
          >
            Etymology
          </Link>
          <Link
            href="/construct"
            className="inline-flex items-center justify-center rounded-full border border-zinc-300 dark:border-zinc-700 px-6 py-3 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
          >
            Construct
          </Link>
          <Link
            href="/translate"
            className="inline-flex items-center justify-center rounded-full border border-zinc-300 dark:border-zinc-700 px-6 py-3 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
          >
            Translate
          </Link>
          <Link
            href="/tutor"
            className="inline-flex items-center justify-center rounded-full border border-zinc-300 dark:border-zinc-700 px-6 py-3 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
          >
            Tutor
          </Link>
          <Link
            href="/settings"
            className="inline-flex items-center justify-center rounded-full border border-zinc-300 dark:border-zinc-700 px-6 py-3 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
          >
            Settings
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
