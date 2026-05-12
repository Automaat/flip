import Link from "next/link";
import { gte, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { cards, reviewLog } from "@/db/schema";
import { accuracy, dailyReviews } from "@/lib/stats-agg";
import { computeStreak } from "@/lib/streaks";

export const dynamic = "force-dynamic";

async function fetchData() {
  const since = new Date();
  since.setDate(since.getDate() - 30);

  const [allReviews, allCounts, mature] = await Promise.all([
    db
      .select({ reviewedAt: reviewLog.reviewedAt, rating: reviewLog.rating })
      .from(reviewLog)
      .where(gte(reviewLog.reviewedAt, since)),
    db
      .select({ state: cards.state, count: sql<number>`count(*)::int` })
      .from(cards)
      .groupBy(cards.state),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(reviewLog)
      .then((r) => r[0]?.count ?? 0),
  ]);

  const states = { new: 0, learning: 0, review: 0, relearning: 0 };
  for (const r of allCounts) states[r.state] = r.count;

  const daily = dailyReviews(allReviews);
  const acc = accuracy(allReviews);
  const streak = computeStreak(allReviews.map((r) => r.reviewedAt));
  const totalReviewsAllTime = mature;
  const totalCards = states.new + states.learning + states.review + states.relearning;
  const mastered = states.review;

  return {
    daily,
    accuracy: acc,
    streak,
    totalReviewsAllTime,
    totalCards,
    mastered,
    states,
  };
}

export default async function StatsPage() {
  const s = await fetchData();
  const max = Math.max(1, ...s.daily.map((d) => d.count));

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-12">
      <div className="w-full max-w-2xl flex flex-col gap-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Stats</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Your learning over the last 30 days.
          </p>
        </header>

        <section className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
          <Big label="streak" value={s.streak.current} suffix="🔥" />
          <Big label="best" value={s.streak.longest} />
          <Big label="accuracy" value={`${s.accuracy}%`} />
          <Big label="reviewed" value={s.totalReviewsAllTime} />
        </section>

        <section className="space-y-2">
          <h2 className="text-xs uppercase tracking-wide text-zinc-500">
            30-day activity
          </h2>
          <div className="grid grid-cols-15 gap-1" style={{ gridTemplateColumns: "repeat(30, 1fr)" }}>
            {s.daily.map((d) => {
              const h = Math.round((d.count / max) * 100);
              return (
                <div
                  key={d.date}
                  className="aspect-square rounded-sm bg-zinc-200 dark:bg-zinc-800 relative"
                  title={`${d.date}: ${d.count} (✓${d.good}, ✗${d.again})`}
                >
                  <div
                    className="absolute bottom-0 w-full rounded-sm bg-emerald-500"
                    style={{ height: `${h}%` }}
                  />
                </div>
              );
            })}
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-xs uppercase tracking-wide text-zinc-500">
            Cards by state
          </h2>
          <div className="grid grid-cols-4 gap-2 text-center">
            <Big label="new" value={s.states.new} />
            <Big label="learning" value={s.states.learning} accent="text-amber-500" />
            <Big label="review" value={s.states.review} accent="text-emerald-500" />
            <Big label="relearning" value={s.states.relearning} accent="text-rose-500" />
          </div>
          <p className="text-xs text-zinc-500 mt-2">
            <span className="text-emerald-500 font-semibold">{s.mastered}</span> /{" "}
            {s.totalCards} cards mastered (in long-term review).
          </p>
        </section>

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

function Big({
  label,
  value,
  suffix,
  accent,
}: {
  label: string;
  value: number | string;
  suffix?: string;
  accent?: string;
}) {
  return (
    <div className="flex flex-col py-3 rounded-lg bg-zinc-100 dark:bg-zinc-900">
      <span className={`text-2xl font-bold ${accent ?? "text-zinc-900 dark:text-zinc-100"}`}>
        {value}
        {suffix && <span className="ml-1 text-base">{suffix}</span>}
      </span>
      <span className="text-[10px] uppercase tracking-wide text-zinc-500">{label}</span>
    </div>
  );
}
