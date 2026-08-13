type MaybeElement = { tagName?: string; isContentEditable?: boolean } | null;

/** True when a keystroke belongs to a text field, so page-level shortcuts must ignore it. */
export function isEditableTarget(target: unknown): boolean {
  const el = target as MaybeElement;
  if (!el) return false;
  if (el.isContentEditable === true) return true;
  const tag = typeof el.tagName === "string" ? el.tagName.toUpperCase() : "";
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}
