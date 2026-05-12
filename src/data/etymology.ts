export type Root = {
  id: string;
  root: string;
  origin: "Latin" | "Greek";
  meaning: string;
  spanish: { word: string; gloss: string }[];
  english: string[];
};

export const ROOTS: Root[] = [
  {
    id: "aqua",
    root: "aqua",
    origin: "Latin",
    meaning: "water",
    spanish: [
      { word: "agua", gloss: "water" },
      { word: "acuario", gloss: "aquarium" },
      { word: "acuático", gloss: "aquatic" },
    ],
    english: ["aqua", "aquarium", "aquatic", "aqueduct", "aquifer"],
  },
  {
    id: "vita",
    root: "vita",
    origin: "Latin",
    meaning: "life",
    spanish: [
      { word: "vida", gloss: "life" },
      { word: "vital", gloss: "vital" },
      { word: "vitalidad", gloss: "vitality" },
    ],
    english: ["vital", "vitality", "vitamin", "revitalize"],
  },
  {
    id: "manus",
    root: "manus",
    origin: "Latin",
    meaning: "hand",
    spanish: [
      { word: "mano", gloss: "hand (f)" },
      { word: "manual", gloss: "manual" },
      { word: "manipular", gloss: "to manipulate" },
    ],
    english: ["manual", "manuscript", "manipulate", "manage"],
  },
  {
    id: "terra",
    root: "terra",
    origin: "Latin",
    meaning: "earth / land",
    spanish: [
      { word: "tierra", gloss: "earth / land" },
      { word: "territorio", gloss: "territory" },
      { word: "subterráneo", gloss: "underground" },
    ],
    english: ["terrain", "territory", "terrestrial", "subterranean"],
  },
  {
    id: "lux",
    root: "lux / luc",
    origin: "Latin",
    meaning: "light",
    spanish: [
      { word: "luz", gloss: "light" },
      { word: "lucir", gloss: "to shine" },
      { word: "lúcido", gloss: "lucid" },
    ],
    english: ["lucid", "lucent", "translucent", "elucidate"],
  },
  {
    id: "tempus",
    root: "tempus / temp",
    origin: "Latin",
    meaning: "time",
    spanish: [
      { word: "tiempo", gloss: "time / weather" },
      { word: "temporal", gloss: "temporary" },
      { word: "contemporáneo", gloss: "contemporary" },
    ],
    english: ["temporal", "temporary", "contemporary", "tempo"],
  },
  {
    id: "verbum",
    root: "verbum / verb",
    origin: "Latin",
    meaning: "word",
    spanish: [
      { word: "verbo", gloss: "verb" },
      { word: "verbal", gloss: "verbal" },
      { word: "proverbio", gloss: "proverb" },
    ],
    english: ["verb", "verbal", "verbatim", "proverb"],
  },
  {
    id: "audire",
    root: "audire",
    origin: "Latin",
    meaning: "to hear",
    spanish: [
      { word: "oír", gloss: "to hear" },
      { word: "audio", gloss: "audio" },
      { word: "audiencia", gloss: "audience" },
    ],
    english: ["audio", "audience", "audible", "auditorium"],
  },
  {
    id: "videre",
    root: "videre / vis",
    origin: "Latin",
    meaning: "to see",
    spanish: [
      { word: "ver", gloss: "to see" },
      { word: "visión", gloss: "vision" },
      { word: "visible", gloss: "visible" },
    ],
    english: ["vision", "visible", "visual", "video", "envision"],
  },
  {
    id: "scribere",
    root: "scribere / script",
    origin: "Latin",
    meaning: "to write",
    spanish: [
      { word: "escribir", gloss: "to write" },
      { word: "escritor", gloss: "writer" },
      { word: "manuscrito", gloss: "manuscript" },
    ],
    english: ["scribe", "script", "manuscript", "describe", "subscribe"],
  },
  {
    id: "ferre",
    root: "ferre / fer",
    origin: "Latin",
    meaning: "to carry / bear",
    spanish: [
      { word: "ofrecer", gloss: "to offer" },
      { word: "transferir", gloss: "to transfer" },
      { word: "preferir", gloss: "to prefer" },
    ],
    english: ["transfer", "prefer", "refer", "infer", "confer"],
  },
  {
    id: "currere",
    root: "currere / curr",
    origin: "Latin",
    meaning: "to run",
    spanish: [
      { word: "correr", gloss: "to run" },
      { word: "corriente", gloss: "current / stream" },
      { word: "curso", gloss: "course" },
    ],
    english: ["current", "course", "occur", "concur", "recur"],
  },
  {
    id: "ducere",
    root: "ducere / duc",
    origin: "Latin",
    meaning: "to lead",
    spanish: [
      { word: "conducir", gloss: "to drive / lead" },
      { word: "introducir", gloss: "to introduce / insert" },
      { word: "producir", gloss: "to produce" },
    ],
    english: ["produce", "induce", "introduce", "reduce", "conduct"],
  },
  {
    id: "magnus",
    root: "magnus",
    origin: "Latin",
    meaning: "great / large",
    spanish: [
      { word: "magnífico", gloss: "magnificent" },
      { word: "magnitud", gloss: "magnitude" },
      { word: "magnate", gloss: "magnate" },
    ],
    english: ["magnify", "magnificent", "magnitude", "magnate"],
  },
  {
    id: "cor",
    root: "cor / cord",
    origin: "Latin",
    meaning: "heart",
    spanish: [
      { word: "corazón", gloss: "heart" },
      { word: "cordial", gloss: "cordial" },
      { word: "acuerdo", gloss: "agreement" },
    ],
    english: ["cordial", "core", "concord", "discord", "courage"],
  },
  {
    id: "bio",
    root: "bios",
    origin: "Greek",
    meaning: "life",
    spanish: [
      { word: "biología", gloss: "biology" },
      { word: "biografía", gloss: "biography" },
      { word: "antibiótico", gloss: "antibiotic" },
    ],
    english: ["biology", "biography", "antibiotic", "symbiosis"],
  },
  {
    id: "graph",
    root: "graphein",
    origin: "Greek",
    meaning: "to write",
    spanish: [
      { word: "gráfico", gloss: "graphic" },
      { word: "fotografía", gloss: "photograph" },
      { word: "geografía", gloss: "geography" },
    ],
    english: ["graph", "graphic", "photograph", "geography", "autograph"],
  },
  {
    id: "phon",
    root: "phone",
    origin: "Greek",
    meaning: "sound",
    spanish: [
      { word: "teléfono", gloss: "telephone" },
      { word: "fonética", gloss: "phonetics" },
      { word: "sinfonía", gloss: "symphony" },
    ],
    english: ["telephone", "phonetic", "symphony", "megaphone"],
  },
  {
    id: "tele",
    root: "tele",
    origin: "Greek",
    meaning: "far / distant",
    spanish: [
      { word: "televisión", gloss: "television" },
      { word: "telegrama", gloss: "telegram" },
      { word: "telescopio", gloss: "telescope" },
    ],
    english: ["telephone", "television", "telegraph", "telescope"],
  },
  {
    id: "psych",
    root: "psyche",
    origin: "Greek",
    meaning: "mind / soul",
    spanish: [
      { word: "psicología", gloss: "psychology" },
      { word: "psicólogo", gloss: "psychologist" },
      { word: "psíquico", gloss: "psychic" },
    ],
    english: ["psychology", "psychic", "psyche", "psychiatry"],
  },
];

export function findRoot(id: string): Root | undefined {
  return ROOTS.find((r) => r.id === id);
}
