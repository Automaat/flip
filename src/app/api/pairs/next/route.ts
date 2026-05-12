import { NextResponse } from "next/server";
import { MINIMAL_PAIRS } from "@/data/minimal-pairs";
import { audioUrl, VOICES } from "@/lib/tts";

export const dynamic = "force-dynamic";

export async function GET() {
  const idx = Math.floor(Math.random() * MINIMAL_PAIRS.length);
  const pair = MINIMAL_PAIRS[idx]!;
  // Randomize which clip we play to avoid positional bias.
  const playA = Math.random() < 0.5;
  const voice = VOICES.mxFemale!;
  const target = playA ? pair.a : pair.b;
  return NextResponse.json({
    index: idx,
    contrast: pair.contrast,
    audioUrl: audioUrl(target.spanish, voice),
    a: pair.a,
    b: pair.b,
    correct: playA ? "a" : "b",
  });
}
