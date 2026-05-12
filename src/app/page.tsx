import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
      <div className="flex flex-col items-center gap-6 max-w-md">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Flip
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Spanish learning powered by FSRS spaced repetition, AI mnemonics, and
          comprehensible input.
        </p>
        <div className="flex gap-3 mt-4">
          <Link
            href="/review"
            className="inline-flex items-center justify-center rounded-full bg-zinc-900 dark:bg-zinc-50 px-6 py-3 text-sm font-medium text-zinc-50 dark:text-zinc-900 hover:opacity-90 transition"
          >
            Start review
          </Link>
          <Link
            href="/decks"
            className="inline-flex items-center justify-center rounded-full border border-zinc-300 dark:border-zinc-700 px-6 py-3 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
          >
            Decks
          </Link>
        </div>
      </div>
    </main>
  );
}
