"use client";

import { useState } from "react";

const LEVELS = ["A1", "A2", "B1", "B2"] as const;

export function StoriesClient() {
  const [level, setLevel] = useState<(typeof LEVELS)[number]>("A1");
  const [topic, setTopic] = useState("a walk to the market");
  const [pending, setPending] = useState(false);
  const [story, setStory] = useState<{ spanish: string; english: string } | null>(null);
  const [showEn, setShowEn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setPending(true);
    setError(null);
    setShowEn(false);
    const res = await fetch("/api/stories/generate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ level, topic, paragraphs: 2 }),
    });
    setPending(false);
    if (!res.ok) {
      setError(
        res.status === 503
          ? "Set ANTHROPIC_API_KEY in .env to use this."
          : `error ${res.status}`,
      );
      setStory(null);
      return;
    }
    setStory((await res.json()) as { spanish: string; english: string });
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex gap-1 text-xs">
          {LEVELS.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLevel(l)}
              className={`rounded-full px-3 py-1 ${
                level === l
                  ? "bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900"
                  : "border border-zinc-300 dark:border-zinc-700"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="topic"
          className="flex-1 min-w-[10rem] rounded border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={generate}
          disabled={pending || !topic.trim()}
          className="rounded-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 px-5 py-2 text-sm disabled:opacity-50"
        >
          {pending ? "Generating…" : "Generate"}
        </button>
      </div>

      {error && <p className="text-sm text-rose-500">{error}</p>}

      {story && (
        <article className="rounded-lg border border-zinc-300 dark:border-zinc-700 p-4 whitespace-pre-wrap text-sm leading-relaxed">
          {story.spanish}
          {story.english && (
            <details
              className="mt-4 border-t border-zinc-300 dark:border-zinc-700 pt-3"
              open={showEn}
              onToggle={(e) => setShowEn((e.currentTarget as HTMLDetailsElement).open)}
            >
              <summary className="cursor-pointer text-xs text-zinc-500">Translation</summary>
              <p className="mt-2 text-zinc-500 italic">{story.english}</p>
            </details>
          )}
        </article>
      )}
    </section>
  );
}
