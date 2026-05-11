# Hydra Public — browser QA report template

Use this report after running `docs/browser_qa_protocol.md`.

## Test metadata

- Tester:
- Date:
- Repository commit SHA:
- Public URL tested:
- Browser:
- Browser version:
- Operating system:
- Viewports tested:
  - desktop:
  - tablet:
  - mobile:

## Static validation

Before browser testing, run:

```bash
python scripts/validate_static_dashboard.py
```

Result:

- [ ] Passed
- [ ] Failed

Notes:

```text

```

## Page load

- [ ] Page loads without blank screen.
- [ ] `styles.css` loads.
- [ ] `app.js` loads.
- [ ] `network-enhancements.js` loads.
- [ ] `vis-network` CDN loads.
- [ ] No blocking console errors.

Console errors/warnings:

```text

```

## Public JSON exports

- [ ] `public_timeline.json` loads.
- [ ] `public_hearings.json` loads.
- [ ] `public_issues.json` loads.
- [ ] `public_sources.json` loads.
- [ ] `public_network.json` loads.
- [ ] `public_evidence.json` behaviour acceptable if absent or empty.

Network status codes / failed requests:

```text

```

## Main dashboard

- [ ] Hero metrics render.
- [ ] Timeline density renders.
- [ ] Timeline cards render.
- [ ] Issue cards render.
- [ ] Hearing cards render.
- [ ] Source cards render.
- [ ] Methodology section renders.
- [ ] Caveats remain visible.
- [ ] Quality badges remain visible.

Notes:

```text

```

## Network base view

- [ ] Network section visible.
- [ ] Network caveat visible.
- [ ] `#network-graph` renders.
- [ ] Nodes visible.
- [ ] Edges visible.
- [ ] No duplicated canvas/graph.
- [ ] Fallback network cards remain visible.

Notes:

```text

```

## Network interactions

- [ ] Click node updates detail panel.
- [ ] Click edge updates detail panel.
- [ ] Click empty graph area does not break UI.
- [ ] `Centra vista` works or degrades safely.
- [ ] `Stabilizza` works or degrades safely.
- [ ] `Reset focus` works or degrades safely.

Notes:

```text

```

## Expanded network mode

- [ ] `Espandi rete` enters expanded mode.
- [ ] `Riduci rete` exits expanded mode.
- [ ] `Escape` exits expanded mode.
- [ ] Body scroll is blocked while expanded.
- [ ] Detail panel remains visible/readable.
- [ ] Caveat remains visible/accessibile.
- [ ] Graph remains usable after resize.

Notes:

```text

```

## Responsive/mobile

### Desktop

- [ ] Layout stable.
- [ ] Network usable.
- [ ] Detail panel readable.

### Tablet

- [ ] Layout stable.
- [ ] Network usable.
- [ ] Detail panel readable.

### Mobile

- [ ] No horizontal overflow.
- [ ] Network still usable.
- [ ] Expanded mode usable.
- [ ] Detail panel readable.

Notes:

```text

```

## Semantic and methodological QA

- [ ] No language implying guilt/responsibility.
- [ ] Network described as procedural/documentary.
- [ ] Caveats visible near graph.
- [ ] Quality statuses visible.
- [ ] Raw/unverified information not presented as verified.

Problematic wording found:

```text

```

## Result

- [ ] Pass
- [ ] Pass with minor issues
- [ ] Fail

## Required fixes

| Priority | Issue | File | Suggested fix |
|---|---|---|---|
| High |  |  |  |
| Medium |  |  |  |
| Low |  |  |  |

## Final notes

```text

```
