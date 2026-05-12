import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/client";
import { cards, reviewLog } from "@/db/schema";
import { fsrsToRowFields, review, rowToFsrs, type AppRating } from "@/lib/fsrs";

const BodySchema = z.object({
  cardId: z.string().uuid(),
  rating: z.enum(["again", "hard", "good", "easy"]),
  durationMs: z.number().int().min(0).max(600_000),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { cardId, rating, durationMs } = parsed.data;

  const [row] = await db.select().from(cards).where(eq(cards.id, cardId));
  if (!row) return NextResponse.json({ error: "card not found" }, { status: 404 });

  const fsrsCard = rowToFsrs(row);
  const result = review(fsrsCard, rating as AppRating);
  const next = fsrsToRowFields(result.card);

  await db.transaction(async (tx) => {
    await tx.update(cards).set(next).where(eq(cards.id, cardId));
    await tx.insert(reviewLog).values({
      cardId,
      rating,
      state: next.state,
      stability: next.stability,
      difficulty: next.difficulty,
      reviewTimeMs: durationMs,
    });
  });

  return NextResponse.json({
    ok: true,
    nextDue: next.due,
    state: next.state,
    scheduledDays: next.scheduledDays,
  });
}
