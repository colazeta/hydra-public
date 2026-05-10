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

## Remaining (outside current static-scope closure)

- #13 Stabilizzare struttura frontend (dup static/prototype React)
  - ✅ Implemented partial: ADR + structure QA guard + canonical route metadata; full unification still pending in dedicated migration PR.

- #12 Explorer investigativo multi-layer
  - ✅ Implemented partial: superficie multi-layer attiva (timeline, hearings, issues, network, evidence) con QA dedicata; restano iterazioni di redesign.

- #11 Collegare HydraExplorerPrototype al routing reale e verificare build
  - ✅ Implemented partial: route canonicale + `check:prototype-route` attivo; build classificata `READY_STATIC` con bundler demandato a fase CI/toolchain.

- #10 Implementare explorer network+timeline da dataset pubblici JSON
  - ✅ Implemented partial: network+timeline layer attivo con filtri semantici, rendering evidenze e QA `check:multilayer-qa`.

- #9 Explorer pubblico Hydra: prototipo autonomo
  - ✅ Implemented partial: route prototype dedicata con QA di autonomia (`check:prototype-autonomy-qa`) e guardrail di separazione runtime.

- #1 Major visual redesign
  - ✅ Implemented partial: redesign baseline consolidata (chips/states/network guard/evidence styling) con gate `check:redesign-qa`.
