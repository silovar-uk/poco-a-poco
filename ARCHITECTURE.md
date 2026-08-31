# Poco a Poco — Architecture Contract

## 1. Overview

Poco a Poco is intentionally a build-free static web app. The goal is not maximum abstraction; it is clear boundaries that let learning content, learning logic, persistence, UI, and visual design evolve independently.

Principle: **Simple now. Clear boundaries. Replaceable later.**

Learning principle: **Learn less. Understand enough. Reuse more. Repair when stuck.**

## 2. Current structure

```text
index.html
app.js                    # UI orchestration + DOM events
styles.css                # core visual design system
learning-v2.css           # interaction / repair / transfer UI

data/
  content.js              # implemented lessons + discovery content
  curriculum.js           # 24-30 Can-do capability roadmap

domain/
  learning.js             # pure learning/progress/practice functions

state/
  session.js              # ephemeral lesson session state

storage/
  storage.js              # persistent state adapter + migration

design.js                 # explicit design-state adapter

tests/
  run.js                  # zero-dependency unit/contract tests
```

## 3. Dependency rules

Allowed:

```text
app.js -> data
app.js -> domain
app.js -> state/session
app.js -> storage
app.js -> DOM

domain -> plain data values only
storage -> Web Storage adapter only
state/session -> plain data only

design.js -> UI contract exposed through body/lesson data attributes + poco:render event
```

Forbidden:

- domain -> DOM
- domain -> localStorage
- storage -> UI
- data -> UI
- data -> storage
- design -> hidden `state` / `session` globals
- design -> DOM-shape guessing through MutationObserver

## 4. Learning Content Contract v2

Base fields remain:

- `id`
- `level`
- `title`
- `titleEs`
- `canDo`
- `scene`
- `sceneEs`
- `es`
- `ja`
- `notice`
- `noticeEs`
- `chunk`
- `retrieve`
- `retrieveCueEs`
- `retrieveAnswer`
- `retrieveAnswerJa`
- `change`
- `reuse`
- `reuseEs`

A v2 Communication Episode also requires:

- `contentVersion: 2`
- `capabilities[]`
- `partnerPrompt`
- `partnerResponse`
- `repair`
- `pronunciation`
- `transfer`

Capabilities are limited to:

`SURVIVE`, `CONNECT`, `TRANSACT`, `REPAIR`, `EXPRESS`, `UNDERSTAND`.

`validateLessons()` must pass before the app starts. `validateCurriculumMap()` also checks that the roadmap contains 24–30 Can-dos and valid capability/graph fields.

The content schema should express a learning need before the UI adds a feature. Do not invent new UI controls first and then search for lesson content to justify them.

## 5. Curriculum Contract

`data/curriculum.js` is the roadmap, not a list of all currently implemented lessons.

Each Can-do has:

- scenario
- observable Can-do
- core chunk
- partner line
- repair strategy
- pronunciation focus
- prerequisites
- later reuse links

The curriculum is a graph, not only a sequence. Repair language is deliberately cross-cutting and should reappear in transactions, directions, hotels, and social interaction.

## 6. Persistent State Contract

Stored under the existing key `poco-a-poco-v1` for compatibility.

```js
{
  schemaVersion: 1,
  support: 2,
  history: [],
  personal: {},
  lastRoute: 'home'
}
```

Existing lesson IDs are preserved when a lesson is upgraded to v2 so historical completions remain meaningful.

Completion history may contain additive fields such as `contentVersion`; old records remain valid.

Persistent:

- Japanese support level
- completion history
- personal sentences
- last route

Not persistent:

- current lesson step
- recognition selections
- answer reveal state
- selected variation
- speak-hidden state
- transfer reveal state
- form validation state
- current confidence until completion

## 7. Session State Contract

`state/session.js` owns the shape of an in-progress Communication Episode. Session state is disposable and must not be used as durable learning history.

Nine steps are explicit:

`scene -> partner -> chunk -> retrieve -> speak -> interact -> personalize -> transfer -> done`

Meaning / Notice is folded into `chunk`. Repair is surfaced during `interact`. Reuse and confidence are folded into `transfer`. This keeps the lesson at nine steps instead of expanding to a 12–15 step flow.

## 8. Practice Contract v2

Practice is not only “run the same lesson again.”

Domain-generated quick drills currently support:

- `REACT` — respond to a partner line
- `REPAIR` — recover when communication breaks
- `TRANSFER` — reuse a known chunk under a new condition

A full Communication Episode is still available for deeper review.

`masteryState()` deliberately distinguishes:

- `NEW`
- `GETTING THERE`
- `USABLE`
- `REVISIT`

One completion never equals `USABLE`.

## 9. Storage Contract

Only `storage/storage.js` may directly own Web Storage persistence policy.

Public responsibilities:

- `loadState()`
- `saveState()`
- `clearState()`
- `migrateState()`
- `normalizeState()`

Rules:

1. Keep the legacy storage key while schema migrations are needed.
2. Every current payload has `schemaVersion`.
3. Legacy unversioned state migrates to schema v1 without dropping valid history.
4. Corrupt JSON is backed up under a timestamped `*-corrupt-*` key when possible before fallback.
5. Unknown future schema versions are not interpreted as current data.
6. Storage write errors are surfaced as diagnostics; callers must not assume a write succeeded.

### IndexedDB

Not adopted now. Current data is small and localStorage remains adequate. The adapter boundary exists so a future IndexedDB implementation can replace persistence without rewriting domain logic.

## 10. Design Layer Contract

Living Spanish remains a product contract, not incidental decoration.

The UI explicitly publishes:

- `body[data-route]`
- `body[data-jp]`
- `body[data-step]` during lessons
- `.lesson[data-step]`
- `.lesson[data-mode]`
- `poco:render` custom event

The UI renders the Living Sentence spine directly because revealing or hiding a phrase is part of learning behavior, not merely visual decoration.

`design.js` may react to explicit signals such as theme color, but must not infer application state from arbitrary DOM structure.

## 11. Testing strategy

Run:

```bash
npm test
```

Covers:

- app / design syntax
- v2 lesson validation
- curriculum-map validation
- early Repair placement
- legacy lesson-ID compatibility
- legacy storage migration
- corrupt storage backup behavior
- unsupported schema behavior
- storage round-trip
- practice priority
- REACT / REPAIR / TRANSFER task generation
- mastery states
- next lesson
- streak
- versioned completion records
- nine-step session contract
- design-layer dependency contract

### Manual integration / smoke

Before publishing, verify:

`HOME -> PARTNER -> CHUNK -> RETRIEVE -> SPEAK -> INTERACT -> PERSONALIZE -> TRANSFER -> DONE -> PRACTICE`

Also verify:

- wrong recognition option can recover
- Repair text does not appear before the interaction step
- RETRIEVE / SPEAK / TRANSFER do not leak answers early
- JP Levels 1–4
- Quick Drill details reveal only after user opens them

### Manual accessibility / visual

Automation does not replace:

- keyboard navigation
- visible focus
- dialog operation
- mobile safe-area check
- iPhone Safari visual check
- reduced-motion behavior

## 12. Deployment

Canonical source: `main`.

Production source: `gh-pages`.

Flow:

```text
main
-> Internal foundation tests
-> fast-forward gh-pages to tested main
-> GitHub Pages build/deploy
-> production smoke check
```

Do not treat a successful push alone as deployment completion.

## 13. Where NOT to put code

Do not put:

- lesson content in `app.js`
- practice scoring in render functions
- `localStorage` calls in UI or domain code
- DOM queries in domain code
- persistent data in session state
- learning-answer visibility logic only in CSS/design decoration
- new quiz/game UI without a named learning problem
- framework/build dependencies without a concrete current problem

## 14. Six-month maintainer test

A healthy architecture should allow:

- 50 lessons without expanding `app.js` with lesson data
- 100 discovery items without mixing editorial content into rendering logic
- adding a new practice mode in domain first, UI second
- changing Smart Random without rewriting lesson markup
- localStorage replacement without rewriting learning logic
- new lesson fields with validator/schema review
- visual redesign without access to hidden app globals
- a new maintainer to understand the major boundaries in roughly 30 minutes

If a future change breaks these properties, update this contract or change the implementation deliberately; do not let the boundary erode accidentally.
