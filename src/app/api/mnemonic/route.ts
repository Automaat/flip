import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/client";
import { notes } from "@/db/schema";
import {
  buildMnemonicPrompt,
  getClaudeClient,
  parseMnemonic,
  type Mnemonic,
} from "@/lib/claude";

const BodySchema = z.object({
  noteId: z.string().uuid(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const claude = getClaudeClient();
  if (!claude) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured" },
      { status: 503 },
    );
  }
  const [note] = await db.select().from(notes).where(eq(notes.id, parsed.data.noteId));
  if (!note) return NextResponse.json({ error: "note not found" }, { status: 404 });
  const f = note.fields as { spanish?: string; english?: string; mnemonic?: Mnemonic };
  if (!f.spanish || !f.english) {
    return NextResponse.json({ error: "note missing spanish/english" }, { status: 400 });
  }
  if (f.mnemonic) return NextResponse.json({ mnemonic: f.mnemonic, cached: true });

  const text = await claude.complete(buildMnemonicPrompt(f.spanish, f.english));
  const mnemonic = parseMnemonic(text);
  if (!mnemonic) {
    return NextResponse.json({ error: "could not parse claude response", raw: text }, { status: 502 });
  }
  await db
    .update(notes)
    .set({ fields: { ...f, mnemonic } })
    .where(eq(notes.id, note.id));
  return NextResponse.json({ mnemonic });
}
