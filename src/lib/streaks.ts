export type ReviewTimestamp = Date | string;

export type StreakResult = {
  current: number;
  longest: number;
  reviewedToday: boolean;
};

/** YYYY-MM-DD in local time. */
export function dayKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function toDate(t: ReviewTimestamp): Date {
  return t instanceof Date ? t : new Date(t);
}

/** Returns the set of distinct day-keys (local) covered by `timestamps`. */
export function distinctDays(timestamps: ReviewTimestamp[]): Set<string> {
  const out = new Set<string>();
  for (const t of timestamps) out.add(dayKey(toDate(t)));
  return out;
}

/**
 * Compute current and longest streak based on review timestamps.
 * Streak counts back from the most recent activity day (today or yesterday).
 * If the most recent activity is older than yesterday, current streak is 0.
 */
export function computeStreak(
  timestamps: ReviewTimestamp[],
  now: Date = new Date(),
): StreakResult {
  if (timestamps.length === 0) {
    return { current: 0, longest: 0, reviewedToday: false };
  }
  const days = distinctDays(timestamps);
  const todayKey = dayKey(now);
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const yesterdayKey = dayKey(yesterday);
  const reviewedToday = days.has(todayKey);

  // Anchor: start from today if reviewed; else yesterday if reviewed; else 0.
  let anchor: Date | null = null;
  if (reviewedToday) anchor = now;
  else if (days.has(yesterdayKey)) anchor = yesterday;

  let current = 0;
  if (anchor) {
    const cursor = new Date(anchor.getTime());
    while (days.has(dayKey(cursor))) {
      current++;
      cursor.setDate(cursor.getDate() - 1);
    }
  }

  const sorted = [...days].toSorted();
  let longest = 0;
  let run = 0;
  let prevKey: string | null = null;
  for (const k of sorted) {
    if (prevKey === null) {
      run = 1;
    } else {
      const prevDate = new Date(prevKey + "T00:00:00");
      const expected = dayKey(new Date(prevDate.getTime() + 24 * 60 * 60 * 1000));
      run = k === expected ? run + 1 : 1;
    }
    if (run > longest) longest = run;
    prevKey = k;
  }

  return { current, longest, reviewedToday };
}
