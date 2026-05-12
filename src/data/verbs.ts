export type Person = "yo" | "tú" | "él/ella" | "nosotros" | "ellos/ellas";
export type Tense = "present";

/** Latin-American 5-person paradigm (no vosotros). */
export const PERSONS: Person[] = ["yo", "tú", "él/ella", "nosotros", "ellos/ellas"];

export type VerbConjugation = {
  infinitive: string;
  english: string;
  tense: Tense;
  forms: Record<Person, string>;
  exampleByPerson: Partial<Record<Person, { es: string; en: string }>>;
};

export const IRREGULAR_VERBS_PRESENT: VerbConjugation[] = [
  {
    infinitive: "ser",
    english: "to be (essence)",
    tense: "present",
    forms: { yo: "soy", tú: "eres", "él/ella": "es", nosotros: "somos", "ellos/ellas": "son" },
    exampleByPerson: {
      yo: { es: "Yo soy de México.", en: "I am from Mexico." },
      tú: { es: "Tú eres mi amigo.", en: "You are my friend." },
      "él/ella": { es: "Ella es doctora.", en: "She is a doctor." },
      nosotros: { es: "Nosotros somos estudiantes.", en: "We are students." },
      "ellos/ellas": { es: "Ellos son hermanos.", en: "They are brothers." },
    },
  },
  {
    infinitive: "estar",
    english: "to be (state/location)",
    tense: "present",
    forms: { yo: "estoy", tú: "estás", "él/ella": "está", nosotros: "estamos", "ellos/ellas": "están" },
    exampleByPerson: {
      yo: { es: "Yo estoy cansado.", en: "I am tired." },
      tú: { es: "Tú estás en la oficina.", en: "You are at the office." },
      "él/ella": { es: "Él está enfermo.", en: "He is sick." },
      nosotros: { es: "Nosotros estamos felices.", en: "We are happy." },
      "ellos/ellas": { es: "Ellos están aquí.", en: "They are here." },
    },
  },
  {
    infinitive: "ir",
    english: "to go",
    tense: "present",
    forms: { yo: "voy", tú: "vas", "él/ella": "va", nosotros: "vamos", "ellos/ellas": "van" },
    exampleByPerson: {
      yo: { es: "Yo voy al mercado.", en: "I go to the market." },
      tú: { es: "Tú vas a la escuela.", en: "You go to school." },
      "él/ella": { es: "Ella va al trabajo.", en: "She goes to work." },
      nosotros: { es: "Nosotros vamos al cine.", en: "We go to the movies." },
      "ellos/ellas": { es: "Ellos van a casa.", en: "They go home." },
    },
  },
  {
    infinitive: "tener",
    english: "to have",
    tense: "present",
    forms: { yo: "tengo", tú: "tienes", "él/ella": "tiene", nosotros: "tenemos", "ellos/ellas": "tienen" },
    exampleByPerson: {
      yo: { es: "Yo tengo dos hermanos.", en: "I have two brothers." },
      tú: { es: "Tú tienes razón.", en: "You are right." },
      "él/ella": { es: "Él tiene un coche.", en: "He has a car." },
      nosotros: { es: "Nosotros tenemos hambre.", en: "We are hungry." },
      "ellos/ellas": { es: "Ellas tienen frío.", en: "They are cold." },
    },
  },
  {
    infinitive: "hacer",
    english: "to do / to make",
    tense: "present",
    forms: { yo: "hago", tú: "haces", "él/ella": "hace", nosotros: "hacemos", "ellos/ellas": "hacen" },
    exampleByPerson: {
      yo: { es: "Yo hago la tarea.", en: "I do the homework." },
      tú: { es: "Tú haces ejercicio.", en: "You exercise." },
      "él/ella": { es: "Ella hace café.", en: "She makes coffee." },
      nosotros: { es: "Nosotros hacemos planes.", en: "We make plans." },
      "ellos/ellas": { es: "Ellos hacen ruido.", en: "They make noise." },
    },
  },
  {
    infinitive: "poder",
    english: "to be able / can",
    tense: "present",
    forms: { yo: "puedo", tú: "puedes", "él/ella": "puede", nosotros: "podemos", "ellos/ellas": "pueden" },
    exampleByPerson: {
      yo: { es: "Yo puedo hablar inglés.", en: "I can speak English." },
      tú: { es: "Tú puedes ayudarme.", en: "You can help me." },
      "él/ella": { es: "Él puede correr rápido.", en: "He can run fast." },
      nosotros: { es: "Nosotros podemos hacerlo.", en: "We can do it." },
      "ellos/ellas": { es: "Ellas pueden venir.", en: "They can come." },
    },
  },
  {
    infinitive: "querer",
    english: "to want / love",
    tense: "present",
    forms: { yo: "quiero", tú: "quieres", "él/ella": "quiere", nosotros: "queremos", "ellos/ellas": "quieren" },
    exampleByPerson: {
      yo: { es: "Yo quiero agua.", en: "I want water." },
      tú: { es: "Tú quieres salir.", en: "You want to go out." },
      "él/ella": { es: "Ella quiere un café.", en: "She wants a coffee." },
      nosotros: { es: "Nosotros queremos viajar.", en: "We want to travel." },
      "ellos/ellas": { es: "Ellos quieren dormir.", en: "They want to sleep." },
    },
  },
  {
    infinitive: "saber",
    english: "to know (facts)",
    tense: "present",
    forms: { yo: "sé", tú: "sabes", "él/ella": "sabe", nosotros: "sabemos", "ellos/ellas": "saben" },
    exampleByPerson: {
      yo: { es: "Yo sé la respuesta.", en: "I know the answer." },
      tú: { es: "Tú sabes nadar.", en: "You know how to swim." },
      "él/ella": { es: "Ella sabe la verdad.", en: "She knows the truth." },
      nosotros: { es: "Nosotros sabemos el camino.", en: "We know the way." },
      "ellos/ellas": { es: "Ellos saben mucho.", en: "They know a lot." },
    },
  },
  {
    infinitive: "decir",
    english: "to say / tell",
    tense: "present",
    forms: { yo: "digo", tú: "dices", "él/ella": "dice", nosotros: "decimos", "ellos/ellas": "dicen" },
    exampleByPerson: {
      yo: { es: "Yo digo la verdad.", en: "I tell the truth." },
      tú: { es: "Tú dices mucho.", en: "You say a lot." },
      "él/ella": { es: "Él dice hola.", en: "He says hello." },
      nosotros: { es: "Nosotros decimos adiós.", en: "We say goodbye." },
      "ellos/ellas": { es: "Ellas dicen secretos.", en: "They tell secrets." },
    },
  },
  {
    infinitive: "venir",
    english: "to come",
    tense: "present",
    forms: { yo: "vengo", tú: "vienes", "él/ella": "viene", nosotros: "venimos", "ellos/ellas": "vienen" },
    exampleByPerson: {
      yo: { es: "Yo vengo de la escuela.", en: "I come from school." },
      tú: { es: "Tú vienes conmigo.", en: "You come with me." },
      "él/ella": { es: "Ella viene mañana.", en: "She is coming tomorrow." },
      nosotros: { es: "Nosotros venimos juntos.", en: "We come together." },
      "ellos/ellas": { es: "Ellos vienen a la fiesta.", en: "They are coming to the party." },
    },
  },
  {
    infinitive: "dar",
    english: "to give",
    tense: "present",
    forms: { yo: "doy", tú: "das", "él/ella": "da", nosotros: "damos", "ellos/ellas": "dan" },
    exampleByPerson: {
      yo: { es: "Yo doy un regalo.", en: "I give a gift." },
      tú: { es: "Tú das clases.", en: "You give classes." },
      "él/ella": { es: "Él da las gracias.", en: "He gives thanks." },
      nosotros: { es: "Nosotros damos un paseo.", en: "We take a walk." },
      "ellos/ellas": { es: "Ellas dan dinero.", en: "They give money." },
    },
  },
  {
    infinitive: "ver",
    english: "to see / watch",
    tense: "present",
    forms: { yo: "veo", tú: "ves", "él/ella": "ve", nosotros: "vemos", "ellos/ellas": "ven" },
    exampleByPerson: {
      yo: { es: "Yo veo una película.", en: "I am watching a movie." },
      tú: { es: "Tú ves bien.", en: "You see well." },
      "él/ella": { es: "Ella ve la luna.", en: "She sees the moon." },
      nosotros: { es: "Nosotros vemos televisión.", en: "We watch television." },
      "ellos/ellas": { es: "Ellos ven el partido.", en: "They watch the game." },
    },
  },
  {
    infinitive: "poner",
    english: "to put / place",
    tense: "present",
    forms: { yo: "pongo", tú: "pones", "él/ella": "pone", nosotros: "ponemos", "ellos/ellas": "ponen" },
    exampleByPerson: {
      yo: { es: "Yo pongo la mesa.", en: "I set the table." },
      tú: { es: "Tú pones música.", en: "You put on music." },
      "él/ella": { es: "Él pone los libros allí.", en: "He puts the books there." },
      nosotros: { es: "Nosotros ponemos atención.", en: "We pay attention." },
      "ellos/ellas": { es: "Ellos ponen excusas.", en: "They make excuses." },
    },
  },
  {
    infinitive: "salir",
    english: "to go out / leave",
    tense: "present",
    forms: { yo: "salgo", tú: "sales", "él/ella": "sale", nosotros: "salimos", "ellos/ellas": "salen" },
    exampleByPerson: {
      yo: { es: "Yo salgo temprano.", en: "I leave early." },
      tú: { es: "Tú sales con amigos.", en: "You go out with friends." },
      "él/ella": { es: "Ella sale del trabajo.", en: "She leaves work." },
      nosotros: { es: "Nosotros salimos hoy.", en: "We are leaving today." },
      "ellos/ellas": { es: "Ellos salen a correr.", en: "They go out for a run." },
    },
  },
];

export type ClozeCard = {
  infinitive: string;
  english: string;
  person: Person;
  tense: Tense;
  /** Sentence with ___ for the blank. */
  sentence: string;
  /** Expected answer (the conjugated verb). */
  answer: string;
  sentenceEnglish: string;
};

/** Generate one cloze per (verb, person). */
export function buildClozeCards(verbs: VerbConjugation[] = IRREGULAR_VERBS_PRESENT): ClozeCard[] {
  const out: ClozeCard[] = [];
  for (const v of verbs) {
    for (const p of PERSONS) {
      const answer = v.forms[p];
      const example = v.exampleByPerson[p];
      if (!example) continue;
      // Unicode-aware word boundary (handles accents like 'está' that \b misses).
      const re = new RegExp(`(?<![\\p{L}\\p{N}])${answer}(?![\\p{L}\\p{N}])`, "iu");
      const sentence = example.es.replace(re, "___");
      out.push({
        infinitive: v.infinitive,
        english: v.english,
        person: p,
        tense: v.tense,
        sentence,
        answer,
        sentenceEnglish: example.en,
      });
    }
  }
  return out;
}
