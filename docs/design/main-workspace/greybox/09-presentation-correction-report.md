# 09 — Desktop-First Presentation Correction Report

**Mission:** owner-directed correction & review of the VF-1 presentation (2026-11-20). Desktop 1920×1080 is the primary acceptance viewport; mobile secondary. **Status: COMPLETE — awaiting owner visual approval.** Scope: presentation of `/` only; no geometry/camera/reference change.

## 1. Root cause (identified before any change)

The screenshot the owner reported (red markers, cyan points, green labels, large black areas) is the **dev inspector view**, not the clean workspace route. Reproduced exactly from the production bundle (`pres-before-LEAK-querydev-1920x1080.png`). The inspector was reachable from `/` by:

1. **The `?dev` query parameter** — `isDevRoute()` (`src/App.tsx`) accepted `location.search`. Vercel's SSO deployment-protection redirect preserves query strings, so the preview URL used with `?dev` (or a link/bookmark carrying it) silently loaded the inspector on the primary route. This is the exact leak path behind the owner's screenshot.
2. **The bottom-left production link** "Structural greybox (WORA-3D-GREYBOX-004) · open dev inspector" (`<a href="#/dev">` rendered on `/` in production).

In the inspector view: red × = measured reference px (`#ff3b3b`), teal ●/green labels = projected world points + marker IDs (`#21e6c1`/`#7fdcff`), orange dashed = slab-edge lines, black bands = the inspector's "Reference 1672:941" stage letterbox. **None of these exist on the clean `/` route** — verified by before-captures at all four desktop viewports.

## 2. Desktop framing analysis (no camera change made)

Instrument readback (production bundle, `window.__WORA_CAMERA__`):

| Viewport | FOV rule | vFOV | Result |
|---|---|---|---|
| 1920×1080 (mandatory) | `reference` (Δaspect 0 < 0.001) | 12.0006° | HOME camera exactly; full-bleed; complete composition |
| 2560×1440 | `reference` | 12.0006° | identical composition, larger canvas |
| 1440×900 | `keep-vertical` | 12.0006° | designed top/bottom reveal, safe rect intact |
| 1366×768 | `reference` (Δaspect 0.0008) | 11.9885° | HOME composition |

The canvas is `position:fixed; inset:0` (full-bleed) — **no letterbox exists on `/`**; the black bands belong to the inspector's reference-frame stage. Nothing clipped, no stretch (per-aspect FOV math), scene uses the full workspace. Per the owner's instruction the cause was identified first: **the camera/framing is correct and was not modified.**

## 3. Exact files changed

- `apps/workspace/src/App.tsx` — `isDevRoute()` accepts only the explicit `#/dev` hash; `?dev` query activation removed (SSO-redirect leak); the "open dev inspector" link removed; `/` renders the clean workspace only.
- `apps/workspace/src/dev/DevInspector.tsx` — doc-note updated; **"Exit to workspace (/)"** button added (clears the hash). All inspection capabilities preserved (panel, markers, slab edges, occluders, layers, flat mode, rendered check, orbit, reset).
- `docs/design/main-workspace/greybox/review/` — PRES evidence section + 11 screenshots; `index.html` updated. This report.
- No other files. Tests untouched (56/56 pass unchanged).

## 4. Evidence

Before/after and all four desktop resolutions: `greybox/review/index.html` § PRES (PRES-before/after-*.png), incl. the reproduced leak state, the fixed `?dev` state, the preserved `#/dev` inspector, and the mandatory clean 1920×1080 shot. Readbacks: after-fix `?dev` → devPanel=false, markers=false, stage=false; `#/dev` → devPanel=true, markers=true (capabilities intact).

## 5. Validation

tsc clean · vitest 56/56 · build ✓ · check-dist OK · reference checksum OK pre/post · flat-mode rendered check unchanged. PR #1 open, **not merged**. VF-2+ not started. Mobile: untouched (secondary; safe-rect responsive rule preserved for basic usability).

**Stopped — awaiting owner visual approval.**
