type MaybeElement = { tagName?: string; isContentEditable?: boolean } | null;

/** True when a keystroke belongs to a text field, so page-level shortcuts must ignore it. */
export function isEditableTarget(target: unknown): boolean {
  const el = target as MaybeElement;
  if (!el) return false;
  if (el.isContentEditable === true) return true;
  const tag = typeof el.tagName === "string" ? el.tagName.toUpperCase() : "";
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

/** True when a keystroke targets a focused link, whose Enter must navigate instead of triggering a shortcut. */
export function isLinkTarget(target: unknown): boolean {
  const el = target as MaybeElement;
  return typeof el?.tagName === "string" && el.tagName.toUpperCase() === "A";
}
