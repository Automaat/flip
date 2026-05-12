import {
  fsrs,
  generatorParameters,
  Rating,
  State,
  type Card as FsrsCard,
  createEmptyCard,
} from "ts-fsrs";

const params = generatorParameters({
  enable_fuzz: true,
  request_retention: 0.9,
  maximum_interval: 36500,
});

export const scheduler = fsrs(params);

const stateMap = {
  [State.New]: "new",
  [State.Learning]: "learning",
  [State.Review]: "review",
  [State.Relearning]: "relearning",
} as const;

export const ratingMap = {
  again: Rating.Again,
  hard: Rating.Hard,
  good: Rating.Good,
  easy: Rating.Easy,
} as const;

export type AppRating = keyof typeof ratingMap;
export type AppState = (typeof stateMap)[keyof typeof stateMap];

export function toAppState(s: State): AppState {
  return stateMap[s];
}

export function newCard(now = new Date()): FsrsCard {
  return createEmptyCard(now);
}

export function review(card: FsrsCard, rating: AppRating, now = new Date()) {
  const result = scheduler.next(card, now, ratingMap[rating]);
  return result;
}
