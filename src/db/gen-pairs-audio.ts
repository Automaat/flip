import { generateAudio, VOICES } from "../lib/tts";
import { MINIMAL_PAIRS } from "../data/minimal-pairs";

async function main() {
  const voice = VOICES.mxFemale!;
  let generated = 0;
  let cached = 0;
  for (const p of MINIMAL_PAIRS) {
    for (const w of [p.a, p.b]) {
      const r = await generateAudio(w.spanish, voice);
      if (r.cached) cached++;
      else generated++;
    }
  }
  console.log(`✓ minimal-pair audio: ${generated} new, ${cached} cached`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
