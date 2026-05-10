# Public network explorer

## Objective

The public explorer should allow users to navigate:
- procedural relations;
- hearings;
- legal issues;
- defence motions;
- institutional actors.

The explorer is NOT a criminal affiliation map.

## Required safeguards

Every node and edge must expose:
- quality state;
- provenance;
- semantic type;
- public-readable explanation.

## Required UI distinctions

The interface must clearly distinguish:
- allegations;
- procedural requests;
- judicial decisions;
- institutional participation;
- investigative hypotheses.

## Initial datasets

Explorer currently consumes:
- `data/network/nodes.json`
- `data/network/edges.json`

These are generated from the canonical Hydra repository.

## Recommended future filters

- hearing;
- legal issue category;
- quality state;
- procedural role;
- hearing date;
- institution;
- detention status;
- remote participation.

## Important warning

Presence inside the graph does not imply:
- guilt;
- criminal membership;
- judicial responsibility.

The graph represents procedural and documentary relations extracted from hearings and judicial materials.
