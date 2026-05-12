import { dayKey } from "./streaks";

export type ForecastBucket = {
  date: string;
  weekday: string;
  count: number;
  isToday: boolean;
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Group future card due dates into the next `days` calendar buckets,
 * starting from `now`. Cards already past due (or due today) all roll
 * into the first bucket.
 */
export function forecast(
  dueDates: (Date | string)[],
  now: Date = new Date(),
  days = 7,
): ForecastBucket[] {
  const buckets: ForecastBucket[] = [];
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  for (let i = 0; i < days; i++) {
    const d = new Date(todayMidnight.getTime() + i * 24 * 60 * 60 * 1000);
    buckets.push({
      date: dayKey(d),
      weekday: WEEKDAYS[d.getDay()]!,
      count: 0,
      isToday: i === 0,
    });
  }

  const horizonEnd = new Date(todayMidnight.getTime() + days * 24 * 60 * 60 * 1000);
  for (const raw of dueDates) {
    const d = raw instanceof Date ? raw : new Date(raw);
    if (d >= horizonEnd) continue;
    const bucketKey = d < todayMidnight ? buckets[0]!.date : dayKey(d);
    const target = buckets.find((b) => b.date === bucketKey);
    if (target) target.count++;
  }
  return buckets;
}
