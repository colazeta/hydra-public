# Hydra Public frontend architecture

## Stato attuale

Il frontend canonico attivo di `hydra-public` è la dashboard statica composta da:

```text
index.html
app.js
styles.css
```

Questa dashboard carica i dati pubblici dal path canonico:

```text
data/exports/public/
  public_timeline.json
  public_hearings.json
  public_issues.json
  public_sources.json
```

## Regola architetturale

Finché non viene presa una decisione esplicita di migrazione, la dashboard statica resta il layer pubblico canonico.

Il materiale in:

```text
src/
```

va considerato sperimentale/non montato. Non deve essere trattato come frontend pubblico attivo.

## Implicazioni operative

- Nuove funzionalità pubbliche devono prima essere integrate nella dashboard statica.
- I nuovi dataset pubblici devono essere collocati sotto `data/exports/public/`.
- Non aggiungere ulteriori componenti React senza una issue di migrazione approvata.
- Non duplicare i path dati se esiste già un export canonico.
- Non cambiare routing o build senza verificare che la dashboard online continui a funzionare.

## Prossime estensioni ammesse

Sono compatibili con l’architettura attuale:

- `public_network.json` per il network minimale;
- legenda qualità nel frontend statico;
- sezione network in `index.html`;
- rendering di nodi/relazioni in `app.js`;
- documentazione dei caveat.

## Prossime estensioni non ammesse senza decisione esplicita

- migrazione a Vite/React;
- router parallelo;
- duplicazione dei dataset in nuovi path non canonici;
- rimozione dei caveat metodologici;
- pubblicazione di transcript raw.
