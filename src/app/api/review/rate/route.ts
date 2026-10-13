import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/client";
import { appSettings, cards, reviewLog } from "@/db/schema";
import { fsrsToRowFields, review, rowToFsrs } from "@/lib/fsrs";

import { countNewIntroducedToday } from "@/lib/review-queue";

const BodySchema = z.object({
  cardId: z.string().uuid(),
  expectedReps: z.number().int().min(0),
  rating: z.enum(["again", "hard", "good", "easy"]),
  durationMs: z.number().int().min(0).max(600_000),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { cardId, expectedReps, rating, durationMs } = parsed.data;

  return db.transaction(async (tx) => {
    const [row] = await tx.select().from(cards).where(eq(cards.id, cardId)).for("update");
    if (!row) return NextResponse.json({ error: "card not found" }, { status: 404 });
    if (row.reps !== expectedReps) {
      return NextResponse.json({ error: "card already reviewed; refresh to continue" }, { status: 409 });
    }
    if (row.state === "new") {
      await tx.execute(sql`select pg_advisory_xact_lock(hashtext('flip-new-card-quota'))`);
    }
    const [settings] = await tx.select().from(appSettings).where(eq(appSettings.id, 1));
    if (row.state === "new" &&
      await countNewIntroducedToday(new Date(), tx) >= (settings?.newCardsPerDay ?? 20)) {
      return NextResponse.json({ error: "daily new-card limit reached" }, { status: 409 });
    }
    const result = review(rowToFsrs(row), rating, new Date(), settings?.retention ?? 0.9);
    const next = fsrsToRowFields(result.card);
    await tx.update(cards).set(next).where(eq(cards.id, cardId));
    await tx.insert(reviewLog).values({
      cardId,
      rating,
      state: next.state,
      stability: next.stability,
      difficulty: next.difficulty,
      reviewTimeMs: durationMs,
    });
    return NextResponse.json({
      ok: true,
      nextDue: next.due,
      state: next.state,
      scheduledDays: next.scheduledDays,
    });
  });
}
