import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

export type Voice = {
  id: string;
  short: string;
  rate?: string;
  pitch?: string;
};

export const VOICES: Record<string, Voice> = {
  mxFemale: { id: "es-MX-DaliaNeural", short: "mx-f" },
  mxMale: { id: "es-MX-JorgeNeural", short: "mx-m" },
  esFemale: { id: "es-ES-ElviraNeural", short: "es-f" },
  esMale: { id: "es-ES-AlvaroNeural", short: "es-m" },
};

export const AUDIO_DIR = path.join(process.cwd(), "public", "audio");
export const PUBLIC_PREFIX = "/audio";

export function audioKey(text: string, voice: Voice): string {
  const hash = createHash("sha1").update(`${voice.id}::${text}`).digest("hex").slice(0, 16);
  return `${voice.short}-${hash}.mp3`;
}

export function audioUrl(text: string, voice: Voice): string {
  return `${PUBLIC_PREFIX}/${audioKey(text, voice)}`;
}

export async function generateAudio(
  text: string,
  voice: Voice = VOICES.mxFemale!,
): Promise<{ key: string; absolutePath: string; bytes: number; cached: boolean }> {
  await mkdir(AUDIO_DIR, { recursive: true });
  const key = audioKey(text, voice);
  const absolutePath = path.join(AUDIO_DIR, key);
  if (existsSync(absolutePath)) {
    return { key, absolutePath, bytes: 0, cached: true };
  }
  const tts = new MsEdgeTTS();
  await tts.setMetadata(voice.id, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
  const { audioStream } = tts.toStream(text);
  const chunks: Buffer[] = [];
  await new Promise<void>((resolve, reject) => {
    audioStream.on("data", (c: Buffer) => chunks.push(c));
    audioStream.on("end", resolve);
    audioStream.on("error", reject);
  });
  const buf = Buffer.concat(chunks);
  await writeFile(absolutePath, buf);
  return { key, absolutePath, bytes: buf.length, cached: false };
}
