# Hydra Public — data validation rules

## Purpose

Hydra Public exposes partially reconstructed judicial and documentary material.

Validation rules exist to:

- reduce accidental misinformation;
- avoid silent corruption of the graph;
- distinguish raw from reviewed information;
- improve public readability.

## Validation categories

### Structural validation

Checks:

- node IDs uniqueness;
- edge IDs uniqueness;
- missing source/target nodes;
- missing quality status;
- invalid date formats.

### Semantic validation

Checks:

- presence of public labels;
- consistency between technical/public labels;
- unsupported edge types;
- undocumented node categories.

### Public-facing validation

Checks:

- warning banners visible;
- contested data clearly marked;
- no graph rendered entirely as verified by default.

## Quality states

| Status | Meaning |
|---|---|
| verified | Cross-checked against available documentary material |
| reviewed | Human-reviewed but still partial |
| partial_review | Some components reviewed, others pending |
| raw | Raw extraction or raw transcription |
| to_verify | Requires additional verification |
| contested | Information disputed or uncertain |

## Edge interpretation

Edges do NOT imply:

- criminal responsibility;
- stable affiliation;
- judicial certainty.

Edges represent:

- procedural references;
- co-occurrence in hearings;
- documentary links;
- declared interactions;
- legal relationships.

## Public communication principles

Hydra Public must:

- avoid sensationalism;
- avoid visual overclaiming;
- separate facts from interpretation;
- keep uncertainty visible.

## Required warnings

### Global warning

> Questa ricostruzione deriva da materiali in revisione. Non sostituisce atti, verbali o decisioni ufficiali.

### Graph warning

> Il grafo mostra relazioni processuali e documentali. Non rappresenta responsabilità penali né appartenenze criminali accertate.
