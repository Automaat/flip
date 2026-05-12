import Link from "next/link";
import { DictateClient } from "./dictate-client";

export const dynamic = "force-dynamic";

export default function DictatePage() {
  return (
    <main className="flex flex-1 flex-col items-center px-6 py-12">
      <div className="w-full max-w-md flex flex-col gap-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Dictation</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Listen and type what you hear. Accents and punctuation are ignored.
          </p>
        </header>

        <DictateClient />

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
