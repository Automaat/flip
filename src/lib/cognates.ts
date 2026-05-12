const N_PLACEHOLDER = "";
const N_PLACEHOLDER_UPPER = "";

export function normalize(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/ñ/g, N_PLACEHOLDER)
    .replace(/Ñ/g, N_PLACEHOLDER_UPPER)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(new RegExp(N_PLACEHOLDER, "g"), "ñ")
    .replace(new RegExp(N_PLACEHOLDER_UPPER, "g"), "ñ");
}

export function matchesAnswer(actual: string, expected: string): boolean {
  return normalize(actual) === normalize(expected);
}
