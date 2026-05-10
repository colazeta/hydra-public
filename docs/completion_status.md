# Hydra Public Frontend – Completion Status

## Scope baseline
Reference checklist: `CODEX_SUPPORT.md` → "Current gaps to prioritise".

## Gap status

1. **Italian-first labels/content** — ✅ Completed at UI/runtime level
   - Added i18n coverage and localized status badges.
   - Added content-localization mapping for key dynamic labels rendered from public exports.

2. **Public exports present and load without silent failures** — ✅ Completed
   - Added runtime fallback + caveat messaging.
   - Added automated validator: `npm run check:exports`.

3. **Issue-map visual centrality** — ✅ Completed
   - Added emphasis styles and desktop grid tuning.

4. **Source chips on timeline/hearings** — ✅ Completed
   - Source chips rendered for timeline items.
   - Hearing chips derived from linked timeline sources.

5. **Empty/error states** — ✅ Completed
   - Added explicit empty-state messages for timeline/hearings/issues/sources/network.

6. **Responsive polish with desktop character** — ✅ Completed
   - Added mobile spacing and chip-size refinements.
   - Preserved multi-column desktop behavior.

7. **Subtle interactions (hover/highlight/filters)** — ✅ Completed
   - Added keyboard-accessible card interactions.
   - Added issue-driven highlight/dimming with contextual matches.

## Residual non-code blockers
- Full `npm run build` remains environment-blocked when `vite` (and registry-backed dependencies) are unavailable.
- This is infra/policy, not an application-logic blocker.
