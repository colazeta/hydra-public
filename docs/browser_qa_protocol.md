# Hydra Public — browser QA protocol

## Purpose

This protocol verifies the runtime behaviour of the canonical static dashboard.

The static validator checks repository structure and JSON consistency. Browser QA checks what cannot be verified statically:

- rendering;
- CDN loading;
- network interactivity;
- mobile layout;
- user navigation;
- console errors.

## Canonical frontend

The active public frontend is:

```text
index.html
app.js
styles.css
network-enhancements.js
data/exports/public/public_*.json
```

The `src/` React/Vite material is not currently the public frontend.

## Pre-check

Before browser testing, run:

```bash
python scripts/validate_static_dashboard.py
```

The browser QA should not start if static validation fails.

## Browser QA checklist

### 1. Page load

- [ ] Open the public dashboard URL.
- [ ] Page loads without a blank screen.
- [ ] No blocking JavaScript errors appear in the console.
- [ ] `styles.css` is loaded.
- [ ] `app.js` is loaded.
- [ ] `network-enhancements.js` is loaded.
- [ ] `vis-network` CDN is loaded.

### 2. Public exports

Verify in the network panel that these files load with HTTP 200:

- [ ] `data/exports/public/public_timeline.json`
- [ ] `data/exports/public/public_hearings.json`
- [ ] `data/exports/public/public_issues.json`
- [ ] `data/exports/public/public_sources.json`
- [ ] `data/exports/public/public_network.json`

Optional, if present:

- [ ] `data/exports/public/public_evidence.json`

### 3. Hero and metrics

- [ ] Metrics appear in the hero panel.
- [ ] Timeline density chart appears.
- [ ] Caveat box is visible.
- [ ] Quality filter chips appear.

### 4. Timeline

- [ ] Timeline cards render.
- [ ] Each card has a quality badge.
- [ ] Caveats are visible.
- [ ] Dates are shown or explicitly marked as unavailable.

### 5. Issues

- [ ] Issue cards render.
- [ ] Public labels are understandable.
- [ ] Technical/legal meaning is not overclaimed.
- [ ] Clicking issue cards does not break layout.

### 6. Network — base view

- [ ] Section Network is visible.
- [ ] Network caveat is visible.
- [ ] `#network-graph` renders a graph.
- [ ] Nodes are visible.
- [ ] Edges are visible.
- [ ] Fallback cards remain visible below the graph.
- [ ] No duplicated graph canvas appears.

### 7. Network — interactions

- [ ] Click a node.
- [ ] Detail panel updates.
- [ ] Click an edge.
- [ ] Detail panel updates.
- [ ] Click empty graph area.
- [ ] Detail panel resets or remains stable.
- [ ] No console errors occur.

### 8. Network — expanded mode

- [ ] Click `Espandi rete`.
- [ ] Network expands to near full-screen.
- [ ] Body page scroll is blocked while expanded.
- [ ] Detail panel remains visible.
- [ ] Caveat remains visible or accessible.
- [ ] Click `Riduci rete`.
- [ ] Dashboard returns to normal layout.
- [ ] Press `Escape` while expanded.
- [ ] Expanded mode closes.

### 9. Network — controls

- [ ] `Centra vista` keeps graph usable.
- [ ] `Stabilizza` reduces graph movement.
- [ ] `Reset focus` resets detail panel.
- [ ] None of these controls causes console errors.

### 10. Mobile/responsive

Test at widths around:

- [ ] 390px
- [ ] 768px
- [ ] 1024px

Verify:

- [ ] Navigation remains usable.
- [ ] Network does not overflow horizontally.
- [ ] Expanded mode remains usable.
- [ ] Detail panel stacks below or remains readable.
- [ ] Cards remain legible.

## Semantic QA

The interface must not imply that network relations are criminal responsibilities.

Check that the UI avoids:

- [ ] “criminal network”
- [ ] “belongs to”
- [ ] “responsible for”
- [ ] “guilty”

Preferred language:

- [ ] “relazioni processuali e documentali”
- [ ] “solleva questione”
- [ ] “oggetto di contestazione”
- [ ] “emerge in udienza”
- [ ] “da verificare”

## Pass criteria

Browser QA passes only if:

- static validation passes;
- dashboard loads;
- network renders;
- no blocking console errors;
- expanded mode works;
- caveats and quality badges remain visible;
- no overclaiming language is introduced.

## Failure handling

If QA fails:

1. Record the failed checklist item.
2. Record browser, viewport, console error and URL.
3. Patch only the minimal affected file.
4. Re-run static validation.
5. Re-run browser QA.
