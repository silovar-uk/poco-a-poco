# Poco a Poco — Learning System v2

## North star

Poco a Poco is not a phrasebook and not a grammar syllabus.

The product should help a beginner:

1. understand enough of a short partner turn,
2. retrieve a useful chunk,
3. say it aloud,
4. receive a response,
5. repair the conversation when stuck,
6. reuse the same language in a new condition.

**Learn less. Understand enough. Reuse more. Repair when stuck. Keep going.**

## Research adopted

Research and reference review before implementation focused on:

- Council of Europe CEFR Companion Volume: learner as social agent; reception, production, interaction and mediation; curriculum/teaching/assessment coherence.
- Instituto Cervantes Plan Curricular A1–A2: communicative functions including asking for repetition / slower speech and explicit pronunciation/prosody work from beginner levels.
- Retrieval / spacing principles already present in Poco were retained rather than replaced by recognition-only quizzes.

Not adopted in this wave:

- speech recognition or pronunciation scoring,
- AI conversation,
- backend accounts,
- heavy gamification,
- a 15-step lesson,
- grammar-order curriculum.

These do not solve the most immediate learning gap: interaction and transfer.

## Current curriculum audit

The previous eight lessons had strong reusable chunks and retrieval, but mostly trained the learner's own single sentence.

Main gaps:

- partner language,
- meaning recognition,
- conversational response,
- repair strategies,
- transfer to unseen conditions,
- cross-lesson capability planning.

Decision: keep the eight legacy IDs for progress compatibility, upgrade all eight to Communication Episodes, and insert one new Repair lesson early. Migrating all existing lessons at once avoids maintaining two different lesson runtimes while still keeping the wave small (nine implemented lessons, not 24–30).

## Capability model

Every implemented v2 lesson belongs to one or more of:

- SURVIVE
- CONNECT
- TRANSACT
- REPAIR
- EXPRESS
- UNDERSTAND

The full roadmap currently contains 26 Can-dos in `data/curriculum.js`.

## Learning loop v2

Nine steps remain, but their purpose changes:

```text
SCENE
-> PARTNER
-> CHUNK
-> RETRIEVE
-> SPEAK
-> INTERACT
-> PERSONALIZE
-> TRANSFER
-> DONE
```

Why nine? The new behaviors are folded into existing cognitive stages rather than turning a five-minute product into a long course screen flow.

### PARTNER

The learner sees a short realistic partner line and identifies only the meaning needed to continue. The purpose is gist recognition, not word-for-word translation.

### CHUNK

The core reusable chunk, short notice, and one pronunciation/prosody focus are shown together.

### RETRIEVE / SPEAK

Answer visibility remains deliberately controlled. The learner tries to retrieve before reveal and then hides the phrase before speaking.

### INTERACT / REPAIR

The learner receives a likely response, extracts its gist, sees a short possible reaction, and gets an explicit escape hatch such as `Otra vez, por favor.` or `Más despacio, por favor.`

### TRANSFER

The same language must be used under a new condition. This is distinct from simply recalling the original sentence.

## Implemented first wave

1. `greet` — greeting + name + partner understanding
2. `repair` — ask for repetition / slower speech
3. `like` — answer a preference question
4. `want` — complete a basic café exchange
5. `where` — ask for a place and interpret a short location response
6. `from` — origin exchange
7. `today` — current state exchange
8. `time` — tomorrow plan exchange
9. `opinion` — short reaction / evaluation

Existing IDs are preserved for all legacy lessons.

## Practice v2

Practice now has two layers.

### Full Episode

Run the highest-priority Communication Episode again.

### Quick Drills

- REACT — respond to a partner line
- REPAIR — recover from a communication problem
- TRANSFER — apply a known chunk under a new condition

This changes Practice from “repeat the lesson” into “rebuild the language.”

## Mastery model

Visible/internal states:

- NEW
- GETTING THERE
- USABLE
- REVISIT

One completion cannot produce USABLE. At least two records with recent high confidence are required in the current lightweight model.

This is intentionally simpler than a large scoring dashboard.

## 26 Can-do roadmap

The canonical structured map lives in `data/curriculum.js` and includes:

- early repair,
- café / restaurant transactions,
- directions and station use,
- prices / time / tickets,
- hotel interaction,
- social connection and hobbies,
- invitations and meeting arrangements,
- shopping,
- asking for help and handling being lost.

The roadmap includes prerequisites and reuse links so future lessons are treated as a graph rather than an isolated list.

## Journey test

### MEET SOMEONE

Current wave supports greeting, name, origin, preference, state and basic repair. This journey is already meaningfully stronger than v1.

### GET SOMETHING

Current wave supports ordering, `¿Algo más?`, `No, gracias.`, and repair. Price/payment and richer restaurant follow-ups remain next-wave items.

### FIND YOUR WAY

Current wave supports asking where something is, interpreting `Está allí.`, confirming with `¿Aquí?`, and repair. Direction vocabulary and station-specific interaction remain next-wave items.

## Rejected changes in this wave

- AI conversation: high complexity before basic interaction scaffolding is proven.
- Speech scoring: pronunciation goal is intelligibility and awareness, not native-accent scoring.
- Large vocabulary deck: would pull the product toward flashcards rather than communication.
- More lesson steps: would raise interaction cost and length.
- Full PWA/backend/account system: unrelated to the current learning problem.
- Leaderboards/XP economy: no demonstrated learning need.

## QA gates

A v2 lesson must include:

- real scenario,
- observable Can-do,
- core chunk,
- partner prompt,
- partner response,
- recognition task,
- repair strategy,
- one pronunciation/prosody focus,
- personalization,
- transfer condition.

Content and curriculum are validated at startup and in `npm test`.

## Next wave

Priority order:

1. price / numbers interaction,
2. pointing when vocabulary is missing (`Esto, por favor.`),
3. restaurant follow-up,
4. station directions,
5. time / ticket interaction,
6. combine multiple chunks in one Practice drill.

Only after these interaction patterns are stable should richer audio, adaptive spacing, or more complex modes be reconsidered.
