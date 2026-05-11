# Agent instructions for Hydra Public

## Project role

`hydra-public` is the public static explorer for Hydra.

It exposes a cautious, source-aware, public-facing observatory of procedural/documentary information. It is not a criminal responsibility graph and must never present relations as findings of guilt.

## Canonical frontend

The active frontend is the static dashboard:

```text
index.html
app.js
styles.css
network-enhancements.js
```

Do not introduce or expand a parallel React/Vite frontend unless an explicit migration issue is opened and approved.

The `src/` directory, if present, is experimental and not the canonical public app.

## Canonical public data path

The dashboard reads public exports from:

```text
data/exports/public/
  public_timeline.json
  public_hearings.json
  public_issues.json
  public_sources.json
  public_network.json
  public_evidence.json
```

Do not create alternative public data paths unless required by an explicit issue.

## Mandatory safeguards

Every public-facing feature must preserve:

- methodological caveats;
- quality/status labels;
- non-accusatory wording;
- distinction between fact, claim, request, contestation, source and verification.

Avoid these formulations:

- criminal network;
- belongs to;
- responsible for;
- guilty;
- linked criminally.

Prefer these formulations:

- procedural/documentary relations;
- raises an issue;
- is the object of a request;
- emerges in a hearing;
- pending verification.

## Network rules

The network is procedural/documentary.

Edges must not imply:

- criminal responsibility;
- proven affiliation;
- judicial certainty.

Every network node/edge should have:

- `id`;
- public label;
- type or relation label;
- quality status;
- caveat/provenance where available.

Do not render an edge if its source or target node is missing.

## Validation before changes

Before opening or completing a PR, run:

```bash
python scripts/validate_static_dashboard.py
```

If the change affects layout, network, static data, or rendering, complete browser QA using:

```text
docs/browser_qa_protocol.md
docs/browser_qa_report_template.md
```

## Allowed small changes

Safe changes include:

- improving `styles.css` while preserving existing classes;
- adding public JSON records under `data/exports/public/`;
- improving `app.js` rendering with fallback behaviour;
- improving `network-enhancements.js` without replacing `app.js`;
- improving documentation and QA protocols.

## Changes requiring explicit issue approval

Do not do these without a dedicated issue:

- migrate to React/Vite;
- introduce additional frontend frameworks;
- introduce new network libraries beyond `vis-network`;
- change public JSON schemas;
- publish raw transcripts;
- remove caveats, quality labels or anti-overclaiming language;
- alter the meaning of edge types.

## PR requirements

Use `.github/pull_request_template.md`.

Each PR should state:

- what changed;
- which layer is affected;
- static validation result;
- browser QA status if relevant;
- whether public JSON contracts changed;
- whether network semantics changed.
