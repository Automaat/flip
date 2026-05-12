export type GenderEntry = {
  spanish: string;
  english: string;
  /** "m" = takes el, "f" = takes la. */
  gender: "m" | "f";
  /** Why this is tricky: rule that suggests opposite gender. */
  trickReason: string;
  example: string;
  exampleEnglish: string;
};

export type GenderRule = {
  id: string;
  pattern: string;
  gender: "m" | "f" | "varies";
  description: string;
  examples: string[];
};

export const GENDER_RULES: GenderRule[] = [
  {
    id: "ends-o",
    pattern: "-o",
    gender: "m",
    description: "Most nouns ending in -o are masculine.",
    examples: ["el libro", "el perro", "el dinero"],
  },
  {
    id: "ends-a",
    pattern: "-a",
    gender: "f",
    description: "Most nouns ending in -a are feminine.",
    examples: ["la casa", "la mesa", "la silla"],
  },
  {
    id: "ends-cion",
    pattern: "-ción / -sión",
    gender: "f",
    description: "All nouns ending in -ción or -sión are feminine.",
    examples: ["la nación", "la canción", "la decisión"],
  },
  {
    id: "ends-dad",
    pattern: "-dad / -tad",
    gender: "f",
    description: "Nouns ending in -dad or -tad are feminine.",
    examples: ["la ciudad", "la libertad", "la amistad"],
  },
  {
    id: "greek-ma",
    pattern: "Greek -ma",
    gender: "m",
    description:
      "Nouns of Greek origin ending in -ma are masculine despite ending in -a. Common exam trap.",
    examples: ["el problema", "el sistema", "el tema"],
  },
  {
    id: "ends-or",
    pattern: "-or",
    gender: "m",
    description: "Most nouns ending in -or are masculine (with exceptions like la flor).",
    examples: ["el color", "el amor", "el calor"],
  },
];

export const GENDER_EXCEPTIONS: GenderEntry[] = [
  {
    spanish: "problema",
    english: "problem",
    gender: "m",
    trickReason: "Ends in -a but is masculine (Greek origin).",
    example: "El problema es difícil.",
    exampleEnglish: "The problem is difficult.",
  },
  {
    spanish: "sistema",
    english: "system",
    gender: "m",
    trickReason: "Ends in -a but is masculine (Greek -ma).",
    example: "El sistema funciona bien.",
    exampleEnglish: "The system works well.",
  },
  {
    spanish: "tema",
    english: "topic / theme",
    gender: "m",
    trickReason: "Ends in -a but is masculine (Greek -ma).",
    example: "Cambiemos el tema.",
    exampleEnglish: "Let's change the topic.",
  },
  {
    spanish: "programa",
    english: "program",
    gender: "m",
    trickReason: "Greek -ma; masculine.",
    example: "El programa empieza a las ocho.",
    exampleEnglish: "The program starts at eight.",
  },
  {
    spanish: "idioma",
    english: "language",
    gender: "m",
    trickReason: "Greek -ma; masculine.",
    example: "Aprender un idioma toma tiempo.",
    exampleEnglish: "Learning a language takes time.",
  },
  {
    spanish: "clima",
    english: "climate",
    gender: "m",
    trickReason: "Greek -ma; masculine.",
    example: "El clima de Madrid es seco.",
    exampleEnglish: "Madrid's climate is dry.",
  },
  {
    spanish: "día",
    english: "day",
    gender: "m",
    trickReason: "Ends in -a but is masculine.",
    example: "Hoy es un buen día.",
    exampleEnglish: "Today is a good day.",
  },
  {
    spanish: "mapa",
    english: "map",
    gender: "m",
    trickReason: "Ends in -a but is masculine.",
    example: "El mapa está en la pared.",
    exampleEnglish: "The map is on the wall.",
  },
  {
    spanish: "sofá",
    english: "sofa",
    gender: "m",
    trickReason: "Ends in -á but is masculine.",
    example: "El sofá es muy cómodo.",
    exampleEnglish: "The sofa is very comfortable.",
  },
  {
    spanish: "planeta",
    english: "planet",
    gender: "m",
    trickReason: "Ends in -a but is masculine (Greek origin).",
    example: "Marte es el planeta rojo.",
    exampleEnglish: "Mars is the red planet.",
  },
  {
    spanish: "drama",
    english: "drama",
    gender: "m",
    trickReason: "Greek -ma; masculine.",
    example: "Me encanta el drama.",
    exampleEnglish: "I love drama.",
  },
  {
    spanish: "poema",
    english: "poem",
    gender: "m",
    trickReason: "Greek -ma; masculine.",
    example: "Escribí un poema para ella.",
    exampleEnglish: "I wrote a poem for her.",
  },
  {
    spanish: "mano",
    english: "hand",
    gender: "f",
    trickReason: "Ends in -o but is feminine (shortened from Latin manus).",
    example: "Levanta la mano derecha.",
    exampleEnglish: "Raise your right hand.",
  },
  {
    spanish: "foto",
    english: "photo",
    gender: "f",
    trickReason: "Short for fotografía (f). Feminine despite ending in -o.",
    example: "La foto está sobre la mesa.",
    exampleEnglish: "The photo is on the table.",
  },
  {
    spanish: "moto",
    english: "motorcycle",
    gender: "f",
    trickReason: "Short for motocicleta (f). Feminine despite ending in -o.",
    example: "Mi moto es rápida.",
    exampleEnglish: "My motorcycle is fast.",
  },
  {
    spanish: "radio",
    english: "radio",
    gender: "f",
    trickReason: "Feminine in most LATAM use (medium); the device el radio also exists.",
    example: "Pon la radio, por favor.",
    exampleEnglish: "Turn on the radio, please.",
  },
  {
    spanish: "flor",
    english: "flower",
    gender: "f",
    trickReason: "Ends in -or but is feminine (an exception to the -or rule).",
    example: "Te regalo esta flor.",
    exampleEnglish: "I'm giving you this flower.",
  },
  {
    spanish: "labor",
    english: "labor / work",
    gender: "f",
    trickReason: "Ends in -or but is feminine.",
    example: "La labor es importante.",
    exampleEnglish: "The work is important.",
  },
  {
    spanish: "noche",
    english: "night",
    gender: "f",
    trickReason: "Ends in -e (ambiguous) but is feminine.",
    example: "La noche está fría.",
    exampleEnglish: "The night is cold.",
  },
  {
    spanish: "sangre",
    english: "blood",
    gender: "f",
    trickReason: "Ends in -e; feminine.",
    example: "La sangre fluye.",
    exampleEnglish: "Blood flows.",
  },
  {
    spanish: "agua",
    english: "water",
    gender: "f",
    trickReason: "Feminine, but uses 'el' for sound reasons: el agua fría.",
    example: "El agua está fría.",
    exampleEnglish: "The water is cold.",
  },
  {
    spanish: "águila",
    english: "eagle",
    gender: "f",
    trickReason: "Feminine, but uses 'el' singular: el águila.",
    example: "El águila vuela alto.",
    exampleEnglish: "The eagle flies high.",
  },
  {
    spanish: "hambre",
    english: "hunger",
    gender: "f",
    trickReason: "Feminine, but uses 'el' singular: el hambre.",
    example: "Tengo mucha hambre.",
    exampleEnglish: "I'm very hungry.",
  },
];
