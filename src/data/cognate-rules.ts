export type CognateRule = {
  id: string;
  enSuffix: string;
  esSuffix: string;
  description: string;
  examples: { en: string; es: string }[];
  quiz: { en: string; es: string }[];
  notes?: string;
};

export const COGNATE_RULES: CognateRule[] = [
  {
    id: "tion-cion",
    enSuffix: "-tion",
    esSuffix: "-ción",
    description: "English -tion → Spanish -ción. Always feminine.",
    examples: [
      { en: "nation", es: "nación" },
      { en: "information", es: "información" },
      { en: "education", es: "educación" },
    ],
    quiz: [
      { en: "action", es: "acción" },
      { en: "attention", es: "atención" },
      { en: "function", es: "función" },
      { en: "celebration", es: "celebración" },
    ],
    notes: "Accent on the last syllable: -ción.",
  },
  {
    id: "ly-mente",
    enSuffix: "-ly",
    esSuffix: "-mente",
    description: "English -ly adverbs → Spanish -mente.",
    examples: [
      { en: "absolutely", es: "absolutamente" },
      { en: "exactly", es: "exactamente" },
      { en: "rapidly", es: "rápidamente" },
    ],
    quiz: [
      { en: "naturally", es: "naturalmente" },
      { en: "perfectly", es: "perfectamente" },
      { en: "totally", es: "totalmente" },
      { en: "publicly", es: "públicamente" },
    ],
  },
  {
    id: "ous-oso",
    enSuffix: "-ous",
    esSuffix: "-oso",
    description: "English -ous adjectives → Spanish -oso (m) / -osa (f).",
    examples: [
      { en: "famous", es: "famoso" },
      { en: "curious", es: "curioso" },
      { en: "delicious", es: "delicioso" },
    ],
    quiz: [
      { en: "religious", es: "religioso" },
      { en: "generous", es: "generoso" },
      { en: "mysterious", es: "misterioso" },
      { en: "nervous", es: "nervioso" },
    ],
  },
  {
    id: "ty-dad",
    enSuffix: "-ty",
    esSuffix: "-dad",
    description: "English -ty → Spanish -dad. Always feminine.",
    examples: [
      { en: "activity", es: "actividad" },
      { en: "community", es: "comunidad" },
      { en: "university", es: "universidad" },
    ],
    quiz: [
      { en: "reality", es: "realidad" },
      { en: "society", es: "sociedad" },
      { en: "possibility", es: "posibilidad" },
      { en: "identity", es: "identidad" },
    ],
  },
  {
    id: "ment-mento",
    enSuffix: "-ment",
    esSuffix: "-mento",
    description: "English -ment → Spanish -mento. Usually masculine.",
    examples: [
      { en: "argument", es: "argumento" },
      { en: "document", es: "documento" },
      { en: "moment", es: "momento" },
    ],
    quiz: [
      { en: "instrument", es: "instrumento" },
      { en: "monument", es: "monumento" },
      { en: "experiment", es: "experimento" },
      { en: "department", es: "departamento" },
    ],
  },
  {
    id: "ive-ivo",
    enSuffix: "-ive",
    esSuffix: "-ivo",
    description: "English -ive → Spanish -ivo (m) / -iva (f).",
    examples: [
      { en: "active", es: "activo" },
      { en: "creative", es: "creativo" },
      { en: "positive", es: "positivo" },
    ],
    quiz: [
      { en: "negative", es: "negativo" },
      { en: "effective", es: "efectivo" },
      { en: "alternative", es: "alternativo" },
      { en: "intuitive", es: "intuitivo" },
    ],
  },
  {
    id: "ble-ble",
    enSuffix: "-ble",
    esSuffix: "-ble",
    description: "English -ble = Spanish -ble. Pronunciation differs.",
    examples: [
      { en: "adorable", es: "adorable" },
      { en: "possible", es: "posible" },
      { en: "horrible", es: "horrible" },
    ],
    quiz: [
      { en: "responsible", es: "responsable" },
      { en: "terrible", es: "terrible" },
      { en: "incredible", es: "increíble" },
      { en: "comfortable", es: "confortable" },
    ],
  },
  {
    id: "ism-ismo",
    enSuffix: "-ism",
    esSuffix: "-ismo",
    description: "English -ism → Spanish -ismo. Masculine.",
    examples: [
      { en: "tourism", es: "turismo" },
      { en: "optimism", es: "optimismo" },
      { en: "capitalism", es: "capitalismo" },
    ],
    quiz: [
      { en: "realism", es: "realismo" },
      { en: "feminism", es: "feminismo" },
      { en: "Buddhism", es: "budismo" },
      { en: "racism", es: "racismo" },
    ],
  },
  {
    id: "ist-ista",
    enSuffix: "-ist",
    esSuffix: "-ista",
    description: "English -ist → Spanish -ista. Same for m/f, only article changes.",
    examples: [
      { en: "artist", es: "artista" },
      { en: "tourist", es: "turista" },
      { en: "pianist", es: "pianista" },
    ],
    quiz: [
      { en: "specialist", es: "especialista" },
      { en: "journalist", es: "periodista" },
      { en: "dentist", es: "dentista" },
      { en: "optimist", es: "optimista" },
    ],
  },
  {
    id: "nce-ncia",
    enSuffix: "-nce",
    esSuffix: "-ncia",
    description: "English -nce → Spanish -ncia. Feminine.",
    examples: [
      { en: "experience", es: "experiencia" },
      { en: "distance", es: "distancia" },
      { en: "importance", es: "importancia" },
    ],
    quiz: [
      { en: "patience", es: "paciencia" },
      { en: "presence", es: "presencia" },
      { en: "evidence", es: "evidencia" },
      { en: "violence", es: "violencia" },
    ],
  },
  {
    id: "nt-nte",
    enSuffix: "-nt",
    esSuffix: "-nte",
    description: "English -nt adjectives/nouns → Spanish -nte.",
    examples: [
      { en: "important", es: "importante" },
      { en: "different", es: "diferente" },
      { en: "elegant", es: "elegante" },
    ],
    quiz: [
      { en: "constant", es: "constante" },
      { en: "intelligent", es: "inteligente" },
      { en: "patient", es: "paciente" },
      { en: "permanent", es: "permanente" },
    ],
  },
  {
    id: "ic-ico",
    enSuffix: "-ic",
    esSuffix: "-ico",
    description: "English -ic → Spanish -ico (m) / -ica (f).",
    examples: [
      { en: "magic", es: "mágico" },
      { en: "public", es: "público" },
      { en: "academic", es: "académico" },
    ],
    quiz: [
      { en: "classic", es: "clásico" },
      { en: "specific", es: "específico" },
      { en: "tragic", es: "trágico" },
      { en: "automatic", es: "automático" },
    ],
  },
  {
    id: "ence-encia",
    enSuffix: "-ence",
    esSuffix: "-encia",
    description: "English -ence → Spanish -encia. Feminine.",
    examples: [
      { en: "presence", es: "presencia" },
      { en: "difference", es: "diferencia" },
      { en: "experience", es: "experiencia" },
    ],
    quiz: [
      { en: "confidence", es: "confidencia" },
      { en: "essence", es: "esencia" },
      { en: "preference", es: "preferencia" },
      { en: "intelligence", es: "inteligencia" },
    ],
  },
  {
    id: "or-or",
    enSuffix: "-or",
    esSuffix: "-or",
    description: "English -or stays -or in Spanish (masculine).",
    examples: [
      { en: "actor", es: "actor" },
      { en: "doctor", es: "doctor" },
      { en: "director", es: "director" },
    ],
    quiz: [
      { en: "professor", es: "profesor" },
      { en: "inventor", es: "inventor" },
      { en: "interior", es: "interior" },
      { en: "favor", es: "favor" },
    ],
  },
  {
    id: "ct-cto",
    enSuffix: "-ct",
    esSuffix: "-cto",
    description: "English -ct → Spanish -cto. Usually masculine.",
    examples: [
      { en: "act", es: "acto" },
      { en: "contact", es: "contacto" },
      { en: "perfect", es: "perfecto" },
    ],
    quiz: [
      { en: "product", es: "producto" },
      { en: "direct", es: "directo" },
      { en: "effect", es: "efecto" },
      { en: "aspect", es: "aspecto" },
    ],
  },
  {
    id: "ary-ario",
    enSuffix: "-ary",
    esSuffix: "-ario",
    description: "English -ary → Spanish -ario (m) / -aria (f).",
    examples: [
      { en: "necessary", es: "necesario" },
      { en: "ordinary", es: "ordinario" },
      { en: "secondary", es: "secundario" },
    ],
    quiz: [
      { en: "literary", es: "literario" },
      { en: "vocabulary", es: "vocabulario" },
      { en: "salary", es: "salario" },
      { en: "anniversary", es: "aniversario" },
    ],
  },
  {
    id: "ate-ar",
    enSuffix: "-ate",
    esSuffix: "-ar",
    description: "English -ate verbs → Spanish -ar.",
    examples: [
      { en: "celebrate", es: "celebrar" },
      { en: "create", es: "crear" },
      { en: "calculate", es: "calcular" },
    ],
    quiz: [
      { en: "participate", es: "participar" },
      { en: "investigate", es: "investigar" },
      { en: "communicate", es: "comunicar" },
      { en: "educate", es: "educar" },
    ],
  },
  {
    id: "y-ia",
    enSuffix: "-y",
    esSuffix: "-ia",
    description:
      "English -y nouns → Spanish -ia (academy → academia). Distinct from -y→-io for objects.",
    examples: [
      { en: "academy", es: "academia" },
      { en: "history", es: "historia" },
      { en: "memory", es: "memoria" },
    ],
    quiz: [
      { en: "family", es: "familia" },
      { en: "victory", es: "victoria" },
      { en: "industry", es: "industria" },
      { en: "biology", es: "biología" },
    ],
  },
  {
    id: "ify-ificar",
    enSuffix: "-ify",
    esSuffix: "-ificar",
    description: "English -ify verbs → Spanish -ificar.",
    examples: [
      { en: "clarify", es: "clarificar" },
      { en: "identify", es: "identificar" },
      { en: "verify", es: "verificar" },
    ],
    quiz: [
      { en: "simplify", es: "simplificar" },
      { en: "specify", es: "especificar" },
      { en: "modify", es: "modificar" },
      { en: "classify", es: "clasificar" },
    ],
  },
  {
    id: "al-al",
    enSuffix: "-al",
    esSuffix: "-al",
    description: "English -al stays -al in Spanish.",
    examples: [
      { en: "animal", es: "animal" },
      { en: "natural", es: "natural" },
      { en: "general", es: "general" },
    ],
    quiz: [
      { en: "central", es: "central" },
      { en: "essential", es: "esencial" },
      { en: "national", es: "nacional" },
      { en: "personal", es: "personal" },
    ],
  },
  {
    id: "id-ido",
    enSuffix: "-id",
    esSuffix: "-ido",
    description: "English -id → Spanish -ido (m) / -ida (f).",
    examples: [
      { en: "rapid", es: "rápido" },
      { en: "solid", es: "sólido" },
      { en: "valid", es: "válido" },
    ],
    quiz: [
      { en: "liquid", es: "líquido" },
      { en: "timid", es: "tímido" },
      { en: "stupid", es: "estúpido" },
      { en: "candid", es: "cándido" },
    ],
  },
  {
    id: "ile-il",
    enSuffix: "-ile",
    esSuffix: "-il",
    description: "English -ile → Spanish -il.",
    examples: [
      { en: "agile", es: "ágil" },
      { en: "mobile", es: "móvil" },
      { en: "fragile", es: "frágil" },
    ],
    quiz: [
      { en: "hostile", es: "hostil" },
      { en: "textile", es: "textil" },
      { en: "automobile", es: "automóvil" },
      { en: "versatile", es: "versátil" },
    ],
  },
  {
    id: "ar-ar",
    enSuffix: "-ar",
    esSuffix: "-ar",
    description: "English -ar stays -ar in Spanish (dollar → dólar).",
    examples: [
      { en: "dollar", es: "dólar" },
      { en: "popular", es: "popular" },
      { en: "lunar", es: "lunar" },
    ],
    quiz: [
      { en: "particular", es: "particular" },
      { en: "regular", es: "regular" },
      { en: "similar", es: "similar" },
      { en: "vulgar", es: "vulgar" },
    ],
  },
  {
    id: "y-io",
    enSuffix: "-y",
    esSuffix: "-io",
    description:
      "English -y objects → Spanish -io (accessory → accesorio). Distinct from -y→-ia for abstract nouns.",
    examples: [
      { en: "accessory", es: "accesorio" },
      { en: "ordinary", es: "ordinario" },
      { en: "salary", es: "salario" },
    ],
    quiz: [
      { en: "vocabulary", es: "vocabulario" },
      { en: "diary", es: "diario" },
      { en: "secretary", es: "secretario" },
      { en: "necessary", es: "necesario" },
    ],
  },
];

export function findRule(id: string): CognateRule | undefined {
  return COGNATE_RULES.find((r) => r.id === id);
}
