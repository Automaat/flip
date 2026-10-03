export type SessionRating = "again" | "hard" | "good" | "easy";

export type SessionLogRow = {
  cardId: string;
  rating: SessionRating;
  reviewTimeMs: number;
  reviewedAt: Date;
  due: Date;
  word: string;
  english: string;
};

export type ReturnBucket = "today" | "tomorrow" | "later";

export type SessionWord = {
  cardId: string;
  word: string;
  english: string;
  lastRating: SessionRating;
  misses: number;
  returns: ReturnBucket;
};

export type SessionSummary = {
  reviews: number;
  byRating: Record<SessionRating, number>;
  totalMs: number;
  words: SessionWord[];
  returns: Record<ReturnBucket, number>;
};

/** Max age of a session start; older or future `since` values start a fresh session. */
export const MAX_SESSION_MS = 24 * 60 * 60 * 1000;

export function parseSince(raw: string | undefined, now: Date): Date | null {
  if (!raw) return null;
  const since = new Date(raw);
  const age = now.getTime() - since.getTime();
  if (Number.isNaN(age) || age < 0 || age > MAX_SESSION_MS) return null;
  return since;
}

export function returnBucket(due: Date, now: Date): ReturnBucket {
  const endOfToday = new Date(now);
  endOfToday.setHours(24, 0, 0, 0);
  if (due < endOfToday) return "today";
  const endOfTomorrow = new Date(endOfToday);
  endOfTomorrow.setDate(endOfTomorrow.getDate() + 1);
  return due < endOfTomorrow ? "tomorrow" : "later";
}

/** Fold review_log rows (any order) into per-session totals and one entry per card, latest rating wins. */
export function summarizeSession(rows: SessionLogRow[], now: Date): SessionSummary {
  const byRating: Record<SessionRating, number> = { again: 0, hard: 0, good: 0, easy: 0 };
  const returns: Record<ReturnBucket, number> = { today: 0, tomorrow: 0, later: 0 };
  const latest = new Map<string, { word: SessionWord; at: number }>();
  let totalMs = 0;

  for (const r of rows) {
    byRating[r.rating]++;
    totalMs += r.reviewTimeMs;
    const prev = latest.get(r.cardId);
    const misses = (prev?.word.misses ?? 0) + (r.rating === "again" ? 1 : 0);
    const at = r.reviewedAt.getTime();
    if (prev && at < prev.at) {
      prev.word.misses = misses;
      continue;
    }
    latest.set(r.cardId, {
      at,
      word: {
        cardId: r.cardId,
        word: r.word,
        english: r.english,
        lastRating: r.rating,
        misses,
        returns: returnBucket(r.due, now),
      },
    });
  }

  const words = [...latest.values()].toSorted((a, b) => a.at - b.at).map((e) => e.word);
  for (const w of words) returns[w.returns]++;

  return { reviews: rows.length, byRating, totalMs, words, returns };
}

export function formatDuration(ms: number): string {
  const totalSec = Math.round(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  if (min === 0) return `${sec}s`;
  return sec === 0 ? `${min} min` : `${min} min ${sec}s`;
}
