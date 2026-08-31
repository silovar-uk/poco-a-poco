# Poco a Poco — Architecture Contract

## 1. Overview

Poco a Poco is intentionally a build-free static web app. The goal is not maximum abstraction; it is clear boundaries that let learning content, learning logic, persistence, UI, and visual design evolve independently.

Principle: **Simple now. Clear boundaries. Replaceable later.**

## 2. Current structure

```text
index.html
app.js                    # UI orchestration + DOM events
styles.css                # visual design system

data/
  content.js              # lessons + discovery content

domain/
  learning.js             # pure learning/progress functions

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

## 4. Lesson Data Contract

Required fields:

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
- `change` (one or more non-empty strings)
- `reuse`
- `reuseEs`

Current valid levels: `A0`, `A1`, `A1+`.

`validateLessons()` must pass before the application starts. New content should fail early rather than produce a broken lesson at runtime.

## 5. Persistent State Contract

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

Persistent:

- Japanese support level
- completion history
- personal sentences
- last route

Not persistent:

- current lesson step
- answer reveal state
- selected variation
- speak-hidden state
- form validation state
- current session confidence until completion

## 6. Session State Contract

`state/session.js` owns the shape of an in-progress lesson session. Session state is disposable and must not be used as durable learning history.

Nine steps are explicit:

`scene -> meaning -> chunk -> retrieve -> speak -> change -> personalize -> reuse -> done`

## 7. Storage Contract

Only `storage/storage.js` may directly own the Web Storage persistence policy.

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

## 8. Design Layer Contract

Living Spanish remains a product contract, not incidental decoration.

The UI explicitly publishes:

- `body[data-route]`
- `body[data-jp]`
- `body[data-step]` during lessons
- `.lesson[data-step]`
- `.lesson[data-mode]`
- `poco:render` custom event

The UI also renders the Living Sentence spine directly because revealing or hiding a sentence is part of learning behavior, not merely visual decoration.

`design.js` may react to these explicit signals (for example theme-color), but must not infer application state from arbitrary DOM structure.

## 9. Testing strategy

### Unit / contract

Run:

```bash
npm test
```

Covers:

- lesson validation
- legacy storage migration
- corrupt storage backup behavior
- unsupported schema behavior
- storage round-trip
- practice priority
- next lesson
- streak
- deterministic completion records
- session contract
- design-layer dependency contract

### Integration / smoke

Before publishing, verify:

`HOME -> lesson -> RETRIEVE -> SPEAK -> PERSONALIZE -> DONE -> HOME -> PRACTICE`

Also verify JP Levels 1–4.

### Manual accessibility / visual

Automation does not replace:

- keyboard navigation
- visible focus
- dialog operation
- mobile safe-area check
- iPhone Safari visual check
- reduced-motion behavior

## 10. Deployment

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

## 11. Where NOT to put code

Do not put:

- lesson content in `app.js`
- practice scoring in render functions
- `localStorage` calls in UI or domain code
- DOM queries in domain code
- persistent data in session state
- learning-answer visibility logic only in CSS/design decoration
- framework/build dependencies without a concrete current problem

## 12. Six-month maintainer test

A healthy architecture should allow:

- 50 lessons without expanding `app.js` with lesson data
- 100 discovery items without mixing editorial content into rendering logic
- Smart Random replacement without rewriting UI markup
- localStorage replacement without rewriting learning logic
- new lesson fields with validator/schema review
- new practice modes with domain-first logic
- visual redesign without access to hidden app globals
- a new maintainer to understand the major boundaries in roughly 30 minutes

If a future change breaks these properties, update this contract or change the implementation deliberately; do not let the boundary erode accidentally.
