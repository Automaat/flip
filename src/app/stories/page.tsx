import Link from "next/link";
import { StoriesClient } from "./stories-client";

export const dynamic = "force-dynamic";

export default function StoriesPage() {
  return (
    <main className="flex flex-1 flex-col items-center px-6 py-8">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Stories</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Graded readers generated at your level on the topic of your choice.
          </p>
        </header>

        <StoriesClient />

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
