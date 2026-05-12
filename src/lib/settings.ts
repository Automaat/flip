import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { appSettings, type AppSettings } from "@/db/schema";

export const DEFAULT_SETTINGS = {
  id: 1,
  newCardsPerDay: 20,
  retention: 0.9,
  voiceId: "es-MX-DaliaNeural",
  region: "latam",
} as const;

export async function getSettings(): Promise<AppSettings> {
  const rows = await db.select().from(appSettings).where(eq(appSettings.id, 1));
  if (rows.length > 0) return rows[0]!;
  const [created] = await db
    .insert(appSettings)
    .values(DEFAULT_SETTINGS)
    .returning();
  return created!;
}

export async function updateSettings(patch: Partial<AppSettings>): Promise<AppSettings> {
  await getSettings(); // ensure row exists
  const updateSet = {
    ...patch,
    updatedAt: new Date(),
  };
  const [updated] = await db
    .update(appSettings)
    .set(updateSet)
    .where(eq(appSettings.id, 1))
    .returning();
  return updated!;
}
