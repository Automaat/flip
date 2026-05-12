import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import * as schema from "./schema";
import { newCard } from "../lib/fsrs";

type VocabSeed = {
  spanish: string;
  english: string;
  example: string;
  exampleEnglish: string;
  gender?: "m" | "f";
};

const VOCAB: VocabSeed[] = [
  { spanish: "hola", english: "hello", example: "Hola, ¿cómo estás?", exampleEnglish: "Hello, how are you?" },
  { spanish: "gracias", english: "thank you", example: "Muchas gracias por tu ayuda.", exampleEnglish: "Thank you very much for your help." },
  { spanish: "agua", english: "water", example: "Quiero un vaso de agua.", exampleEnglish: "I want a glass of water.", gender: "f" },
  { spanish: "casa", english: "house", example: "Mi casa es pequeña.", exampleEnglish: "My house is small.", gender: "f" },
  { spanish: "perro", english: "dog", example: "El perro corre rápido.", exampleEnglish: "The dog runs fast.", gender: "m" },
  { spanish: "gato", english: "cat", example: "El gato duerme mucho.", exampleEnglish: "The cat sleeps a lot.", gender: "m" },
  { spanish: "libro", english: "book", example: "Estoy leyendo un libro.", exampleEnglish: "I am reading a book.", gender: "m" },
  { spanish: "comida", english: "food", example: "La comida está deliciosa.", exampleEnglish: "The food is delicious.", gender: "f" },
  { spanish: "amigo", english: "friend", example: "Él es mi mejor amigo.", exampleEnglish: "He is my best friend.", gender: "m" },
  { spanish: "tiempo", english: "time / weather", example: "No tengo tiempo hoy.", exampleEnglish: "I don't have time today.", gender: "m" },
  { spanish: "trabajo", english: "work", example: "Voy al trabajo en bici.", exampleEnglish: "I go to work by bike.", gender: "m" },
  { spanish: "ciudad", english: "city", example: "Madrid es una ciudad grande.", exampleEnglish: "Madrid is a big city.", gender: "f" },
  { spanish: "día", english: "day", example: "Hoy es un buen día.", exampleEnglish: "Today is a good day.", gender: "m" },
  { spanish: "noche", english: "night", example: "Buenas noches.", exampleEnglish: "Good night.", gender: "f" },
  { spanish: "mujer", english: "woman", example: "Esa mujer es mi madre.", exampleEnglish: "That woman is my mother.", gender: "f" },
  { spanish: "hombre", english: "man", example: "El hombre lee el periódico.", exampleEnglish: "The man is reading the newspaper.", gender: "m" },
  { spanish: "niño", english: "child / boy", example: "El niño juega en el parque.", exampleEnglish: "The child plays in the park.", gender: "m" },
  { spanish: "hablar", english: "to speak", example: "Quiero hablar español.", exampleEnglish: "I want to speak Spanish." },
  { spanish: "comer", english: "to eat", example: "Vamos a comer pronto.", exampleEnglish: "We are going to eat soon." },
  { spanish: "vivir", english: "to live", example: "Vivo en Barcelona.", exampleEnglish: "I live in Barcelona." },
];

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL not set");
  const sql = postgres(url, { max: 1 });
  const db = drizzle(sql, { schema });

  const deckName = "Top 20 Spanish";
  const existing = await db.select().from(schema.decks).where(eq(schema.decks.name, deckName));
  let deckId: string;
  if (existing.length > 0) {
    deckId = existing[0]!.id;
    console.log(`✓ deck '${deckName}' exists (${deckId})`);
  } else {
    const [deck] = await db
      .insert(schema.decks)
      .values({ name: deckName, settings: { newPerDay: 20 } })
      .returning();
    deckId = deck!.id;
    console.log(`✓ created deck '${deckName}' (${deckId})`);
  }

  const existingNotes = await db.select().from(schema.notes);
  if (existingNotes.length >= VOCAB.length) {
    console.log(`✓ already have ${existingNotes.length} notes, skipping seed`);
    await sql.end();
    return;
  }

  for (const v of VOCAB) {
    const [note] = await db
      .insert(schema.notes)
      .values({
        noteType: "vocab",
        fields: { ...v },
        tags: ["seed", "top20"],
        source: "seed",
      })
      .returning();
    if (!note) continue;

    const empty = newCard();
    await db.insert(schema.cards).values({
      noteId: note.id,
      deckId,
      state: "new",
      due: empty.due,
      stability: empty.stability,
      difficulty: empty.difficulty,
      elapsedDays: empty.elapsed_days,
      scheduledDays: empty.scheduled_days,
      reps: empty.reps,
      lapses: empty.lapses,
      lastReview: empty.last_review ?? null,
    });
  }

  const counts = await db.select().from(schema.cards);
  console.log(`✓ seeded ${counts.length} cards`);
  await sql.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
