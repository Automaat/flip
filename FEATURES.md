# Flip — Feature Plan

Spanish learning app combining FSRS spaced repetition, AI-powered mnemonics, and comprehensible input. Built for rapid acquisition by an English speaker.

---

## Design Principles

1. **FSRS-first** — state-of-art scheduling, 20-30% fewer reviews than SM-2
2. **Sentence > word** — always learn in context (i+1)
3. **Audio on everything** — dual encoding = +30% retention
4. **Active recall only** — never show both sides simultaneously
5. **Interleaved review** — mix topics in sessions (20-50% better retention)
6. **Sleep-aware** — new cards evening, reviews morning
7. **Deep processing** — force meaning engagement, not pattern matching
8. **Offline-first** — works without internet, AI features when online

---

## Phase 1 — Core SRS Engine

### F1.1 FSRS Scheduling

- `ts-fsrs` (TypeScript) or `swift-fsrs` (iOS native)
- Default 90% desired retention (configurable 80-95%)
- 4 ratings: Again / Hard / Good / Easy
- Card states: New → Learning → Review → Relearning
- Default params for cold start, optimize after 200+ reviews
- Leech detection: flag cards failed 8+ times, prompt to rewrite/split

### F1.2 Card Types

| Type | Front | Back | When |
|------|-------|------|------|
| **Vocab (receptive)** | 🔊 Spanish word + image | English meaning | Recognition |
| **Vocab (productive)** | English + image | 🔊 Spanish word | Production |
| **Cloze sentence** | "Ella ___ (tener) tres gatos" | "tiene" + full translation | Grammar in context |
| **Listening** | 🔊 audio only | Written Spanish + English | Ear training |
| **Conjugation** | "hablar — yo — presente" | "hablo" | Verb drills |
| **Gender** | "mariposa — ¿el o la?" | "la mariposa" 🔴 | Noun gender |

- One fact per card (minimum information principle)
- Generate both receptive + productive from single entry
- Never show both directions in same session (interference)

### F1.3 Pre-Built Content

- Top 1,000 Spanish words by frequency (OpenSubtitles corpus)
- Each word: audio (TTS), example sentence, image (concrete nouns)
- Sourced from Tatoeba (500k+ CC-licensed sentences) + wordfreq
- Gender color-coding: 🔵 masculine, 🔴 feminine

### F1.4 Daily Review Session

- Cap new cards: 20/day default (adjustable 5-30)
- Session structure: due reviews first, then new cards
- Interleaved across decks/topics by default
- Timer per card (track review_duration_ms for analytics)
- Force active recall: must attempt before reveal

### F1.5 Progress & Streaks

- Daily streak counter (most impactful gamification mechanic — 3x return rate)
- Words known counter (by familiarity: seen/learning/known)
- Frequency coverage meter: "You understand X% of spoken Spanish"
- CEFR level estimate based on vocabulary + grammar mastery
- Review forecast: upcoming workload for next 7 days

---

## Phase 2 — Spanish Accelerators

### F2.1 Cognate Engine 🏆

Biggest unique differentiator. Onboarding hook: "You already know 1,000+ Spanish words!"

**24 cognate ending rules:**

| English | Spanish | Example |
|---------|---------|---------|
| -tion | -ción | nation → nación |
| -ly | -mente | absolutely → absolutamente |
| -ous | -oso | ambitious → ambicioso |
| -ty | -dad | activity → actividad |
| -ment | -mento | argument → argumento |
| -ive | -ivo | active → activo |
| -ble | -ble | adorable → adorable |
| -ism | -ismo | Buddhism → Budismo |
| -ist | -ista | artist → artista |
| -nce | -ncia | abundance → abundancia |
| -nt | -nte | abundant → abundante |
| -ic | -ico | academic → académico |
| -ence | -encia | adolescence → adolescencia |
| -or | -or | actor → actor |
| -ct | -cto | act → acto |
| -ary | -ario | actuary → actuario |
| -ate | -ar | abbreviate → abreviar |
| -y | -ia | academy → academia |
| -ify | -ificar | clarify → clarificar |
| -al | -al | animal → animal |
| -id | -ido | acid → ácido |
| -ile | -il | agile → ágil |
| -ar | -ar | dollar → dólar |
| -y | -io | accessory → accesorio |

**Flow:** Teach rule → quiz with unseen examples → unlock word batch → SRS reviews

### F2.2 False Friends Deck

~55 critical false cognates as special "trap cards" with higher initial review frequency:

- embarazada ≠ embarrassed (= pregnant)
- éxito ≠ exit (= success)
- constipado ≠ constipated (= having a cold)
- actual ≠ actual (= current)
- sensible ≠ sensible (= sensitive)
- librería ≠ library (= bookstore)
- (full list of 55 in research)

Card format: "embarazada = embarrassed? ❌ = pregnant ✅" with memorable context sentence

### F2.3 Verb Conjugation System

**Priority order (mirrors spoken frequency):**
1. Present indicative (~60% of conversation)
2. Preterite (completed past)
3. Imperfect (habitual past, descriptions)
4. Present progressive (estar + gerund)
5. Near future (ir + a + infinitive)
6. Imperative
7. Conditional
8. Subjunctive (B1+ only, WEIRDO mnemonic)

**14 essential irregular verbs first:**
ser, estar, ir, tener, hacer, poder, querer, saber, decir, venir, dar, ver, poner, salir, haber

**Card design:**
- Always cloze in sentence context, never isolated conjugation tables
- Color-code tenses (present=green, past=blue, future=orange)
- Group irregulars by pattern (stem-changers: e→ie, o→ue, e→i)

### F2.4 Gender System

- Always show nouns with articles (never bare noun)
- Color-coding: 🔵 el, 🔴 la
- Teach rules first: -o=masc, -a=fem, -ción/-sión=fem, -dad/-tad=fem
- Greek exceptions deck: el problema, el sistema, el tema
- Other exceptions: el día, la mano, el mapa
- Adjective agreement cards: "the red house" → "la casa roja"

### F2.5 Regional Settings

- Default: Latin American (Mexican) Spanish — clearest, broadest utility
- Optional: Castilian (Spain)
- Key differences flagged: vosotros, pronunciation of c/z, vocabulary differences
- TTS voice matches selected region

---

## Phase 3 — Memory Enhancement

### F3.1 AI Mnemonic Generation

For each new vocabulary word, AI generates:
1. **Keyword association** — English sound-alike word ("perro" → "pear")
2. **Visual scene** — vivid/bizarre description ("a dog balancing a pear on its nose")
3. **Mnemonic image** — AI-generated illustration (DALL-E 3 or FLUX)

Research: keyword method = 88% recall vs 28% control (Atkinson & Raugh, 1975)

- Pre-generate for top 3,000 words
- On-demand generation for user-added words
- User can override with custom mnemonics
- Bizarre images outperform stock photos

### F3.2 Context Escalation

Layer techniques as card matures through FSRS states:

| Card Maturity | Presentation | Technique |
|---------------|-------------|-----------|
| **New** | Isolated word + keyword mnemonic + image | Fast form-meaning link |
| **Learning** | Word in simple cloze sentence | Context acquisition |
| **Young** | Word in different sentence | Varied context |
| **Mature** | Word in authentic paragraph | Deep processing |

Words need 10-20 contextual encounters to become active vocabulary.
Show same word in 3-5 different sentence contexts over its lifetime.

### F3.3 Deep Processing Prompts

After card review, occasionally prompt:
- "Use this word in a sentence about your day" (self-reference effect — strongest encoding)
- "What does this word remind you of?" (emotional connection)
- "How is this different from [similar word]?" (discrimination)

Frequency: ~1 in 10 reviews, only for words in learning/relearning state

### F3.4 Etymology Viewer

- Surface Latin root alongside vocabulary: "aqua" → agua (water), aquatic, aquarium
- Group word families by shared root
- Show English cognates to reinforce connection
- One root teaches multiple words simultaneously

---

## Phase 4 — AI-Powered Features

### F4.1 Conversation Practice

- LLM chatbot tutor (Claude API) constrained to user's CEFR level
- Role-play scenarios: restaurant, shopping, doctor, travel, small talk
- Correct errors inline with explanations
- Track vocabulary encountered in conversations → feed back to SRS
- After each exchange: secondary LLM call for error detection
- Research: 75% improvement in speaking scores over 8 weeks

### F4.2 Auto Card Generation

Pipeline:
1. User pastes article URL / text / podcast link
2. Extract text (Whisper for audio transcription)
3. Tokenize + lemmatize (spaCy `es_core_news_sm`)
4. Filter against user's known vocabulary list
5. Rank unknowns by frequency (wordfreq library)
6. Generate cloze cards with original sentence as context
7. Add TTS audio
8. Feed into FSRS scheduler

Sources: articles, YouTube subtitles, podcast transcripts, ebooks

### F4.3 AI-Generated Stories

- Graded readers at user's exact level
- Use recently learned vocabulary + target new words
- Interactive: choose-your-own-adventure format
- Audio + text sync with highlighted words
- Comprehension questions after each section
- Tap unknown words to add to SRS deck

### F4.4 AI Example Sentences

- Generate 3-5 contextual sentences per new word at user's level
- Different usage patterns, collocations, registers
- i+1: exactly one unknown element per sentence
- Replace static example sentences as user progresses

---

## Phase 5 — Pronunciation & Listening

### F5.1 TTS Audio System

**Architecture:**
- Primary: Google Cloud TTS ($16/1M chars) — best Spanish quality, IPA/SSML support
- Free fallback: edge-tts (Microsoft neural voices, zero cost)
- Self-hosted option: Kokoro 82M (Apache license, OpenAI-compatible API)
- Pre-generate audio for core 3,000 words + top sentences
- On-demand TTS for user-added cards

Adjustable speed: 0.5x / 0.75x / 1.0x / 1.25x

### F5.2 Pronunciation Scoring

**Layered approach:**
1. **Basic (free):** Whisper transcription → compare with target text → word-match scoring
2. **Advanced (paid API):** Azure Pronunciation Assessment → phoneme-level scoring with IPA

### F5.3 Minimal Pairs Training

Critical for English speakers learning Spanish:

| Pair | Word 1 | Word 2 | Skill |
|------|--------|--------|-------|
| r/rr | pero (but) | perro (dog) | Highest-impact discrimination |
| r/rr | caro (expensive) | carro (car) | Tap vs trill |
| ñ/n | año (year) | ano (anus) | Palatal nasal |

Format: play two audio clips → "Which word did you hear?" → immediate feedback

### F5.4 Dictation Mode

- Listen to sentence → type what you hear → compare
- Score: correct words / total words
- Highlight errors
- Add missed words to SRS deck automatically
- Progressive difficulty: slow → normal → fast speech

---

## Phase 6 — Reading & Immersion

### F6.1 Reader Mode

- Tap/click word → instant dictionary lookup + example sentences
- Color-code words by familiarity: ⬜ unknown, 🟡 learning, 🟢 known
- Long-press → add to SRS with sentence context
- Track: words read, new words encountered, reading speed
- Content: AI-generated graded texts + imported articles

### F6.2 Immersion Mode

- Replace N% of app UI text with Spanish (configurable)
- Daily notification with word-of-the-day in context sentence
- Spanish-only mode for mastered sections
- Progressive: start at 10%, increase as vocabulary grows

### F6.3 Content Import

- Paste article URL → extract + process
- YouTube URL → download subtitles → create cards
- Podcast RSS → Whisper transcription → mine vocabulary
- Kindle highlights → import unknown words
- All create cloze cards with original context preserved

---

## Phase 7 — Writing & Production

### F7.1 Sentence Construction

- Given shuffled Spanish words → arrange into correct sentence
- Tests word order, agreement, prepositions
- Multiple valid orderings accepted (Spanish has flexible word order)

### F7.2 Free Writing

- Writing prompts at user's level
- LLM evaluates grammar, vocabulary, naturalness
- Inline corrections with explanations
- Track common error patterns → generate targeted practice cards

### F7.3 Translation Challenges

- English → Spanish translation with scoring
- Accept multiple valid translations
- Highlight key differences from user's attempt

---

## Curriculum Progression

| Stage | CEFR | Hours | Words | Focus | Primary Card Types |
|-------|------|-------|-------|-------|-------------------|
| 1 | Pre-A1 | 0-50 | 0-250 | Cognate rules, top 100 words, ser/estar/ir | Cognate rule, Vocab |
| 2 | A1 | 50-150 | 250-500 | Top 500, present tense, basic sentences | Vocab, Cloze, Gender |
| 3 | A2 | 150-300 | 500-1000 | Past tenses, false friends, conversations | Sentence, Listening, False friend |
| 4 | B1 | 300-420 | 1000-2000 | All indicative tenses, subjunctive intro | Cloze, Sentence, Minimal pair |
| 5 | B2 | 420-600 | 2000-4000 | Subjunctive, nuanced expression, native content | Sentence mining, Listening, Writing |

**Milestones:**
- 1,000 words = ~82% text comprehension
- 3,000 words = ~92% spoken comprehension (daily conversation target)
- 5,000 words = ~95% (comfortable fluency)

---

## Technical Architecture

```
┌─────────────────────────────────────────┐
│              Mobile / Web UI            │
│  (React Native / Swift / Next.js PWA)   │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────┴──────────────────────┐
│           Local Data Layer              │
│  SQLite + ts-fsrs/swift-fsrs            │
│  Offline-first, all cards local         │
│  Pre-downloaded audio packs             │
└──────────────────┬──────────────────────┘
                   │ (when online)
┌──────────────────┴──────────────────────┐
│           Cloud Services                │
│  ┌───────────┐  ┌──────────────────┐   │
│  │ Claude API│  │ Google Cloud TTS │   │
│  │ (chat,    │  │ / edge-tts       │   │
│  │ mnemonics)│  │ (audio gen)      │   │
│  └───────────┘  └──────────────────┘   │
│  ┌───────────┐  ┌──────────────────┐   │
│  │ Whisper   │  │ DALL-E 3 / FLUX  │   │
│  │ (STT)     │  │ (mnemonic imgs)  │   │
│  └───────────┘  └──────────────────┘   │
│  ┌───────────┐  ┌──────────────────┐   │
│  │ Azure     │  │ spaCy + wordfreq │   │
│  │ Pronun.   │  │ (NLP pipeline)   │   │
│  └───────────┘  └──────────────────┘   │
└─────────────────────────────────────────┘
```

### Data Model

```sql
notes (id, note_type, fields JSON, tags, source, created_at)
cards (id, note_id, deck_id, state, due, stability, difficulty,
       elapsed_days, scheduled_days, reps, lapses, last_review)
review_log (id, card_id, rating, state, stability, difficulty,
            review_time_ms, reviewed_at)
decks (id, name, parent_id, settings JSON)
vocabulary (id, word, frequency_rank, familiarity, contexts JSON)
```

### Key Libraries

| Purpose | Library | Language |
|---------|---------|----------|
| SRS scheduling | ts-fsrs / swift-fsrs | TS / Swift |
| TTS | edge-tts / Google Cloud TTS | Python / API |
| STT | Whisper / whisper.cpp | Python / C++ |
| NLP | spaCy (es_core_news_sm) | Python |
| Frequency data | wordfreq | Python |
| Dictionary | wiktextract | Python |
| Sentences | Tatoeba CC corpus | Data |
| Translation | LibreTranslate | Python |
| Images | DALL-E 3 API / FLUX | API |
| AI chat | Claude API | API |

### Content Sources (Free/CC)

- **Tatoeba** — 500k+ Spanish sentences with translations
- **OpenSubtitles** — movie/TV parallel corpus
- **wordfreq** — frequency lists for 44 languages
- **wiktextract** — structured Wiktionary dictionary data
- **Forvo** — native speaker pronunciations
- **doozan/spanish_data** — open-source frequency list + Anki deck

---

## Anti-Patterns to Avoid

- ❌ Showing both sides simultaneously (kills active recall)
- ❌ Multiple facts per card (breaks scheduling accuracy)
- ❌ Introducing confusable words in same session (pero/perro)
- ❌ Alphabetical vocabulary ordering (no cognitive benefit)
- ❌ Isolated conjugation tables (use cloze sentences instead)
- ❌ Bare nouns without articles (must always show gender)
- ❌ Over-gamification (XP/gems/hearts distract from learning)
- ❌ Notification spam (cap 1-2/day, respect opt-outs)
- ❌ Leaderboards as default (demotivating for slower learners)
- ❌ Blocking review order by topic (interleave by default)
- ❌ Skipping productive cards (most apps neglect L1→L2 direction)

---

## Research Sources

Full research with citations in:
- `research-machine/findings/flashcard-language-learning/research.md`
- `research-machine/findings/spaced-repetition-research/srs-flashcard-language-learning.md`
- `research-machine/findings/spanish-learning-app/learning-methods-research.md`
- `research-machine/findings/spanish-learning-app/modern-language-app-research.md`
- `research-machine/findings/memory-techniques-language-learning/mnemonics-for-flashcard-apps.md`
