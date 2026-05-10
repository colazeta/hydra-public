# Codex support guide — Hydra public preview

This guide supports parallel Codex work on the Hydra public preview.

The goal is to improve the public site while preserving Hydra's core methodological constraints.

## Current product direction

Hydra public should become an Italian-first civic/procedural data-viz atlas.

It should not look like:

- a generic SaaS dashboard;
- a crime-board interface;
- a police/intelligence interface;
- a news article archive;
- a raw document viewer.

It should feel like:

- a public procedural observatory;
- a civic atlas;
- a source-forward data publication;
- a verification-aware interface;
- a visually memorable but sober public restitution platform.

## Non-negotiable constraints

1. The public site must read only curated public exports under `data/exports/public/`.
2. Do not expose raw notes, internal registers, candidate layers or private reconstruction files.
3. Keep the interface Italian-first.
4. Do not introduce actor biographies in the MVP.
5. Do not imply guilt, liability or final procedural findings.
6. Keep caveats visible near public reconstructions.
7. Attribute sources clearly.
8. Keep GitHub Pages compatibility.
9. Use vanilla HTML/CSS/JS unless a deliberate migration is opened as a separate issue.

## Data contract

Current public files:

```text
data/exports/public/public_timeline.json
data/exports/public/public_hearings.json
data/exports/public/public_issues.json
data/exports/public/public_sources.json
```

The frontend should treat these exports as the only public data source.

## UX priorities

### 1. Issue-centric navigation

The core of the site should be the map of procedural issue streams, not a generic list of hearings.

Prioritise:

- territorial competence;
- civil-party participation;
- defence-rights questions;
- calendar/procedural management;
- source/provenance support.

### 2. Horizontal observatory layout

The site should feel wide, spatial and atlas-like.

Improve:

- horizontal rhythm;
- large visual panels;
- timeline rail;
- issue stream bands;
- source/provenance constellation.

### 3. Verification as visual language

Verification status should not be hidden inside text.

Use visual badges, accents or patterns for:

- open;
- partially verified;
- verified;
- unclear.

### 4. Source-forward design

Sources should not appear only at the bottom.

Make source credits visible through:

- source chips;
- source atlas;
- links in timeline/hearing/issue cards;
- use-limitations copy.

### 5. Caveats as interface components

Caveats should remain near the relevant reconstruction.

Avoid burying them in a footer.

## Visual direction

Target style:

- dark atlas background;
- deep navy / ink palette;
- restrained neon accents;
- procedural linework;
- graph-inspired but not sensationalist;
- editorial typography;
- strong spacing;
- layered panels;
- subtle motion.

Avoid:

- red crime aesthetics;
- evidence-board strings;
- surveillance-style UI;
- generic Bootstrap cards;
- excessive KPI dashboards.

## Recommended components

- `MetricCard`
- `TimelineRail`
- `IssueStreamCard`
- `HearingCard`
- `SourceChip`
- `SourceAtlasCard`
- `CaveatBox`
- `VerificationBadge`

In vanilla JS these can remain render helper functions.

## Current gaps to prioritise

1. Translate all rendered JSON-derived labels into Italian where appropriate.
2. Ensure all four public JSON exports are present and load without errors.
3. Improve issue-map visual centrality.
4. Add source chips to timeline and hearing cards.
5. Add empty/error states when exports fail to load.
6. Improve responsive layout without losing horizontal character on desktop.
7. Add subtle interaction: hover states, active issue highlight, simple filters.

## Implementation rules

Before committing changes, verify:

- no private paths are referenced;
- no internal files are fetched;
- no raw notes are copied;
- app still works from GitHub Pages root;
- all visible text is Italian-first;
- caveats remain visible;
- source links open externally.

## Suggested PR / commit summary format

```markdown
## What

Short description of visual/UX change.

## Why

How it improves the public procedural observatory.

## Safety / methodology checks

- Reads only public exports.
- No raw notes exposed.
- Caveats visible.
- Italian-first labels preserved.

## Testing

- Checked page loads from GitHub Pages path.
- Checked JSON fetch paths.
- Checked responsive layout.
```
