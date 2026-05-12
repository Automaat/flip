"use client";

import { useState } from "react";

type Card = { spanish: string; english: string; example: string; exampleEnglish: string };

export function ImportClient() {
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  const [step, setStep] = useState<"idle" | "fetching" | "mining" | "done">("idle");
  const [cards, setCards] = useState<Card[]>([]);
  const [created, setCreated] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function fetchUrl() {
    setError(null);
    setStep("fetching");
    setPending(true);
    const res = await fetch("/api/content/fetch", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ url }),
    });
    setPending(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(typeof body.error === "string" ? body.error : `fetch failed ${res.status}`);
      setStep("idle");
      return;
    }
    const body = (await res.json()) as { text: string };
    setText(body.text);
    setStep("idle");
  }

  async function mineAndImport() {
    setError(null);
    setStep("mining");
    setPending(true);
    const res = await fetch("/api/cards/auto-gen", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text, level: "A2", max: 10, importToDeck: true }),
    });
    setPending(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const msg =
        res.status === 503
          ? "Set ANTHROPIC_API_KEY in .env to enable AI mining."
          : typeof body.error === "string"
            ? body.error
            : `error ${res.status}`;
      setError(msg);
      setStep("idle");
      return;
    }
    const body = (await res.json()) as { cards: Card[]; cardsCreated: number };
    setCards(body.cards);
    setCreated(body.cardsCreated ?? 0);
    setStep("done");
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex gap-2">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://elpais.com/..."
          className="flex-1 rounded border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={fetchUrl}
          disabled={!url.trim() || pending}
          className="rounded-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 px-5 py-2 text-sm disabled:opacity-50"
        >
          {step === "fetching" ? "Fetching…" : "Fetch"}
        </button>
      </div>

      {text && (
        <>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent p-3 text-xs leading-relaxed"
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={mineAndImport}
              disabled={pending}
              className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 text-sm disabled:opacity-50"
            >
              {step === "mining" ? "Mining + importing…" : "Mine + import"}
            </button>
          </div>
        </>
      )}

      {error && <p className="text-sm text-rose-500">{error}</p>}

      {step === "done" && (
        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/40 p-4 text-sm">
          ✓ Imported {created} card{created === 1 ? "" : "s"} into the
          &ldquo;Auto-generated&rdquo; deck.
          <ul className="mt-2 list-disc list-inside space-y-1">
            {cards.slice(0, 8).map((c) => (
              <li key={c.spanish}>
                <span className="font-semibold">{c.spanish}</span>{" "}
                <span className="text-zinc-500">— {c.english}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
