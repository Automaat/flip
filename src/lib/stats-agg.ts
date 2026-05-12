import { dayKey } from "./streaks";

export type ReviewEntry = {
  reviewedAt: Date | string;
  rating: "again" | "hard" | "good" | "easy";
};

export type DailyReviewCount = {
  date: string;
  count: number;
  good: number;
  again: number;
};

export function dailyReviews(
  entries: ReviewEntry[],
  now: Date = new Date(),
  days = 30,
): DailyReviewCount[] {
  const buckets = new Map<string, DailyReviewCount>();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(todayMidnight.getTime() - i * 24 * 60 * 60 * 1000);
    const key = dayKey(d);
    buckets.set(key, { date: key, count: 0, good: 0, again: 0 });
  }
  for (const e of entries) {
    const d = e.reviewedAt instanceof Date ? e.reviewedAt : new Date(e.reviewedAt);
    const key = dayKey(d);
    const b = buckets.get(key);
    if (!b) continue;
    b.count++;
    if (e.rating === "good" || e.rating === "easy") b.good++;
    if (e.rating === "again") b.again++;
  }
  return [...buckets.values()];
}

export function accuracy(entries: ReviewEntry[]): number {
  if (entries.length === 0) return 0;
  const ok = entries.filter((e) => e.rating === "good" || e.rating === "easy").length;
  return Math.round((ok / entries.length) * 100);
}
