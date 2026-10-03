import Link from "next/link";
import { and, asc, eq, gte } from "drizzle-orm";
import { db } from "@/db/client";
import { cards, notes, reviewLog } from "@/db/schema";
import {
  formatDuration,
  parseSince,
  summarizeSession,
  type ReturnBucket,
  type SessionRating,
} from "@/lib/session-summary";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ deck?: string; mode?: string; since?: string }> };

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const RATING_STYLE: Record<SessionRating, string> = {
  again: "text-rose-500",
  hard: "text-amber-500",
  good: "text-emerald-500",
  easy: "text-sky-500",
};

const RETURN_LABEL: Record<ReturnBucket, string> = {
  now: "ready to review now",
  today: "back later today",
  tomorrow: "back tomorrow",
  later: "back in a few days",
};

export default async function SessionSummaryPage({ searchParams }: Props) {
  const sp = await searchParams;
  const now = new Date();
  const since = parseSince(sp?.since, now);
  const deckId = sp?.deck && UUID_RE.test(sp.deck) ? sp.deck : undefined;
  const mode = sp?.mode === "productive" ? "productive" : "receptive";

  const rows = since
    ? await db
        .select({
          cardId: reviewLog.cardId,
          rating: reviewLog.rating,
          reviewTimeMs: reviewLog.reviewTimeMs,
          reviewedAt: reviewLog.reviewedAt,
          due: cards.due,
          fields: notes.fields,
        })
        .from(reviewLog)
        .innerJoin(cards, eq(reviewLog.cardId, cards.id))
        .innerJoin(notes, eq(cards.noteId, notes.id))
        .where(
          and(
            gte(reviewLog.reviewedAt, since),
            deckId ? eq(cards.deckId, deckId) : undefined,
          ),
        )
        .orderBy(asc(reviewLog.reviewedAt))
    : [];

  const summary = summarizeSession(
    rows.map((r) => {
      const f = r.fields as { spanish?: string; answer?: string; english?: string };
      return {
        cardId: r.cardId,
        rating: r.rating,
        reviewTimeMs: r.reviewTimeMs,
        reviewedAt: r.reviewedAt,
        due: r.due,
        word: f.spanish ?? f.answer ?? "",
        english: f.english ?? "",
      };
    }),
    now,
  );

  const continueQuery: Record<string, string> = deckId ? { mode, deck: deckId } : { mode };

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-12">
      <div className="w-full max-w-md flex flex-col gap-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Session saved</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Every rating is saved the moment you tap it. Cards come back on their own schedule.
          </p>
        </header>

        {summary.reviews === 0 ? (
          <p className="text-center text-zinc-500" data-testid="summary-empty">
            No cards reviewed in this session.
          </p>
        ) : (
          <>
            <section className="grid grid-cols-2 gap-3 text-center">
              <Stat label="cards" value={String(summary.words.length)} testId="summary-cards" />
              <Stat label="time" value={formatDuration(summary.totalMs)} />
            </section>

            <section className="flex justify-center gap-4 text-sm" aria-label="ratings">
              {(Object.keys(RATING_STYLE) as SessionRating[]).map((r) => (
                <span key={r}>
                  {r}{" "}
                  <span className={`font-semibold ${RATING_STYLE[r]}`}>{summary.byRating[r]}</span>
                </span>
              ))}
            </section>

            <section className="rounded-lg border border-zinc-300 dark:border-zinc-700 p-4 text-sm">
              <h2 className="font-semibold mb-2 text-zinc-900 dark:text-zinc-100">What happens next</h2>
              <ul className="flex flex-col gap-1 text-zinc-600 dark:text-zinc-400">
                {(Object.keys(RETURN_LABEL) as ReturnBucket[])
                  .filter((b) => summary.returns[b] > 0)
                  .map((b) => (
                    <li key={b}>
                      {summary.returns[b]} {RETURN_LABEL[b]}
                    </li>
                  ))}
              </ul>
            </section>

            <ul className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm" aria-label="words">
              {summary.words.map((w) => (
                <li key={w.cardId} className="flex items-baseline justify-between gap-3 py-2">
                  <span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">{w.word}</span>
                    {w.english && <span className="text-zinc-500"> · {w.english}</span>}
                  </span>
                  <span className={`shrink-0 ${RATING_STYLE[w.lastRating]}`}>
                    {w.lastRating}
                    {w.earlierMisses > 0 && (
                      <span className="text-zinc-400"> (missed {w.earlierMisses}× before)</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="flex justify-center gap-3">
          <Link
            href={{ pathname: "/review", query: continueQuery }}
            className="rounded-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 px-5 py-2 text-sm font-medium hover:opacity-90"
          >
            Continue practising
          </Link>
          <Link
            href="/"
            className="rounded-full border border-zinc-300 dark:border-zinc-700 px-5 py-2 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value, testId }: { label: string; value: string; testId?: string }) {
  return (
    <div className="rounded-lg border border-zinc-300 dark:border-zinc-700 p-3">
      <div className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50" data-testid={testId}>
        {value}
      </div>
      <div className="text-xs uppercase tracking-wide text-zinc-500">{label}</div>
    </div>
  );
}
