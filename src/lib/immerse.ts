/** Tiny EN→ES translation table for UI immersion. */
const TRANSLATIONS: Record<string, string> = {
  Review: "Repaso",
  Decks: "Mazos",
  Cognates: "Cognados",
  "False friends": "Falsos amigos",
  Verbs: "Verbos",
  Dictate: "Dictado",
  Gender: "Género",
  Pairs: "Pares",
  Reader: "Lector",
  Stats: "Estadísticas",
  Etymology: "Etimología",
  Construct: "Construir",
  Translate: "Traducir",
  Tutor: "Tutor",
  Stories: "Historias",
  Write: "Escribir",
  Settings: "Ajustes",
};

function hash(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/**
 * Returns the Spanish version of an English UI label when:
 *   hash(label) % 100  <  percent
 * Stable per (label, percent) — same label flips together across renders.
 * Returns the original when no Spanish equivalent exists.
 */
export function immerse(en: string, percent: number): string {
  if (percent <= 0) return en;
  if (percent >= 100) return TRANSLATIONS[en] ?? en;
  const es = TRANSLATIONS[en];
  if (!es) return en;
  return hash(en) % 100 < percent ? es : en;
}
