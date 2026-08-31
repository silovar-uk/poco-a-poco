# Poco a Poco — Game Language v1

## Baseline 100

A merely good learning-game UI would provide:

- one obvious current mission,
- clear NEW / GROWING / USABLE / REVISIT states,
- immediate press / choice / success feedback,
- a visible lesson-progress rail,
- a clear completion state,
- purposeful short motion,
- large touch targets and reduced-motion support.

That baseline is necessary, but not the target.

## Persona council

### Game UX Director

Wants every meaningful action to change player state. Rejects decorative gamification and rewards unrelated to language.

### Indie Game Art Director

Wants one screenshot to be recognizably Poco. Rejects generic mobile-game neon, fantasy skill trees, loot, and mascot-first identity.

### Interaction Toy Designer

Wants press, snap, reveal, connect, and unlock to feel tactile. Rejects gestures that do not correspond to a learning action.

### Language Learning Researcher

Requires game actions to remain retrieval, interaction, repair, transfer, or spaced reuse. Rejects mechanics that compete with those behaviors.

### Merciless UX Reviewer

Optimizes for the seventh use, not the first screenshot. Rejects long animation, obscured text, small targets, and novelty taxes.

## Debate result

Five divergent directions were considered:

1. Living Path — abilities create a route rather than a list.
2. Conversation Rally — partner and learner turns feel like an exchange moving across space.
3. Phrase Forge — learned chunks feel like reusable tools in a personal kit.
4. World Opens With Language — progress is shown as increased comprehension, not points.
5. Wild Card — an editorial language app behaves like a tactile board of language tools rather than a conventional course dashboard.

No single direction won. The selected system combines the strongest parts of 1, 2, and 3 while using 4 as the progression principle.

## Core metaphor

**Language becomes equipment. Conversation is the field where you use it.**

Poco does not award fictional power for completing a lesson. The acquired phrase itself is the power.

## Progression metaphor

- PATH = a living route made from communication abilities.
- PRACTICE = a workbench / hand of known language tools.
- PARTNER / INTERACT = a rally: incoming language, your return, another response.
- TRANSFER = move a known tool into a new scene.
- DONE = capability unlock, not celebration for its own sake.

## Interaction vocabulary

- PRESS — physical compression, 80–140ms.
- SNAP — a selected answer locks into place.
- PULSE — short confirmation for a correct state.
- REVEAL — removed information returns only after an attempt.
- CONNECT — one turn visibly leads to the next.
- TRANSFER — known material moves into a different visual atmosphere.
- UNLOCK — completion briefly expands, then settles.

Motion must stay brief and must not delay the next action.

## Reward hierarchy

1. Choice success: tiny snap.
2. Step success: short pulse / connection.
3. Episode completion: capability unlock stage.
4. Repeated successful use: PATH state becomes stronger.
5. Future journey completion: reserved for later; do not invent coins, XP, or loot.

## Visual rules

- Preserve Living Spanish: paper, ink, rust, saffron, green, editorial type.
- Add depth selectively to interactive surfaces, not to reading surfaces.
- Use oversized numbers and route geometry as identity.
- Raised controls compress on press.
- Conversation turns occupy spatially different positions.
- Practice tools may overlap / rotate slightly like a hand of useful objects.
- Completion may be theatrical; routine screens should remain calm.

## Normal vs Poco

### PATH

Normal: nodes connected by a line.

Poco: communication episodes alternate across a living route; each step feels like a stop on an actual journey, while the large editorial numbers remain.

### PRACTICE

Normal: quiz list.

Poco: known language tools sit on a workbench. REACT / REPAIR / TRANSFER are different ways of using the same equipment.

### INTERACT

Normal: another question card.

Poco: the partner turn arrives from one side, the learner's understanding locks in, and repair reconnects a broken rally.

### DONE

Normal: congratulations + points.

Poco: the episode becomes an unlocked ability. The Can-do, personal sentence, and escape hatch are the reward.

## Rejected

- XP economy
- coins
- loot boxes
- leaderboards
- fantasy HP / combat metaphors
- mascot-first redesign
- generic winding circular skill tree
- confetti after routine actions
- permanent animation
- neon gamer palette
- time pressure without a learning reason
- drag gestures whose only purpose is novelty

## Accessibility / performance

- every state must remain understandable without motion,
- `prefers-reduced-motion` disables nonessential animation and transform feedback,
- color is never the only state signal,
- touch controls retain large targets,
- no animation blocks input,
- avoid large filter stacks and continuous compositing.

## First implementation wave

Implement the system on the highest-value existing surfaces rather than adding new product areas:

1. PATH — living route and tactile episode stops.
2. PRACTICE — language-tool workbench.
3. PARTNER / INTERACT — conversation rally.
4. DONE — capability unlock.
5. Shared buttons / navigation — consistent press and focus feedback.

DISCOVERY remains comparatively editorial so the whole application does not become visually loud.
