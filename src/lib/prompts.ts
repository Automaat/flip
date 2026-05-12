export type DeepPrompt = { id: string; text: (word: string) => string };

export const DEEP_PROMPTS: DeepPrompt[] = [
  { id: "self", text: (w) => `Think of a sentence with "${w}" about your day.` },
  { id: "emotion", text: (w) => `What does "${w}" remind you of?` },
  { id: "image", text: (w) => `Picture "${w}" in your head. What does it look like?` },
  { id: "context", text: (w) => `When would you say "${w}" out loud?` },
  { id: "synonym", text: (w) => `What's another word like "${w}"?` },
  { id: "opposite", text: (w) => `What's the opposite of "${w}"?` },
];

/**
 * Decide whether to show a deep-processing prompt after a review.
 * Frequency = ~1 in 10; only for learning/relearning state (per FEATURES.md F3.3).
 * `randomFn` is injectable so tests are deterministic.
 */
export function shouldPrompt(
  state: "new" | "learning" | "review" | "relearning",
  randomFn: () => number = Math.random,
): boolean {
  if (state !== "learning" && state !== "relearning") return false;
  return randomFn() < 0.1;
}

export function pickPrompt(seed: number): DeepPrompt {
  const i = Math.abs(seed | 0) % DEEP_PROMPTS.length;
  return DEEP_PROMPTS[i]!;
}
