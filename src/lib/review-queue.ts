import { and, eq, lte, ne, or, sql } from "drizzle-orm";
import { db, type DB } from "@/db/client";
import { cards } from "@/db/schema";
import { getSettings } from "@/lib/settings";

export async function countNewIntroducedToday(
  now = new Date(),
  connection: Pick<DB, "execute"> = db,
): Promise<number> {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const rows = await connection.execute<{ count: number }>(sql`
    select count(*)::int as count
    from (
      select card_id, min(reviewed_at) as first_at
      from review_log group by card_id
    ) t
    where t.first_at >= ${start.toISOString()}::timestamptz
  `);
  return rows[0]?.count ?? 0;
}

export async function newCardsRemaining(now = new Date()): Promise<number> {
  const [settings, introduced] = await Promise.all([
    getSettings(), countNewIntroducedToday(now),
  ]);
  return Math.max(0, settings.newCardsPerDay - introduced);
}

export function reviewQueueWhere(newCardsLeft: number, now: Date) {
  const dueReview = and(ne(cards.state, "new"), lte(cards.due, now));
  return newCardsLeft > 0 ? or(eq(cards.state, "new"), dueReview) : dueReview;
}
