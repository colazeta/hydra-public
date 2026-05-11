---
name: Browser QA report
description: Report a browser-side QA result for the Hydra Public static dashboard
title: "Browser QA: <date> <browser>"
labels: [qa, browser-check-required, static-dashboard]
---

## Test metadata

- Date:
- Tester:
- Public URL tested:
- Commit SHA:
- Browser and version:
- Operating system:
- Viewports tested:
  - Desktop:
  - Tablet:
  - Mobile:

## Static validation

Command:

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
- [ ] No blocking console errors.
- [ ] `styles.css` loads.
- [ ] `app.js` loads.
- [ ] `network-enhancements.js` loads.
- [ ] `vis-network` CDN loads.

Console errors/warnings:

```text

```

## Public exports

- [ ] `public_timeline.json` loads.
- [ ] `public_hearings.json` loads.
- [ ] `public_issues.json` loads.
- [ ] `public_sources.json` loads.
- [ ] `public_network.json` loads.
- [ ] `public_evidence.json` behaviour acceptable if absent/empty.

Failed requests:

```text

```

## Network QA

- [ ] Network section visible.
- [ ] Network caveat visible.
- [ ] Graph renders.
- [ ] Nodes visible.
- [ ] Edges visible.
- [ ] No duplicated canvas/graph.
- [ ] Click node updates detail panel.
- [ ] Click edge updates detail panel.
- [ ] Fallback cards remain visible.

Notes:

```text

```

## Expanded network mode

- [ ] `Espandi rete` works.
- [ ] `Riduci rete` works.
- [ ] `Escape` closes expanded mode.
- [ ] Detail panel remains readable.
- [ ] Graph remains usable after resize.

Notes:

```text

```

## Mobile/responsive

- [ ] No horizontal overflow.
- [ ] Navigation usable.
- [ ] Network usable.
- [ ] Detail panel readable.
- [ ] Expanded mode usable.

Notes:

```text

```

## Methodological/semantic QA

- [ ] No wording implying guilt or criminal responsibility.
- [ ] Network is described as procedural/documentary.
- [ ] Caveats remain visible.
- [ ] Quality badges remain visible.
- [ ] Raw/unverified information is not presented as verified.

Problematic wording, if any:

```text

```

## Result

- [ ] Pass
- [ ] Pass with minor issues
- [ ] Fail

## Required fixes

| Priority | Issue | File/path | Suggested fix |
|---|---|---|---|
| High |  |  |  |
| Medium |  |  |  |
| Low |  |  |  |
