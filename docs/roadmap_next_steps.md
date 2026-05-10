# Roadmap Next Steps (Post-Hardening)

## Objective
Close the remaining non-hardened issue cluster after static dashboard stabilization.

## Phase 1 — Repository structure stabilization (#13)
- Define canonical app entrypoints (static vs prototype).
- Decide ownership boundaries (`/` static, `/src` prototype) and document migration policy.
- Acceptance criteria:
  - no duplicate rendering paths for the same section,
  - `check:frontend-structure` passes,
  - docs updated with architecture decision.

## Phase 2 — Prototype routing/build integration (#11)
- Wire `HydraExplorerPrototype` into real routing strategy.
- Validate bundling in CI environment with dependencies available.
- Acceptance criteria:
  - route accessible and tested,
  - `npm run build` green in CI,
  - smoke checks include route-level verification.

## Phase 3 — Multi-layer explorer evolution (#12/#10/#9/#1)
- Introduce network + timeline + evidence panel orchestration.
- Define anti-overclaiming governance in UX copy and interactions.
- Align visual redesign with data quality constraints and public methodology.
- Acceptance criteria:
  - design sign-off,
  - regression QA on network/timeline interactions,
  - governance caveats visible in all relevant views.

## Known blocker
- Local environment may block dependency retrieval/build (`vite`/registry policy).
- This does not block static hardening QA but blocks full bundling verification.
