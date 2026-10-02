import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/client";
import { cards, decks, notes } from "@/db/schema";
import { buildClozeCards, missingClozes, type Tense, type VerbGroup } from "@/data/verbs";
import { verbDeckName, verbTable } from "@/lib/conjugate";
import { newCard } from "@/lib/fsrs";

const BodySchema = z
  .object({
    tense: z.enum(["present", "preterite", "perfect", "imperfect"]).optional(),
    group: z.enum(["irregular", "regular"]).optional(),
  })
  .nullish();

async function readJson(req: Request): Promise<{ ok: true; value: unknown } | { ok: false }> {
  const text = await req.text();
  if (!text.trim()) return { ok: true, value: null };
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch {
    return { ok: false };
  }
}

export async function POST(req: Request) {
  const body = await readJson(req);
  if (!body.ok) {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }
  const parsed = BodySchema.safeParse(body.value);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const tense: Tense = parsed.data?.tense ?? "present";
  const group: VerbGroup = parsed.data?.group ?? "irregular";
  const deckName = verbDeckName(group, tense);
  const clozes = buildClozeCards(verbTable(group, tense));

  const result = await db.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${deckName}))`);

    const [existing] = await tx.select({ id: decks.id }).from(decks).where(eq(decks.name, deckName));
    const deckId =
      existing?.id ??
      (
        await tx
          .insert(decks)
          .values({ name: deckName, settings: { type: `verbs_${tense}_${group}`, tense, group } })
          .returning({ id: decks.id })
      )[0]!.id;

    const present = existing
      ? await tx
          .select({ fields: notes.fields })
          .from(cards)
          .innerJoin(notes, eq(cards.noteId, notes.id))
          .where(eq(cards.deckId, deckId))
      : [];
    const missing = missingClozes(
      clozes,
      present.map((r) => r.fields as { infinitive?: string; person?: string }),
    );

    const empty = newCard();
    for (const c of missing) {
      const [note] = await tx
        .insert(notes)
        .values({
          noteType: "cloze",
          fields: {
            spanish: c.answer,
            english: c.english,
            sentence: c.sentence,
            answer: c.answer,
            sentenceEnglish: c.sentenceEnglish,
            infinitive: c.infinitive,
            person: c.person,
            tense: c.tense,
          },
          tags: ["verb", tense, group, c.infinitive],
          source: `verbs_${tense}_${group}`,
        })
        .returning({ id: notes.id });
      await tx.insert(cards).values({
        noteId: note!.id,
        deckId,
        state: "new",
        due: empty.due,
        stability: empty.stability,
        difficulty: empty.difficulty,
        elapsedDays: empty.elapsed_days,
        scheduledDays: empty.scheduled_days,
        reps: empty.reps,
        lapses: empty.lapses,
      });
    }
    return { deckId, created: missing.length, existed: Boolean(existing) };
  });

  return NextResponse.json({
    ok: true,
    deckId: result.deckId,
    tense,
    group,
    cardsCreated: result.created,
    alreadyImported: result.existed && result.created === 0,
  });
}
