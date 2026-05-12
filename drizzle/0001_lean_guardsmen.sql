CREATE TABLE "app_settings" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"new_cards_per_day" integer DEFAULT 20 NOT NULL,
	"retention" real DEFAULT 0.9 NOT NULL,
	"voice_id" text DEFAULT 'es-MX-DaliaNeural' NOT NULL,
	"region" text DEFAULT 'latam' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
