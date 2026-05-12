export type FalseFriend = {
  spanish: string;
  /** What an English speaker mistakenly assumes it means. */
  englishTrap: string;
  /** What it actually means in Spanish. */
  englishReal: string;
  /** Disambiguating example sentence. */
  example: string;
  exampleEnglish: string;
};

export const FALSE_FRIENDS: FalseFriend[] = [
  {
    spanish: "embarazada",
    englishTrap: "embarrassed",
    englishReal: "pregnant",
    example: "Mi hermana está embarazada de cinco meses.",
    exampleEnglish: "My sister is five months pregnant.",
  },
  {
    spanish: "éxito",
    englishTrap: "exit",
    englishReal: "success",
    example: "El concierto fue un gran éxito.",
    exampleEnglish: "The concert was a great success.",
  },
  {
    spanish: "constipado",
    englishTrap: "constipated",
    englishReal: "having a cold",
    example: "Estoy constipado, no puedo respirar bien.",
    exampleEnglish: "I have a cold, I can't breathe well.",
  },
  {
    spanish: "actual",
    englishTrap: "actual / real",
    englishReal: "current",
    example: "El presidente actual visitó la ciudad.",
    exampleEnglish: "The current president visited the city.",
  },
  {
    spanish: "sensible",
    englishTrap: "sensible / reasonable",
    englishReal: "sensitive",
    example: "Es muy sensible a las críticas.",
    exampleEnglish: "He's very sensitive to criticism.",
  },
  {
    spanish: "librería",
    englishTrap: "library",
    englishReal: "bookstore",
    example: "Compré el libro en la librería del centro.",
    exampleEnglish: "I bought the book at the downtown bookstore.",
  },
  {
    spanish: "carpeta",
    englishTrap: "carpet",
    englishReal: "folder",
    example: "Pon los documentos en esta carpeta.",
    exampleEnglish: "Put the documents in this folder.",
  },
  {
    spanish: "ropa",
    englishTrap: "rope",
    englishReal: "clothes",
    example: "Necesito lavar la ropa.",
    exampleEnglish: "I need to wash the clothes.",
  },
  {
    spanish: "sopa",
    englishTrap: "soap",
    englishReal: "soup",
    example: "La sopa está muy caliente.",
    exampleEnglish: "The soup is very hot.",
  },
  {
    spanish: "pie",
    englishTrap: "pie (dessert)",
    englishReal: "foot",
    example: "Me duele el pie izquierdo.",
    exampleEnglish: "My left foot hurts.",
  },
  {
    spanish: "fábrica",
    englishTrap: "fabric",
    englishReal: "factory",
    example: "Trabaja en una fábrica de coches.",
    exampleEnglish: "He works in a car factory.",
  },
  {
    spanish: "asistir",
    englishTrap: "to assist / help",
    englishReal: "to attend",
    example: "Voy a asistir a la reunión mañana.",
    exampleEnglish: "I'm going to attend the meeting tomorrow.",
  },
  {
    spanish: "atender",
    englishTrap: "to attend",
    englishReal: "to assist / take care of",
    example: "El médico atiende a los pacientes.",
    exampleEnglish: "The doctor attends to the patients.",
  },
  {
    spanish: "molestar",
    englishTrap: "to molest",
    englishReal: "to bother / annoy",
    example: "No me molestes mientras trabajo.",
    exampleEnglish: "Don't bother me while I'm working.",
  },
  {
    spanish: "introducir",
    englishTrap: "to introduce (a person)",
    englishReal: "to insert / put in",
    example: "Introduce la tarjeta en el cajero.",
    exampleEnglish: "Insert the card into the ATM.",
  },
  {
    spanish: "realizar",
    englishTrap: "to realize / understand",
    englishReal: "to carry out / perform",
    example: "Vamos a realizar el proyecto este año.",
    exampleEnglish: "We're going to carry out the project this year.",
  },
  {
    spanish: "recordar",
    englishTrap: "to record",
    englishReal: "to remember",
    example: "No recuerdo dónde dejé las llaves.",
    exampleEnglish: "I don't remember where I left the keys.",
  },
  {
    spanish: "soportar",
    englishTrap: "to support",
    englishReal: "to tolerate / put up with",
    example: "No soporto este calor.",
    exampleEnglish: "I can't stand this heat.",
  },
  {
    spanish: "envolver",
    englishTrap: "to involve",
    englishReal: "to wrap (a package)",
    example: "¿Me puede envolver el regalo?",
    exampleEnglish: "Can you wrap the gift for me?",
  },
  {
    spanish: "discutir",
    englishTrap: "to discuss (calmly)",
    englishReal: "to argue / fight",
    example: "Mis padres siempre discuten sobre dinero.",
    exampleEnglish: "My parents always argue about money.",
  },
  {
    spanish: "embarazo",
    englishTrap: "embarrassment",
    englishReal: "pregnancy",
    example: "Tuvo un embarazo difícil.",
    exampleEnglish: "She had a difficult pregnancy.",
  },
  {
    spanish: "largo",
    englishTrap: "large",
    englishReal: "long",
    example: "Es un viaje muy largo.",
    exampleEnglish: "It's a very long trip.",
  },
  {
    spanish: "pretender",
    englishTrap: "to pretend",
    englishReal: "to intend / try to",
    example: "Pretendo aprender español este año.",
    exampleEnglish: "I intend to learn Spanish this year.",
  },
  {
    spanish: "éxito",
    englishTrap: "exit (door)",
    englishReal: "success",
    example: "Su empresa tuvo mucho éxito.",
    exampleEnglish: "Their company had great success.",
  },
  {
    spanish: "salida",
    englishTrap: "salad",
    englishReal: "exit / departure",
    example: "La salida está a la derecha.",
    exampleEnglish: "The exit is to the right.",
  },
  {
    spanish: "tuna",
    englishTrap: "tuna fish",
    englishReal: "prickly pear / student music group",
    example: "La tuna es deliciosa con limón.",
    exampleEnglish: "Prickly pear is delicious with lemon.",
  },
  {
    spanish: "vaso",
    englishTrap: "vase",
    englishReal: "drinking glass",
    example: "¿Me das un vaso de agua?",
    exampleEnglish: "Can you give me a glass of water?",
  },
  {
    spanish: "campo",
    englishTrap: "camp",
    englishReal: "countryside / field",
    example: "Vivimos en el campo, no en la ciudad.",
    exampleEnglish: "We live in the countryside, not in the city.",
  },
  {
    spanish: "ganga",
    englishTrap: "gang",
    englishReal: "bargain / great deal",
    example: "¡Qué ganga! Solo costó diez euros.",
    exampleEnglish: "What a bargain! It only cost ten euros.",
  },
  {
    spanish: "lectura",
    englishTrap: "lecture",
    englishReal: "reading",
    example: "La lectura es mi pasatiempo favorito.",
    exampleEnglish: "Reading is my favorite hobby.",
  },
  {
    spanish: "conferencia",
    englishTrap: "conference",
    englishReal: "lecture (academic talk)",
    example: "Asistí a una conferencia sobre historia.",
    exampleEnglish: "I attended a lecture about history.",
  },
  {
    spanish: "noticia",
    englishTrap: "notice",
    englishReal: "news (item)",
    example: "Tengo una buena noticia para ti.",
    exampleEnglish: "I have good news for you.",
  },
  {
    spanish: "groseria",
    englishTrap: "grocery",
    englishReal: "rude remark / vulgarity",
    example: "No me gusta cuando dice groserías.",
    exampleEnglish: "I don't like when he says rude things.",
  },
  {
    spanish: "parientes",
    englishTrap: "parents",
    englishReal: "relatives",
    example: "Mis parientes viven en México.",
    exampleEnglish: "My relatives live in Mexico.",
  },
  {
    spanish: "compromiso",
    englishTrap: "compromise",
    englishReal: "commitment / engagement",
    example: "Tengo un compromiso esta noche.",
    exampleEnglish: "I have a commitment tonight.",
  },
  {
    spanish: "fútbol",
    englishTrap: "football (American)",
    englishReal: "soccer",
    example: "El fútbol es el deporte más popular.",
    exampleEnglish: "Soccer is the most popular sport.",
  },
  {
    spanish: "gimnasio",
    englishTrap: "gymnasium (school)",
    englishReal: "gym (workout)",
    example: "Voy al gimnasio tres veces por semana.",
    exampleEnglish: "I go to the gym three times a week.",
  },
  {
    spanish: "colegio",
    englishTrap: "college",
    englishReal: "school (K-12)",
    example: "Mis hijos van al colegio en el barrio.",
    exampleEnglish: "My children go to school in the neighborhood.",
  },
  {
    spanish: "facultad",
    englishTrap: "faculty (staff)",
    englishReal: "university department / college",
    example: "Estudia en la facultad de medicina.",
    exampleEnglish: "She studies at the medical school.",
  },
  {
    spanish: "diversión",
    englishTrap: "diversion",
    englishReal: "fun / entertainment",
    example: "Los niños buscan diversión.",
    exampleEnglish: "The kids are looking for fun.",
  },
  {
    spanish: "lujuria",
    englishTrap: "luxury",
    englishReal: "lust",
    example: "La lujuria es uno de los pecados capitales.",
    exampleEnglish: "Lust is one of the capital sins.",
  },
  {
    spanish: "preservativo",
    englishTrap: "preservative",
    englishReal: "condom",
    example: "Es importante usar preservativo.",
    exampleEnglish: "It's important to use a condom.",
  },
  {
    spanish: "ignorar",
    englishTrap: "to ignore (deliberately)",
    englishReal: "to be unaware of",
    example: "Ignoro su número de teléfono.",
    exampleEnglish: "I don't know his phone number.",
  },
  {
    spanish: "delito",
    englishTrap: "delight",
    englishReal: "crime / offense",
    example: "Cometió un delito grave.",
    exampleEnglish: "He committed a serious crime.",
  },
  {
    spanish: "éxito",
    englishTrap: "exit",
    englishReal: "success / hit",
    example: "Su canción fue un éxito.",
    exampleEnglish: "His song was a hit.",
  },
  {
    spanish: "ropa",
    englishTrap: "rope",
    englishReal: "clothes / clothing",
    example: "Necesito ropa nueva para el invierno.",
    exampleEnglish: "I need new clothes for winter.",
  },
  {
    spanish: "asignatura",
    englishTrap: "assignment",
    englishReal: "school subject / course",
    example: "Mi asignatura favorita es matemáticas.",
    exampleEnglish: "My favorite subject is math.",
  },
  {
    spanish: "carrera",
    englishTrap: "career",
    englishReal: "race / university degree",
    example: "Estudia la carrera de derecho.",
    exampleEnglish: "She is pursuing a law degree.",
  },
  {
    spanish: "destituir",
    englishTrap: "to destitute",
    englishReal: "to dismiss / remove from office",
    example: "El gobierno destituyó al ministro.",
    exampleEnglish: "The government dismissed the minister.",
  },
  {
    spanish: "éxito",
    englishTrap: "exit (way out)",
    englishReal: "success / hit",
    example: "La película fue un éxito mundial.",
    exampleEnglish: "The movie was a worldwide hit.",
  },
];

/** Deduplicated by Spanish lemma; preserves first occurrence. */
export const UNIQUE_FALSE_FRIENDS: FalseFriend[] = (() => {
  const seen = new Set<string>();
  const out: FalseFriend[] = [];
  for (const f of FALSE_FRIENDS) {
    if (seen.has(f.spanish)) continue;
    seen.add(f.spanish);
    out.push(f);
  }
  return out;
})();
