import {
  fsrs,
  generatorParameters,
  Rating,
  State,
  type Card as FsrsCard,
  createEmptyCard,
} from "ts-fsrs";
import type { Card as CardRow } from "@/db/schema";

const params = generatorParameters({
  enable_fuzz: true,
  request_retention: 0.9,
  maximum_interval: 36500,
});

export const scheduler = fsrs(params);

const stateToDb = {
  [State.New]: "new",
  [State.Learning]: "learning",
  [State.Review]: "review",
  [State.Relearning]: "relearning",
} as const;

const dbToState = {
  new: State.New,
  learning: State.Learning,
  review: State.Review,
  relearning: State.Relearning,
} as const;

export const ratingMap = {
  again: Rating.Again,
  hard: Rating.Hard,
  good: Rating.Good,
  easy: Rating.Easy,
} as const;

export type AppRating = keyof typeof ratingMap;
export type AppState = (typeof stateToDb)[keyof typeof stateToDb];

export function newCard(now = new Date()): FsrsCard {
  return createEmptyCard(now);
}

export function rowToFsrs(row: CardRow): FsrsCard {
  return {
    due: row.due,
    stability: row.stability,
    difficulty: row.difficulty,
    elapsed_days: row.elapsedDays,
    scheduled_days: row.scheduledDays,
    learning_steps: 0,
    reps: row.reps,
    lapses: row.lapses,
    state: dbToState[row.state],
    last_review: row.lastReview ?? undefined,
  };
}

export function fsrsToRowFields(card: FsrsCard) {
  return {
    state: stateToDb[card.state],
    due: card.due,
    stability: card.stability,
    difficulty: card.difficulty,
    elapsedDays: card.elapsed_days,
    scheduledDays: card.scheduled_days,
    reps: card.reps,
    lapses: card.lapses,
    lastReview: card.last_review ?? null,
  };
}

export function review(card: FsrsCard, rating: AppRating, now = new Date()) {
  return scheduler.next(card, now, ratingMap[rating]);
}
