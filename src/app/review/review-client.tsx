"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { matchesAnswer } from "@/lib/cognates";

type Rating = "again" | "hard" | "good" | "easy";

export type ReviewCard = {
  id: string;
  state: "new" | "learning" | "review" | "relearning";
  due: string;
  reps: number;
  lapses: number;
  noteType: string;
  fields: {
    spanish: string;
    english: string;
    example?: string;
    exampleEnglish?: string;
    gender?: "m" | "f";
    englishTrap?: string;
    sentence?: string;
    answer?: string;
    sentenceEnglish?: string;
    infinitive?: string;
    person?: string;
    tense?: string;
    audio?: { word?: string; example?: string };
  };
};

type Counts = { new: number; learning: number; review: number; relearning: number };

const RATING_BUTTONS: { rating: Rating; label: string; key: string; cls: string }[] = [
  { rating: "again", label: "Again", key: "1", cls: "bg-rose-500 hover:bg-rose-600" },
  { rating: "hard", label: "Hard", key: "2", cls: "bg-amber-500 hover:bg-amber-600" },
  { rating: "good", label: "Good", key: "3", cls: "bg-emerald-500 hover:bg-emerald-600" },
  { rating: "easy", label: "Easy", key: "4", cls: "bg-sky-500 hover:bg-sky-600" },
];

export function ReviewClient({
  card,
  counts,
  deckName,
  mode = "receptive",
}: {
  card: ReviewCard | null;
  counts: Counts;
  deckName?: string | null;
  mode?: "receptive" | "productive";
}) {
  const router = useRouter();
  const [revealed, setRevealed] = useState(false);
  const [typed, setTyped] = useState("");
  const [typedResult, setTypedResult] = useState<"correct" | "wrong" | null>(null);
  const [isPending, startTransition] = useTransition();
  const startedAt = useRef<number | null>(null);
  const wordAudioRef = useRef<HTMLAudioElement | null>(null);
  const exAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    startedAt.current = performance.now();
  }, []);

  const playWord = useCallback(() => {
    const el = wordAudioRef.current;
    if (!el) return;
    el.currentTime = 0;
    void el.play().catch(() => {});
  }, []);

  const playExample = useCallback(() => {
    const el = exAudioRef.current;
    if (!el) return;
    el.currentTime = 0;
    void el.play().catch(() => {});
  }, []);

  useEffect(() => {
    if (!card?.fields.audio?.word) return;
    playWord();
  }, [card?.id, card?.fields.audio?.word, playWord]);

  useEffect(() => {
    if (!revealed) return;
    if (card?.fields.audio?.example) playExample();
  }, [revealed, card?.fields.audio?.example, playExample]);

  const rate = useCallback(
    async (rating: Rating) => {
      if (!card) return;
      const start = startedAt.current ?? performance.now();
      const durationMs = Math.round(performance.now() - start);
      await fetch("/api/review/rate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ cardId: card.id, rating, durationMs }),
      });
      startTransition(() => router.refresh());
    },
    [card, router],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!card || isPending) return;
      if (!revealed) {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          setRevealed(true);
        }
        return;
      }
      const btn = RATING_BUTTONS.find((b) => b.key === e.key);
      if (btn) {
        e.preventDefault();
        void rate(btn.rating);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [card, revealed, isPending, rate]);

  if (!card) {
    return (
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-semibold mb-2">All done</h1>
        <p className="text-zinc-500">No cards due. Come back later.</p>
        <CountsBar counts={counts} />
      </div>
    );
  }

  const genderArticle =
    card.fields.gender === "m" ? "el" : card.fields.gender === "f" ? "la" : null;
  const genderColor =
    card.fields.gender === "m"
      ? "text-sky-500"
      : card.fields.gender === "f"
        ? "text-rose-500"
        : "";

  const isProductive = mode === "productive";
  const canCheckTyped =
    isProductive && card.noteType !== "cloze" && Boolean(card.fields.spanish);

  function checkTyped() {
    if (!typed.trim() || !card?.fields.spanish) return;
    const ok = matchesAnswer(typed, card.fields.spanish);
    setTypedResult(ok ? "correct" : "wrong");
    setRevealed(true);
  }

  return (
    <div className="w-full max-w-md flex flex-col items-center gap-8">
      <CountsBar counts={counts} />
      <ModeSwitch mode={mode} deckName={deckName} />
      {deckName && (
        <div className="text-xs text-zinc-500">
          deck: <span className="font-medium text-zinc-700 dark:text-zinc-300">{deckName}</span>
        </div>
      )}
      <div className="text-xs uppercase tracking-wide text-zinc-400">
        {card.state} · rep {card.reps}
      </div>

      <div className="min-h-[12rem] flex flex-col items-center justify-center gap-3 text-center">
        {card.noteType === "cloze" && card.fields.sentence ? (
          <ClozeBody card={card} revealed={revealed} />
        ) : canCheckTyped && !revealed ? (
          <ProductiveBody card={card} />
        ) : (
          <VocabBody
            card={card}
            revealed={revealed}
            genderArticle={genderArticle}
            genderColor={genderColor}
            playWord={playWord}
            playExample={playExample}
            typedResult={typedResult}
            typedAnswer={typed}
          />
        )}
      </div>

      {card.fields.audio?.word && (
        <audio ref={wordAudioRef} src={card.fields.audio.word} preload="auto" />
      )}
      {card.fields.audio?.example && (
        <audio ref={exAudioRef} src={card.fields.audio.example} preload="auto" />
      )}

      {!revealed && canCheckTyped ? (
        <div className="w-full flex flex-col gap-2">
          <input
            autoFocus
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") checkTyped();
            }}
            placeholder="type Spanish translation"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            className="w-full rounded border border-zinc-300 dark:border-zinc-700 bg-transparent px-4 py-3 text-center text-lg outline-none focus:ring-2 focus:ring-zinc-500/40"
          />
          <button
            type="button"
            onClick={checkTyped}
            disabled={!typed.trim()}
            className="self-end rounded-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 px-5 py-2 text-sm disabled:opacity-50"
          >
            Check (enter)
          </button>
        </div>
      ) : !revealed ? (
        <button
          type="button"
          onClick={() => setRevealed(true)}
          disabled={isPending}
          className="inline-flex items-center justify-center rounded-full bg-zinc-900 dark:bg-zinc-50 px-8 py-3 text-sm font-medium text-zinc-50 dark:text-zinc-900 hover:opacity-90 disabled:opacity-50"
        >
          Reveal (space)
        </button>
      ) : (
        <div className="grid grid-cols-4 gap-2 w-full">
          {RATING_BUTTONS.map((b) => (
            <button
              key={b.rating}
              type="button"
              onClick={() => rate(b.rating)}
              disabled={isPending}
              className={`flex flex-col items-center justify-center rounded-lg px-2 py-3 text-white text-sm font-medium disabled:opacity-50 ${b.cls}`}
            >
              <span>{b.label}</span>
              <span className="text-[10px] opacity-80">{b.key}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ClozeBody({ card, revealed }: { card: ReviewCard; revealed: boolean }) {
  const sentence = card.fields.sentence ?? "";
  const answer = card.fields.answer ?? "";
  const parts = sentence.split("___");
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-xs uppercase tracking-wide text-zinc-500">
        {card.fields.infinitive} · {card.fields.person} · {card.fields.tense}
      </div>
      <div className="text-3xl font-medium text-zinc-900 dark:text-zinc-50">
        {parts.map((part, i) => (
          <span key={`p${i}`}>
            {part}
            {i < parts.length - 1 &&
              (revealed ? (
                <span className="text-emerald-500 font-semibold">{answer}</span>
              ) : (
                <span className="text-zinc-400">___</span>
              ))}
          </span>
        ))}
      </div>
      {revealed && card.fields.sentenceEnglish && (
        <div className="text-sm text-zinc-500 italic">{card.fields.sentenceEnglish}</div>
      )}
    </div>
  );
}

function ProductiveBody({ card }: { card: ReviewCard }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className="text-xs uppercase tracking-wide text-zinc-500">Type the Spanish for:</div>
      <div className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
        {card.fields.english}
      </div>
      {card.fields.exampleEnglish && (
        <div className="text-sm text-zinc-500 italic">{card.fields.exampleEnglish}</div>
      )}
    </div>
  );
}

function ModeSwitch({
  mode,
  deckName,
}: {
  mode: "receptive" | "productive";
  deckName?: string | null;
}) {
  const recHref: { pathname: "/review"; query: Record<string, string> } = {
    pathname: "/review",
    query: deckName ? { deck: "", mode: "receptive" } : { mode: "receptive" },
  };
  const proHref: { pathname: "/review"; query: Record<string, string> } = {
    pathname: "/review",
    query: deckName ? { deck: "", mode: "productive" } : { mode: "productive" },
  };
  // Note: we can't easily preserve deck id here without it being prop-drilled.
  // Strip empty deck= keys to avoid mis-routing.
  if (!deckName) {
    delete recHref.query.deck;
    delete proHref.query.deck;
  }
  return (
    <div className="flex gap-1 text-xs">
      <Link
        href={{ pathname: "/review", query: { mode: "receptive" } }}
        className={`rounded-full px-3 py-1 ${
          mode === "receptive"
            ? "bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900"
            : "border border-zinc-300 dark:border-zinc-700"
        }`}
      >
        ES → EN
      </Link>
      <Link
        href={{ pathname: "/review", query: { mode: "productive" } }}
        className={`rounded-full px-3 py-1 ${
          mode === "productive"
            ? "bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900"
            : "border border-zinc-300 dark:border-zinc-700"
        }`}
      >
        EN → ES
      </Link>
    </div>
  );
}

function VocabBody({
  card,
  revealed,
  genderArticle,
  genderColor,
  playWord,
  playExample,
  typedResult,
  typedAnswer,
}: {
  card: ReviewCard;
  revealed: boolean;
  genderArticle: string | null;
  genderColor: string;
  playWord: () => void;
  playExample: () => void;
  typedResult?: "correct" | "wrong" | null;
  typedAnswer?: string;
}) {
  return (
    <>
      <div className="flex items-center gap-3">
        <div className="text-5xl font-semibold text-zinc-900 dark:text-zinc-50">
          {genderArticle && <span className={genderColor}>{genderArticle} </span>}
          {card.fields.spanish}
        </div>
        {card.fields.audio?.word && (
          <button
            type="button"
            onClick={playWord}
            aria-label="Play pronunciation"
            className="text-2xl text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            🔊
          </button>
        )}
      </div>
      {revealed && typedResult && (
        <div className="text-sm">
          {typedResult === "correct" ? (
            <span className="text-emerald-500">✓ you typed: {typedAnswer}</span>
          ) : (
            <span className="text-rose-500">✗ you typed: {typedAnswer}</span>
          )}
        </div>
      )}
      {revealed && (
        <>
          {card.noteType === "false_friend" && card.fields.englishTrap && (
            <div className="text-sm text-rose-500">
              not <span className="line-through">{card.fields.englishTrap}</span>
            </div>
          )}
          <div className="text-xl text-zinc-600 dark:text-zinc-300">
            {card.noteType === "false_friend" && <span className="text-emerald-500">= </span>}
            {card.fields.english}
          </div>
          {card.fields.example && (
            <div className="mt-4 text-sm text-zinc-500 dark:text-zinc-400 italic flex items-center justify-center gap-2">
              <span>&ldquo;{card.fields.example}&rdquo;</span>
              {card.fields.audio?.example && (
                <button
                  type="button"
                  onClick={playExample}
                  aria-label="Play example"
                  className="not-italic text-base hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                  🔊
                </button>
              )}
            </div>
          )}
          {card.fields.exampleEnglish && (
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              {card.fields.exampleEnglish}
            </div>
          )}
        </>
      )}
    </>
  );
}

function CountsBar({ counts }: { counts: Counts }) {
  return (
    <div className="flex gap-4 text-xs text-zinc-500">
      <span>
        new <span className="text-zinc-900 dark:text-zinc-100 font-semibold">{counts.new}</span>
      </span>
      <span>
        learn <span className="text-amber-500 font-semibold">{counts.learning}</span>
      </span>
      <span>
        review <span className="text-emerald-500 font-semibold">{counts.review}</span>
      </span>
    </div>
  );
}
