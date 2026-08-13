export type TypedResult = "correct" | "wrong";
export type TypedRating = "again" | "good";

/** Grade a typed answer automatically: the typing already told us whether it was recalled. */
export function typedRating(result: TypedResult): TypedRating {
  return result === "correct" ? "good" : "again";
}
