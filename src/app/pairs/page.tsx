import Link from "next/link";
import { MINIMAL_PAIRS } from "@/data/minimal-pairs";
import { audioUrl, VOICES } from "@/lib/tts";
import { PairsClient, type PairItem } from "./pairs-client";

export const dynamic = "force-dynamic";

function pickRandom(): PairItem {
  const idx = Math.floor(Math.random() * MINIMAL_PAIRS.length);
  const pair = MINIMAL_PAIRS[idx]!;
  const playA = Math.random() < 0.5;
  const voice = VOICES.mxFemale!;
  const target = playA ? pair.a : pair.b;
  return {
    index: idx,
    seed: Math.random().toString(36).slice(2),
    contrast: pair.contrast,
    audioUrl: audioUrl(target.spanish, voice),
    a: pair.a,
    b: pair.b,
    correct: playA ? "a" : "b",
  };
}

export default function PairsPage() {
  const item = pickRandom();
  return (
    <main className="flex flex-1 flex-col items-center px-6 py-12">
      <div className="w-full max-w-md flex flex-col gap-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Minimal Pairs</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Two words, one sound. Hear it, pick it.
          </p>
        </header>

        <PairsClient key={item.seed} item={item} />

        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            ← back
          </Link>
        </div>
      </div>
    </main>
  );
}
