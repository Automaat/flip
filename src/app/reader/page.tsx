import Link from "next/link";
import { ReaderClient } from "./reader-client";

export const dynamic = "force-dynamic";

export default function ReaderPage() {
  return (
    <main className="flex flex-1 flex-col items-center px-6 py-8">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Reader</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Paste Spanish text. Words are colored by familiarity. Tap an unknown
            word to add it to your review queue.
          </p>
        </header>

        <ReaderClient />

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
