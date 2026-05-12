"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { scoreDictation, type DictationScore } from "@/lib/dictation";

export type PronounceItem = {
  id: string;
  seed: string;
  audioUrl: string;
  expected: string;
};

type RecognitionResult = { transcript: string; confidence: number };

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  addEventListener: (
    type: string,
    listener: (e: { results?: ArrayLike<ArrayLike<RecognitionResult>>; error?: string }) => void,
  ) => void;
};

type SpeechCtor = new () => SpeechRecognitionLike;

function getSpeechRecognition(): SpeechCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechCtor;
    webkitSpeechRecognition?: SpeechCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function PronounceClient({ item }: { item: PronounceItem | null }) {
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recRef = useRef<SpeechRecognitionLike | null>(null);
  const supported = typeof window !== "undefined" && !!getSpeechRecognition();
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [score, setScore] = useState<DictationScore | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!item) {
    return (
      <p className="text-center text-zinc-500">
        No audio sentences in the DB yet — run <code>pnpm audio:gen</code>.
      </p>
    );
  }

  function play() {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = 0;
    void el.play().catch(() => {});
  }

  function recordOnce() {
    setError(null);
    setTranscript("");
    setScore(null);
    const Ctor = getSpeechRecognition();
    if (!Ctor) {
      setError("Browser speech recognition unavailable — use Chrome or Safari.");
      return;
    }
    const rec = new Ctor();
    rec.lang = "es-MX";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.continuous = false;
    rec.addEventListener("result", (e) => {
      const best = e.results?.[0]?.[0]?.transcript ?? "";
      setTranscript(best);
      setScore(scoreDictation(item!.expected, best));
    });
    rec.addEventListener("error", (e) =>
      setError(e.error ? `speech error: ${e.error}` : "speech error"),
    );
    rec.addEventListener("end", () => setListening(false));
    recRef.current = rec;
    setListening(true);
    rec.start();
  }

  function next() {
    startTransition(() => router.refresh());
  }

  return (
    <section className="rounded-lg border border-zinc-300 dark:border-zinc-700 p-6 flex flex-col gap-4">
      <div className="text-center">
        <div className="text-xs uppercase tracking-wide text-zinc-500">Target sentence</div>
        <p className="mt-1 text-lg">{item.expected}</p>
      </div>

      <div className="flex justify-center gap-3">
        <button
          type="button"
          onClick={play}
          aria-label="Play sample"
          className="text-3xl hover:scale-105 transition"
        >
          🔊
        </button>
        <button
          type="button"
          onClick={recordOnce}
          disabled={!supported || listening}
          className="rounded-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 px-5 py-2 text-sm disabled:opacity-50"
        >
          {listening ? "Listening…" : supported ? "🎙 Record" : "Unsupported"}
        </button>
      </div>
      <audio ref={audioRef} src={item.audioUrl} preload="auto" />

      {transcript && (
        <div className="text-sm text-center">
          <span className="text-zinc-500">heard: </span>
          <span className="italic">&ldquo;{transcript}&rdquo;</span>
        </div>
      )}

      {score && (
        <div className="space-y-2">
          <div className="text-center text-2xl font-bold">
            {score.correctCount}/{score.expectedCount}{" "}
            <span className="ml-2 text-sm text-zinc-500">({score.percent}%)</span>
          </div>
          <p className="text-sm text-center">
            {score.expected.map((t, i) => (
              <span
                key={i}
                className={
                  t.status === "correct"
                    ? "text-emerald-500"
                    : t.status === "missing"
                      ? "text-amber-500 underline decoration-dotted"
                      : "text-rose-500"
                }
              >
                {t.token}{" "}
              </span>
            ))}
          </p>
        </div>
      )}

      {error && <p className="text-sm text-rose-500 text-center">{error}</p>}

      <button
        type="button"
        onClick={next}
        disabled={isPending}
        className="self-end rounded-full border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-sm disabled:opacity-50"
      >
        Next
      </button>
    </section>
  );
}
