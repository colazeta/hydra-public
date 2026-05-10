# ADR: Static Dashboard vs React Prototype Separation

## Status
Accepted (current repository baseline)

## Decision
- `index.html` + `app.js` + `styles.css` are the canonical public static dashboard runtime.
- `src/pages/HydraExplorerPrototype.tsx` remains a prototype track and is not the live static entrypoint.
- Static and prototype layers must not import each other at runtime.

## Rationale
- Preserve deployability of the static dashboard without requiring full React bundling.
- Allow prototype iteration in parallel without destabilizing the public static observatory.

## Guardrails
- `npm run check:frontend-structure` must pass.
- `npm run check:release-qa` must pass.
- Future routing unification work (#11/#13) should happen in a dedicated migration PR.
