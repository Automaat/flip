import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { SettingsClient } from "./settings-client";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const initial = await getSettings();
  return (
    <main className="flex flex-1 flex-col items-center px-6 py-12">
      <div className="w-full max-w-md flex flex-col gap-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Settings</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Tune review intensity, target retention, and regional voice.
          </p>
        </header>

        <SettingsClient
          initial={{
            newCardsPerDay: initial.newCardsPerDay,
            retention: initial.retention,
            voiceId: initial.voiceId,
            region: initial.region as "latam" | "spain",
            immersionPercent: initial.immersionPercent,
          }}
        />

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
