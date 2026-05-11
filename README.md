# Hydra Public

Hydra Public è il prototipo pubblico dell’osservatorio processuale Hydra.

Il repository serve a rendere navigabili, in forma pubblica e metodologicamente prudente, timeline, questioni processuali, fonti, evidenze e relazioni documentali.

## Frontend canonico

Il frontend pubblico attivo è la dashboard statica:

```text
index.html
app.js
styles.css
network-enhancements.js
network-focus-bridge.js
```

Il materiale React/Vite eventualmente presente sotto `src/` è sperimentale e non costituisce il frontend pubblico canonico.

## Path dati canonico

La dashboard statica legge gli export pubblici da:

```text
data/exports/public/
  public_timeline.json
  public_hearings.json
  public_issues.json
  public_sources.json
  public_network.json
  public_evidence.json
```

Questi export devono contenere solo dati pubblicabili, caveat e stati di qualità.

## Network

La sezione Network usa `vis-network` via CDN e rappresenta relazioni processuali e documentali.

Non rappresenta:

- responsabilità penali;
- appartenenze criminali accertate;
- conclusioni giudiziarie.

La modalità espansa e i controlli di navigazione sono gestiti da:

```text
network-enhancements.js
```

Il focus bridge del network è gestito da:

```text
network-focus-bridge.js
```

## Validazione statica

Prima di ogni modifica rilevante eseguire:

```bash
python scripts/validate_static_dashboard.py
```

Lo script verifica:

- presenza dei file canonici;
- validità degli export JSON;
- coerenza del network;
- edge senza nodi mancanti;
- presenza di caveat e quality status;
- presenza dei moduli network canonici.

La validazione è anche eseguita da GitHub Actions:

```text
.github/workflows/validate-static-dashboard.yml
```

## Smoke test browser automatico

Il repository include anche uno smoke test browser-side con Playwright:

```text
scripts/browser_smoke_test.mjs
.github/workflows/browser-smoke-test.yml
```

Lo smoke test verifica in modo automatico:

- caricamento della dashboard;
- assenza di errori console bloccanti;
- presenza della sezione Network;
- rendering del canvas `vis-network`;
- assenza di canvas duplicati;
- caveat della rete;
- funzionamento base della modalità espansa;
- chiusura con `Escape`;
- fallback card del network.

Lo smoke test non sostituisce il QA manuale, ma intercetta regressioni browser-side gravi.

## QA browser-side manuale

La validazione statica e lo smoke test automatico non sostituiscono il controllo reale in browser.

Protocollo:

```text
docs/browser_qa_protocol.md
```

Template report:

```text
docs/browser_qa_report_template.md
```

Issue template:

```text
.github/ISSUE_TEMPLATE/browser_qa_report.md
```

Flusso consigliato:

```text
1. eseguire python scripts/validate_static_dashboard.py
2. verificare che lo smoke test automatico passi
3. aprire la dashboard pubblica in browser
4. seguire docs/browser_qa_protocol.md
5. compilare docs/browser_qa_report_template.md o aprire una issue QA
6. riportare eventuali fix in issue dedicate
```

Il QA deve verificare:

- caricamento della pagina;
- errori console;
- caricamento degli export;
- rendering del network;
- click su nodi e relazioni;
- modalità espansa;
- tasto Escape;
- layout mobile;
- caveat e badge qualità.

## Regole anti-caos

- Non migrare a React/Vite senza issue esplicita.
- Non creare frontend paralleli.
- Non duplicare i path dati pubblici.
- Non pubblicare transcript raw.
- Non rimuovere caveat metodologici.
- Non usare linguaggio accusatorio nel network.
- Non introdurre nuove dipendenze oltre quelle approvate.

## Linguaggio pubblico

Usare formulazioni prudenti:

- “relazioni processuali e documentali”;
- “solleva questione”;
- “è oggetto di contestazione”;
- “emerge in udienza”;
- “da verificare”.

Evitare:

- “criminal network”;
- “appartiene a”;
- “responsabile di”;
- “colpevole”.

## Stato attuale

La dashboard statica contiene:

- timeline;
- temi/questioni processuali;
- network interattivo;
- modalità network espansa;
- focus bridge del network;
- evidenze;
- udienze;
- fonti;
- metodologia.

Le prossime priorità sono:

1. completare QA browser-side;
2. verificare smoke test e correggere regressioni;
3. rifinire la navigazione della rete;
4. consolidare il focus mode;
5. migliorare filtri semantici;
6. sincronizzare timeline e network.
