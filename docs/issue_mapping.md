# Open Issue Mapping (Hydra Public Frontend)

## Implemented in this branch

- #18 Implementare filtri semantici minimi nel network statico
  - ✅ Implemented: network semantic filters (`all`, `type:*`, `edges`).

- #17 Rifinire network interattivo: filtri semantici, pannello evidenza e anti-overclaiming
  - ✅ Implemented: anti-overclaiming guard in network detail panel + semantic filter UX.

- #16 Verificare network interattivo vis-network e correggere regressioni UI
  - ✅ Implemented partial + QA automation:
    - `check:network-qa` for node/edge integrity and caveat presence.
    - release QA chain includes network checks.

- #14 Hardening dashboard statica: dati canonici, network layer e blocco caos frontend
  - ✅ Implemented partial:
    - `check:exports` and stricter network shape validation.
    - consolidated release QA script.

## Closure candidates (validated in current static scope)

- #13 Stabilizzare struttura frontend (dup static/prototype React)
  - ✅ Closed in current scope: ADR + stricter structure QA guard + canonical route lock in `config/routes.json`.

- #12 Explorer investigativo multi-layer
  - ✅ Closed in current scope: layer timeline/hearings/issues/network/evidence attivi con QA dedicata e validazione sezioni statiche canoniche.

- #11 Collegare HydraExplorerPrototype al routing reale e verificare build
  - ✅ Closed in current scope: route prototype canonicale verificata da `check:prototype-route` (contenuto stub, backlink statico, anti-coupling React entry).

- #10 Implementare explorer network+timeline da dataset pubblici JSON
  - ✅ Closed in current scope: network+timeline+hearings+sources/evidence verificati da `check:multilayer-qa` con controlli su sezioni, renderer e dataset pubblici.

- #9 Explorer pubblico Hydra: prototipo autonomo
  - ✅ Implemented partial: route prototype dedicata con QA di autonomia (`check:prototype-autonomy-qa`) e guardrail di separazione runtime.

- #1 Major visual redesign
  - ✅ Implemented partial: redesign baseline consolidata (chips/states/network guard/evidence styling) con gate `check:redesign-qa`.
