import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  real,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";

export const cardStateEnum = pgEnum("card_state", [
  "new",
  "learning",
  "review",
  "relearning",
]);

export const noteTypeEnum = pgEnum("note_type", [
  "vocab",
  "cloze",
  "listening",
  "conjugation",
  "gender",
  "false_friend",
  "cognate_rule",
]);

export const ratingEnum = pgEnum("rating", ["again", "hard", "good", "easy"]);

export const decks = pgTable("decks", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  parentId: uuid("parent_id"),
  settings: jsonb("settings").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const notes = pgTable(
  "notes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    noteType: noteTypeEnum("note_type").notNull(),
    fields: jsonb("fields").$type<Record<string, unknown>>().notNull(),
    tags: jsonb("tags").$type<string[]>().default([]).notNull(),
    source: text("source"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    typeIdx: index("notes_type_idx").on(t.noteType),
  }),
);

export const cards = pgTable(
  "cards",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    noteId: uuid("note_id")
      .notNull()
      .references(() => notes.id, { onDelete: "cascade" }),
    deckId: uuid("deck_id")
      .notNull()
      .references(() => decks.id, { onDelete: "cascade" }),
    state: cardStateEnum("state").default("new").notNull(),
    due: timestamp("due", { withTimezone: true }).defaultNow().notNull(),
    stability: real("stability").default(0).notNull(),
    difficulty: real("difficulty").default(0).notNull(),
    elapsedDays: integer("elapsed_days").default(0).notNull(),
    scheduledDays: integer("scheduled_days").default(0).notNull(),
    reps: integer("reps").default(0).notNull(),
    lapses: integer("lapses").default(0).notNull(),
    lastReview: timestamp("last_review", { withTimezone: true }),
  },
  (t) => ({
    dueIdx: index("cards_due_idx").on(t.due),
    stateIdx: index("cards_state_idx").on(t.state),
    deckIdx: index("cards_deck_idx").on(t.deckId),
  }),
);

export const reviewLog = pgTable(
  "review_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    cardId: uuid("card_id")
      .notNull()
      .references(() => cards.id, { onDelete: "cascade" }),
    rating: ratingEnum("rating").notNull(),
    state: cardStateEnum("state").notNull(),
    stability: real("stability").notNull(),
    difficulty: real("difficulty").notNull(),
    reviewTimeMs: integer("review_time_ms").notNull(),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    cardIdx: index("review_log_card_idx").on(t.cardId),
    reviewedIdx: index("review_log_reviewed_idx").on(t.reviewedAt),
  }),
);

export const vocabulary = pgTable(
  "vocabulary",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    word: text("word").notNull().unique(),
    frequencyRank: integer("frequency_rank"),
    familiarity: integer("familiarity").default(0).notNull(),
    contexts: jsonb("contexts").$type<string[]>().default([]).notNull(),
  },
  (t) => ({
    freqIdx: index("vocab_freq_idx").on(t.frequencyRank),
  }),
);

export type Card = typeof cards.$inferSelect;
export type NewCard = typeof cards.$inferInsert;
export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;
export type Deck = typeof decks.$inferSelect;
export type ReviewLogRow = typeof reviewLog.$inferSelect;
