export type Person = "yo" | "tú" | "él/ella" | "nosotros" | "ellos/ellas";
export type Tense = "present" | "preterite" | "imperfect";

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

export const IRREGULAR_VERBS_PRETERITE: VerbConjugation[] = [
  {
    infinitive: "ser",
    english: "to be (essence)",
    tense: "preterite",
    forms: { yo: "fui", tú: "fuiste", "él/ella": "fue", nosotros: "fuimos", "ellos/ellas": "fueron" },
    exampleByPerson: {
      yo: { es: "Ayer fui el primero.", en: "Yesterday I was the first." },
      tú: { es: "Tú fuiste muy amable.", en: "You were very kind." },
      "él/ella": { es: "Ella fue mi maestra.", en: "She was my teacher." },
      nosotros: { es: "Nosotros fuimos amigos.", en: "We were friends." },
      "ellos/ellas": { es: "Ellos fueron los ganadores.", en: "They were the winners." },
    },
  },
  {
    infinitive: "estar",
    english: "to be (state/location)",
    tense: "preterite",
    forms: { yo: "estuve", tú: "estuviste", "él/ella": "estuvo", nosotros: "estuvimos", "ellos/ellas": "estuvieron" },
    exampleByPerson: {
      yo: { es: "Ayer estuve enfermo.", en: "Yesterday I was sick." },
      tú: { es: "Tú estuviste aquí.", en: "You were here." },
      "él/ella": { es: "Él estuvo callado.", en: "He was quiet." },
      nosotros: { es: "Nosotros estuvimos juntos.", en: "We were together." },
      "ellos/ellas": { es: "Ellos estuvieron de viaje.", en: "They were on a trip." },
    },
  },
  {
    infinitive: "ir",
    english: "to go",
    tense: "preterite",
    forms: { yo: "fui", tú: "fuiste", "él/ella": "fue", nosotros: "fuimos", "ellos/ellas": "fueron" },
    exampleByPerson: {
      yo: { es: "Fui a la tienda.", en: "I went to the store." },
      tú: { es: "Tú fuiste al cine.", en: "You went to the movies." },
      "él/ella": { es: "Ella fue a México.", en: "She went to Mexico." },
      nosotros: { es: "Nosotros fuimos juntos.", en: "We went together." },
      "ellos/ellas": { es: "Ellos fueron a la playa.", en: "They went to the beach." },
    },
  },
  {
    infinitive: "tener",
    english: "to have",
    tense: "preterite",
    forms: { yo: "tuve", tú: "tuviste", "él/ella": "tuvo", nosotros: "tuvimos", "ellos/ellas": "tuvieron" },
    exampleByPerson: {
      yo: { es: "Ayer tuve un examen.", en: "Yesterday I had an exam." },
      tú: { es: "Tú tuviste razón.", en: "You were right." },
      "él/ella": { es: "Él tuvo suerte.", en: "He was lucky." },
      nosotros: { es: "Nosotros tuvimos miedo.", en: "We were afraid." },
      "ellos/ellas": { es: "Ellas tuvieron éxito.", en: "They were successful." },
    },
  },
  {
    infinitive: "hacer",
    english: "to do / to make",
    tense: "preterite",
    forms: { yo: "hice", tú: "hiciste", "él/ella": "hizo", nosotros: "hicimos", "ellos/ellas": "hicieron" },
    exampleByPerson: {
      yo: { es: "Hice la tarea anoche.", en: "I did the homework last night." },
      tú: { es: "Tú hiciste un buen trabajo.", en: "You did a good job." },
      "él/ella": { es: "Ella hizo el pastel.", en: "She made the cake." },
      nosotros: { es: "Nosotros hicimos planes.", en: "We made plans." },
      "ellos/ellas": { es: "Ellos hicieron la fiesta.", en: "They threw the party." },
    },
  },
  {
    infinitive: "poder",
    english: "to be able / could",
    tense: "preterite",
    forms: { yo: "pude", tú: "pudiste", "él/ella": "pudo", nosotros: "pudimos", "ellos/ellas": "pudieron" },
    exampleByPerson: {
      yo: { es: "No pude dormir bien.", en: "I couldn't sleep well." },
      tú: { es: "Tú pudiste ayudarme.", en: "You were able to help me." },
      "él/ella": { es: "Él pudo terminar a tiempo.", en: "He managed to finish on time." },
      nosotros: { es: "Nosotros pudimos verlo.", en: "We managed to see it." },
      "ellos/ellas": { es: "Ellos pudieron escapar.", en: "They managed to escape." },
    },
  },
  {
    infinitive: "querer",
    english: "to want / love",
    tense: "preterite",
    forms: { yo: "quise", tú: "quisiste", "él/ella": "quiso", nosotros: "quisimos", "ellos/ellas": "quisieron" },
    exampleByPerson: {
      yo: { es: "Quise llamarte ayer.", en: "I tried to call you yesterday." },
      tú: { es: "Tú quisiste venir.", en: "You wanted to come." },
      "él/ella": { es: "Ella quiso decir algo.", en: "She meant to say something." },
      nosotros: { es: "Nosotros quisimos viajar.", en: "We wanted to travel." },
      "ellos/ellas": { es: "Ellos quisieron quedarse.", en: "They wanted to stay." },
    },
  },
  {
    infinitive: "saber",
    english: "to know (facts)",
    tense: "preterite",
    forms: { yo: "supe", tú: "supiste", "él/ella": "supo", nosotros: "supimos", "ellos/ellas": "supieron" },
    exampleByPerson: {
      yo: { es: "Supe la noticia anoche.", en: "I found out the news last night." },
      tú: { es: "Tú supiste la respuesta.", en: "You knew the answer." },
      "él/ella": { es: "Él supo la verdad.", en: "He found out the truth." },
      nosotros: { es: "Nosotros supimos llegar.", en: "We managed to arrive." },
      "ellos/ellas": { es: "Ellos supieron entonces.", en: "They knew then." },
    },
  },
  {
    infinitive: "decir",
    english: "to say / tell",
    tense: "preterite",
    forms: { yo: "dije", tú: "dijiste", "él/ella": "dijo", nosotros: "dijimos", "ellos/ellas": "dijeron" },
    exampleByPerson: {
      yo: { es: "Dije la verdad.", en: "I told the truth." },
      tú: { es: "Tú dijiste mucho.", en: "You said a lot." },
      "él/ella": { es: "Ella dijo adiós.", en: "She said goodbye." },
      nosotros: { es: "Nosotros dijimos hola.", en: "We said hello." },
      "ellos/ellas": { es: "Ellos dijeron secretos.", en: "They told secrets." },
    },
  },
  {
    infinitive: "venir",
    english: "to come",
    tense: "preterite",
    forms: { yo: "vine", tú: "viniste", "él/ella": "vino", nosotros: "vinimos", "ellos/ellas": "vinieron" },
    exampleByPerson: {
      yo: { es: "Vine de Madrid.", en: "I came from Madrid." },
      tú: { es: "Tú viniste tarde.", en: "You came late." },
      "él/ella": { es: "Ella vino conmigo.", en: "She came with me." },
      nosotros: { es: "Nosotros vinimos en coche.", en: "We came by car." },
      "ellos/ellas": { es: "Ellos vinieron juntos.", en: "They came together." },
    },
  },
  {
    infinitive: "dar",
    english: "to give",
    tense: "preterite",
    forms: { yo: "di", tú: "diste", "él/ella": "dio", nosotros: "dimos", "ellos/ellas": "dieron" },
    exampleByPerson: {
      yo: { es: "Le di un regalo.", en: "I gave him a gift." },
      tú: { es: "Tú diste tu opinión.", en: "You gave your opinion." },
      "él/ella": { es: "Él dio las gracias.", en: "He gave thanks." },
      nosotros: { es: "Nosotros dimos un paseo.", en: "We took a walk." },
      "ellos/ellas": { es: "Ellas dieron dinero.", en: "They gave money." },
    },
  },
  {
    infinitive: "ver",
    english: "to see",
    tense: "preterite",
    forms: { yo: "vi", tú: "viste", "él/ella": "vio", nosotros: "vimos", "ellos/ellas": "vieron" },
    exampleByPerson: {
      yo: { es: "Vi una película anoche.", en: "I saw a movie last night." },
      tú: { es: "Tú viste el partido.", en: "You saw the game." },
      "él/ella": { es: "Ella vio la luna.", en: "She saw the moon." },
      nosotros: { es: "Nosotros vimos las estrellas.", en: "We saw the stars." },
      "ellos/ellas": { es: "Ellos vieron el accidente.", en: "They saw the accident." },
    },
  },
  {
    infinitive: "poner",
    english: "to put / place",
    tense: "preterite",
    forms: { yo: "puse", tú: "pusiste", "él/ella": "puso", nosotros: "pusimos", "ellos/ellas": "pusieron" },
    exampleByPerson: {
      yo: { es: "Puse la mesa.", en: "I set the table." },
      tú: { es: "Tú pusiste música.", en: "You put on music." },
      "él/ella": { es: "Él puso los libros.", en: "He placed the books." },
      nosotros: { es: "Nosotros pusimos atención.", en: "We paid attention." },
      "ellos/ellas": { es: "Ellos pusieron excusas.", en: "They made excuses." },
    },
  },
  {
    infinitive: "salir",
    english: "to leave",
    tense: "preterite",
    forms: { yo: "salí", tú: "saliste", "él/ella": "salió", nosotros: "salimos", "ellos/ellas": "salieron" },
    exampleByPerson: {
      yo: { es: "Salí temprano de casa.", en: "I left home early." },
      tú: { es: "Tú saliste con amigos.", en: "You went out with friends." },
      "él/ella": { es: "Ella salió del trabajo.", en: "She left work." },
      nosotros: { es: "Nosotros salimos juntos.", en: "We went out together." },
      "ellos/ellas": { es: "Ellos salieron a correr.", en: "They went out running." },
    },
  },
];

export const IRREGULAR_VERBS_IMPERFECT: VerbConjugation[] = [
  {
    infinitive: "ser",
    english: "to be (essence)",
    tense: "imperfect",
    forms: { yo: "era", tú: "eras", "él/ella": "era", nosotros: "éramos", "ellos/ellas": "eran" },
    exampleByPerson: {
      yo: { es: "Cuando era niño.", en: "When I was a child." },
      tú: { es: "Tú eras muy alto.", en: "You were very tall." },
      "él/ella": { es: "Ella era simpática.", en: "She was friendly." },
      nosotros: { es: "Nosotros éramos amigos.", en: "We were friends." },
      "ellos/ellas": { es: "Ellos eran hermanos.", en: "They were brothers." },
    },
  },
  {
    infinitive: "estar",
    english: "to be (state/location)",
    tense: "imperfect",
    forms: { yo: "estaba", tú: "estabas", "él/ella": "estaba", nosotros: "estábamos", "ellos/ellas": "estaban" },
    exampleByPerson: {
      yo: { es: "Estaba cansado ayer.", en: "I was tired yesterday." },
      tú: { es: "Tú estabas en casa.", en: "You were at home." },
      "él/ella": { es: "Él estaba enfermo.", en: "He was sick." },
      nosotros: { es: "Estábamos felices.", en: "We were happy." },
      "ellos/ellas": { es: "Ellos estaban allí.", en: "They were there." },
    },
  },
  {
    infinitive: "ir",
    english: "to go",
    tense: "imperfect",
    forms: { yo: "iba", tú: "ibas", "él/ella": "iba", nosotros: "íbamos", "ellos/ellas": "iban" },
    exampleByPerson: {
      yo: { es: "Iba al colegio cada día.", en: "I used to go to school every day." },
      tú: { es: "Tú ibas a verla.", en: "You used to go see her." },
      "él/ella": { es: "Ella iba al gimnasio.", en: "She used to go to the gym." },
      nosotros: { es: "Íbamos al parque.", en: "We used to go to the park." },
      "ellos/ellas": { es: "Ellos iban en bici.", en: "They used to go by bike." },
    },
  },
  {
    infinitive: "tener",
    english: "to have",
    tense: "imperfect",
    forms: { yo: "tenía", tú: "tenías", "él/ella": "tenía", nosotros: "teníamos", "ellos/ellas": "tenían" },
    exampleByPerson: {
      yo: { es: "Tenía un perro de niño.", en: "I had a dog as a kid." },
      tú: { es: "Tú tenías mucha paciencia.", en: "You had a lot of patience." },
      "él/ella": { es: "Él tenía suerte siempre.", en: "He was always lucky." },
      nosotros: { es: "Teníamos una casa grande.", en: "We had a big house." },
      "ellos/ellas": { es: "Ellos tenían hijos jóvenes.", en: "They had young kids." },
    },
  },
  {
    infinitive: "hacer",
    english: "to do / to make",
    tense: "imperfect",
    forms: { yo: "hacía", tú: "hacías", "él/ella": "hacía", nosotros: "hacíamos", "ellos/ellas": "hacían" },
    exampleByPerson: {
      yo: { es: "Hacía deporte cada mañana.", en: "I used to exercise every morning." },
      tú: { es: "Tú hacías la cena.", en: "You used to make dinner." },
      "él/ella": { es: "Ella hacía pasteles.", en: "She used to make cakes." },
      nosotros: { es: "Hacíamos planes juntos.", en: "We used to make plans together." },
      "ellos/ellas": { es: "Ellos hacían ruido.", en: "They used to make noise." },
    },
  },
  {
    infinitive: "poder",
    english: "to be able / could",
    tense: "imperfect",
    forms: { yo: "podía", tú: "podías", "él/ella": "podía", nosotros: "podíamos", "ellos/ellas": "podían" },
    exampleByPerson: {
      yo: { es: "Podía cantar muy bien.", en: "I used to be able to sing well." },
      tú: { es: "Tú podías ayudar.", en: "You used to be able to help." },
      "él/ella": { es: "Él podía correr rápido.", en: "He could run fast." },
      nosotros: { es: "Podíamos verlo todo.", en: "We could see everything." },
      "ellos/ellas": { es: "Ellas podían venir.", en: "They could come." },
    },
  },
  {
    infinitive: "querer",
    english: "to want / love",
    tense: "imperfect",
    forms: { yo: "quería", tú: "querías", "él/ella": "quería", nosotros: "queríamos", "ellos/ellas": "querían" },
    exampleByPerson: {
      yo: { es: "Quería ser piloto.", en: "I wanted to be a pilot." },
      tú: { es: "Tú querías salir.", en: "You wanted to go out." },
      "él/ella": { es: "Ella quería viajar.", en: "She wanted to travel." },
      nosotros: { es: "Queríamos quedarnos.", en: "We wanted to stay." },
      "ellos/ellas": { es: "Ellos querían dormir.", en: "They wanted to sleep." },
    },
  },
  {
    infinitive: "saber",
    english: "to know (facts)",
    tense: "imperfect",
    forms: { yo: "sabía", tú: "sabías", "él/ella": "sabía", nosotros: "sabíamos", "ellos/ellas": "sabían" },
    exampleByPerson: {
      yo: { es: "Sabía la respuesta de memoria.", en: "I knew the answer by heart." },
      tú: { es: "Tú sabías la ruta.", en: "You knew the route." },
      "él/ella": { es: "Él sabía nadar.", en: "He knew how to swim." },
      nosotros: { es: "Sabíamos toda la historia.", en: "We knew the whole story." },
      "ellos/ellas": { es: "Ellos sabían mucho.", en: "They knew a lot." },
    },
  },
  {
    infinitive: "decir",
    english: "to say / tell",
    tense: "imperfect",
    forms: { yo: "decía", tú: "decías", "él/ella": "decía", nosotros: "decíamos", "ellos/ellas": "decían" },
    exampleByPerson: {
      yo: { es: "Decía siempre la verdad.", en: "I always told the truth." },
      tú: { es: "Tú decías cosas raras.", en: "You used to say weird things." },
      "él/ella": { es: "Él decía hola a todos.", en: "He used to say hi to everyone." },
      nosotros: { es: "Decíamos buenos días.", en: "We used to say good morning." },
      "ellos/ellas": { es: "Ellas decían adiós.", en: "They used to say goodbye." },
    },
  },
  {
    infinitive: "venir",
    english: "to come",
    tense: "imperfect",
    forms: { yo: "venía", tú: "venías", "él/ella": "venía", nosotros: "veníamos", "ellos/ellas": "venían" },
    exampleByPerson: {
      yo: { es: "Venía cada verano.", en: "I used to come every summer." },
      tú: { es: "Tú venías con tu padre.", en: "You used to come with your dad." },
      "él/ella": { es: "Ella venía sola.", en: "She used to come alone." },
      nosotros: { es: "Veníamos los domingos.", en: "We used to come on Sundays." },
      "ellos/ellas": { es: "Ellos venían tarde.", en: "They used to come late." },
    },
  },
  {
    infinitive: "dar",
    english: "to give",
    tense: "imperfect",
    forms: { yo: "daba", tú: "dabas", "él/ella": "daba", nosotros: "dábamos", "ellos/ellas": "daban" },
    exampleByPerson: {
      yo: { es: "Daba clases de inglés.", en: "I used to teach English." },
      tú: { es: "Tú dabas buenos consejos.", en: "You used to give good advice." },
      "él/ella": { es: "Él daba propinas.", en: "He used to give tips." },
      nosotros: { es: "Dábamos paseos largos.", en: "We used to take long walks." },
      "ellos/ellas": { es: "Ellos daban discursos.", en: "They used to give speeches." },
    },
  },
  {
    infinitive: "ver",
    english: "to see",
    tense: "imperfect",
    forms: { yo: "veía", tú: "veías", "él/ella": "veía", nosotros: "veíamos", "ellos/ellas": "veían" },
    exampleByPerson: {
      yo: { es: "Veía películas los viernes.", en: "I used to watch movies on Fridays." },
      tú: { es: "Tú veías el atardecer.", en: "You used to watch the sunset." },
      "él/ella": { es: "Ella veía a sus padres.", en: "She used to see her parents." },
      nosotros: { es: "Veíamos televisión juntos.", en: "We used to watch TV together." },
      "ellos/ellas": { es: "Ellos veían el partido.", en: "They used to watch the game." },
    },
  },
  {
    infinitive: "poner",
    english: "to put / place",
    tense: "imperfect",
    forms: { yo: "ponía", tú: "ponías", "él/ella": "ponía", nosotros: "poníamos", "ellos/ellas": "ponían" },
    exampleByPerson: {
      yo: { es: "Ponía música por la mañana.", en: "I used to play music in the morning." },
      tú: { es: "Tú ponías la mesa.", en: "You used to set the table." },
      "él/ella": { es: "Él ponía atención en clase.", en: "He used to pay attention in class." },
      nosotros: { es: "Poníamos los libros allí.", en: "We used to put the books there." },
      "ellos/ellas": { es: "Ellas ponían flores frescas.", en: "They used to put fresh flowers." },
    },
  },
  {
    infinitive: "salir",
    english: "to leave / go out",
    tense: "imperfect",
    forms: { yo: "salía", tú: "salías", "él/ella": "salía", nosotros: "salíamos", "ellos/ellas": "salían" },
    exampleByPerson: {
      yo: { es: "Salía a correr cada tarde.", en: "I used to go running every afternoon." },
      tú: { es: "Tú salías con amigos.", en: "You used to go out with friends." },
      "él/ella": { es: "Ella salía temprano.", en: "She used to leave early." },
      nosotros: { es: "Salíamos en bicicleta.", en: "We used to go out by bike." },
      "ellos/ellas": { es: "Ellos salían a bailar.", en: "They used to go out dancing." },
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
