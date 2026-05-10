# Hydra Public Frontend – Release Checklist (Closure)

## Functional scope
- [x] Italian-first UI and dynamic label localization applied.
- [x] Source chips available on timeline and hearings.
- [x] Empty-state and load-error caveat messaging across all data sections.
- [x] Issue-driven highlighting, keyboard interactions, and subtle card states.
- [x] Network section has explicit empty fallback.

## Data integrity
- [x] Public export validator available (`npm run check:exports`).
- [x] Current public exports pass validator.

## Tooling
- [x] TypeScript smoke-check script available (`npm run check:tsc-smoke`).
- [x] Current smoke-check passes.

## Residual blocker
- [ ] Full bundle build (`npm run build`) when dependency registry access is unavailable in environment.
  - This is infra/policy-dependent and not an application logic defect.
