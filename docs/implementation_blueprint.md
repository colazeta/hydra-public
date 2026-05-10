# Hydra Public — implementation blueprint

## Goal

Build a standalone public explorer for Hydra before any later integration into Oltre.

The explorer must consume static JSON datasets and expose:

- hearing overview;
- timeline;
- legal issues;
- network graph;
- quality/status legend;
- methodological caveats.

## Available datasets

```text
data/hearings/hearings.json
data/legal_issues/legal_issues.json
data/meta/quality_legend.json
data/network/nodes.json
data/network/edges.json
data/timeline/hearing_0001_timeline.json
```

## Pages

### `/`

Public landing page.

Must include:

- what Hydra is;
- what the explorer does not claim;
- dataset status;
- entry points to network, hearings and issues.

### `/udienze`

List of hearings.

Each hearing card must show:

- public title;
- date or `data da verificare`;
- quality badge;
- public summary;
- link to hearing detail.

### `/udienze/:id`

Hearing detail.

Must show:

- timeline;
- main issues;
- participants if available;
- methodological note;
- quality state.

### `/questioni`

Legal issues explorer.

Must show:

- public label;
- technical label optionally collapsed;
- summary;
- quality status;
- connected nodes/edges if available.

### `/network`

Network explorer.

Must render:

- nodes;
- edges;
- node type legend;
- quality status legend;
- side panel on node/edge selection.

Important: the network must be described as a procedural/documentary graph, not as a map of criminal responsibility.

### `/metodo`

Methodological page.

Must explain:

- raw vs reviewed vs verified;
- what `partial_review` means;
- what an edge means;
- why public labels differ from technical labels.

## Components

```text
components/
  QualityBadge.tsx
  QualityLegend.tsx
  HearingCard.tsx
  HearingTimeline.tsx
  LegalIssueCard.tsx
  NetworkGraph.tsx
  MethodWarning.tsx
```

## Data loading

Static import or fetch from `/data/...` depending on framework.

The UI must fail safely:

- if a node referenced by an edge is missing, show a validation warning;
- do not silently drop broken edges;
- do not render broken data as verified.

## Visual language

Hydra Public should be:

- sober;
- investigative;
- readable;
- non-sensationalistic;
- graphically strong but methodologically restrained.

## Mandatory public warnings

Every page using raw or partially reviewed data should show:

> Questa ricostruzione deriva da materiali in revisione. Non sostituisce atti, verbali o decisioni ufficiali.

For graph pages:

> Il grafo mostra relazioni processuali e documentali. Non rappresenta responsabilità penali né appartenenze criminali accertate.

## Initial acceptance criteria

- All available JSON datasets are loaded.
- Quality badges are visible.
- Network graph renders without broken IDs.
- Hearing timeline renders in sequence.
- Legal issues are readable through public labels.
- Methodological warning is visible in network and hearing detail pages.
