export type MinimalPair = {
  contrast: string;
  a: { spanish: string; english: string };
  b: { spanish: string; english: string };
};

/** Top discrimination drills for English speakers learning Spanish. */
export const MINIMAL_PAIRS: MinimalPair[] = [
  { contrast: "r vs rr", a: { spanish: "pero", english: "but" }, b: { spanish: "perro", english: "dog" } },
  { contrast: "r vs rr", a: { spanish: "caro", english: "expensive" }, b: { spanish: "carro", english: "car" } },
  { contrast: "r vs rr", a: { spanish: "para", english: "for" }, b: { spanish: "parra", english: "vine" } },
  { contrast: "r vs rr", a: { spanish: "coro", english: "choir" }, b: { spanish: "corro", english: "I run" } },
  { contrast: "ñ vs n", a: { spanish: "ano", english: "anus" }, b: { spanish: "año", english: "year" } },
  { contrast: "ñ vs n", a: { spanish: "campana", english: "bell" }, b: { spanish: "campaña", english: "campaign" } },
  { contrast: "ñ vs n", a: { spanish: "sueno", english: "I sound" }, b: { spanish: "sueño", english: "dream / sleep" } },
  { contrast: "e vs i", a: { spanish: "peso", english: "weight" }, b: { spanish: "piso", english: "floor" } },
  { contrast: "e vs i", a: { spanish: "ven", english: "come!" }, b: { spanish: "vin", english: "(non-word)" } },
  { contrast: "b vs v (subtle)", a: { spanish: "vino", english: "wine" }, b: { spanish: "bino", english: "(non-word)" } },
  { contrast: "c (s/k)", a: { spanish: "cocer", english: "to cook" }, b: { spanish: "coser", english: "to sew" } },
  { contrast: "ll vs l", a: { spanish: "polo", english: "pole" }, b: { spanish: "pollo", english: "chicken" } },
  { contrast: "ll vs y (yeísmo)", a: { spanish: "calló", english: "(s)he hushed" }, b: { spanish: "cayó", english: "(s)he fell" } },
  { contrast: "g vs j", a: { spanish: "ajo", english: "garlic" }, b: { spanish: "ago", english: "(non-word; cf. hago)" } },
];
