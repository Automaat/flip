import Link from "next/link";
import { ImportClient } from "./import-client";

export const dynamic = "force-dynamic";

export default function ImportPage() {
  return (
    <main className="flex flex-1 flex-col items-center px-6 py-8">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Import</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Paste a Spanish article URL. We&apos;ll fetch + extract text, then mine
            useful unknown words for SRS via AI auto-gen.
          </p>
        </header>

        <ImportClient />

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
