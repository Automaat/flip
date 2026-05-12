import { NextResponse } from "next/server";
import { z } from "zod";
import { getSettings, updateSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

const BodySchema = z.object({
  newCardsPerDay: z.number().int().min(0).max(200).optional(),
  retention: z.number().min(0.7).max(0.99).optional(),
  voiceId: z.string().min(1).max(80).optional(),
  region: z.enum(["latam", "spain"]).optional(),
});

export async function GET() {
  const s = await getSettings();
  return NextResponse.json(s);
}

export async function PUT(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const updated = await updateSettings(parsed.data);
  return NextResponse.json(updated);
}
