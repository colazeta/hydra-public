# Open issues audit — 2026-05-13

Questo audit valuta una per una le issue note nel repository (`docs/issue_mapping.md`) e ne propone lo stato operativo in base all'evidenza locale (QA scripts + workflow + documentazione).

## Esito sintetico

- Totale issue tracciate localmente: **10**
- Implementate/chiudibili operativamente: **10/10**
- Residuo tecnico bloccante rilevato localmente: **nessuno**

Fonte metrica: `npm run check:issue-progress`.

## Valutazione per issue

### #28 — Pipeline agentica autonoma per audit UX, CI e deployment
- Stato: **Chiudibile**.
- Evidenza:
  - pipeline dedicata presente (`agentic-autonomous-pipeline.yml`);
  - deploy agganciato al successo pipeline (`deploy-pages.yml` via `workflow_run`);
  - documentazione aggiornata in `README.md`.

### #18 — Filtri semantici minimi network statico
- Stato: **Chiudibile**.
- Evidenza: filtri `all`, `type:*`, `edges` + QA export/network.

### #17 — Rifinitura network interattivo (filtri, evidenza, anti-overclaiming)
- Stato: **Chiudibile**.
- Evidenza: pannello evidenza con caveat e filtro semantico UX.

### #16 — Regressioni UI vis-network
- Stato: **Chiudibile**.
- Evidenza: gate `check:network-qa` e inclusione nel release QA.

### #14 — Hardening dashboard statica
- Stato: **Chiudibile operativamente**.
- Evidenza: `check:exports`, validazione shape network, controllo struttura frontend.

### #13 — Stabilizzare struttura frontend (dup static/prototype)
- Stato: **Chiudibile per lo scope statico corrente**.
- Evidenza: ADR + guard automatiche (`check:frontend-structure`, metadata route canonica).

### #12 — Explorer investigativo multi-layer
- Stato: **Chiudibile per MVP corrente**.
- Evidenza: layer timeline/hearings/issues/network/evidence + QA multilayer.

### #11 — Collegare HydraExplorerPrototype al routing reale e build
- Stato: **Chiudibile per scope corrente**.
- Evidenza: route canonicale + `check:prototype-route`; readiness classificata `READY_STATIC`.

### #10 — Explorer network+timeline da export JSON pubblici
- Stato: **Chiudibile**.
- Evidenza: rete+timeline operative con filtri, rendering evidenze, QA `check:multilayer-qa`.

### #9 — Explorer pubblico Hydra: prototipo autonomo
- Stato: **Chiudibile**.
- Evidenza: route prototype con QA autonomia (`check:prototype-autonomy-qa`).

### #1 — Major visual redesign
- Stato: **Chiudibile baseline**.
- Evidenza: redesign baseline consolidata con gate `check:redesign-qa`.

## Nota operativa su chiusura GitHub

L'audit qui determina lo stato tecnico locale. La chiusura formale delle issue su GitHub deve essere effettuata via interfaccia/API GitHub dal maintainer.
