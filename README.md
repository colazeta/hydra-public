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
- presenza di caveat e quality status.

La validazione è anche eseguita da GitHub Actions:

```text
.github/workflows/validate-static-dashboard.yml
```

## QA browser-side

La validazione statica non sostituisce il controllo reale in browser.

Protocollo:

```text
docs/browser_qa_protocol.md
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
- evidenze;
- udienze;
- fonti;
- metodologia.

Le prossime priorità sono:

1. completare QA browser-side;
2. rifinire la navigazione della rete;
3. consolidare il focus mode;
4. migliorare filtri semantici;
5. sincronizzare timeline e network.
