# 06 — Mission 006-A Report: Environment Specialist (WORA-3D-SCENE-006-A)

> Status: **COMPLETE — awaiting owner review.** Branch `arena/e6096316-wora-os`; PR #1 open, **not merged**. 006-B (robots) and 006-C (furniture) **not started**, per instruction.
> Baseline honoured: the Mission 005 owner decisions (`04-correction-plan.md` §0) and the binding constraints in `05-scene-building-plan.md` §1.

## 1. Scope executed (006-A only)

| Item | Delivered |
|---|---|
| Fascia band (ENV-014/015) | Wedge-shaped band under both visible slab edges, bottoms from **least-squares fits** of the measured reference step (probe 2026-11-20): +Z `y = −0.7492 − 0.0646x` (rms 0.007 m), +X `y = −0.8983 − 0.1469z` (rms 0.013 m), vanishing on +X for z ≤ −6.114 (the documented M004 crossing). Straight est. bands (0.45 m) on the ND −X/−Z edges |
| Curtain wall + facade | Glazing below the fascia to −11.3 m with **0.96 m mullion bays** (measured ≈50 px at ≈52 px/m) and 2.0 m transoms (est.); facade tone `#4E5260` (scene.facade family) |
| Back exterior walls | Glass wall (partition glass, partition-height est.) + slender mullions on −X and −Z above the floor; no doors (Q-3D-01) |
| Balustrade styling | Anthracite top rail + slender posts at 2.4 m bays (est.; reference reads as glass with a thin rail) |
| Plinth details | Emissive rim ring (scene.plinth-rim tone, no bloom — Q-3D-07 decided **emissive, bloom = art pass**), canvas-drawn interlocking-W mark (ENV-003, gradient colours est.) and `WORA` wordmark (ENV-004) at their back-projected world positions |
| Sign faces | Catalogued text + icon glyph on all 7 plates (canvas textures), text auto-fitted inside the plate; plate geometry untouched (CR-05/CR-06) |
| Light strips | 28 partition-top strips + 2 slab-edge base strips (analysis/03 §9), unlit emissive |
| Backdrop scenery (CR-02) | City backdrop cards, two terrace-parapet bands (with light strip), 7 greenery canopy discs, one large outdoor tree at the bottom-right frame edge — all placed by back-projection onto **assumed** scenery planes (projects back to its reference pixels in HOME by construction) |
| Lighting | LGT-01 mood (cool sky / warm ground), LGT-02 key from upper right (shadows fall lower-left in tone) |
| Materials | Palette moved to measured tones (atrium marble sample `#B4A1A5`, sign plate `#131B29`, fascia sample `#C8C2CB`, frame `#353A40` …) |

## 2. Explicitly NOT done (scope boundary)

- **No robots** (006-B), **no furniture** (006-C): no robot mesh, no desk/chair/plant/sofa/rug/monitor/shelf exists in the scene; the 47 robots remain data-only markers in the dev inspector (tests pin this).
- No doors, no extra rooms, no invented building areas; slab extents unchanged (−17.18 / −15.3 … 14.6 / 13.91).
- No final materials/textures: tones and canvas text only; no bloom/post-processing; no decorative effects.
- No UI changes; the 24 AI Employees label and 47 robot count untouched (guard tests green).
- ENV-017 (right terrace greenery at px ≈ 1570, 380) is **omitted**: its screen ray cannot be placed at a consistent 3D location (frame periphery); documented rather than invented.

## 3. Data and code changes (schema v1 → v2)

- `architecture/data/scene-architecture.json`: schema bump + new `environment` section (fascia fits, glazing bays, backdrop planes/world points with px provenance, plinth label geometry, strip/frame conventions). All estimates are marked est./assumed in the JSON.
- `src/config/sceneConfig.ts` (schema gate v2, `ENV`, fascia profile functions), `src/config/referencePoints.ts` (22 measured fascia-step samples with exact edge-plane u).
- `src/scene/environment.ts` (new): pure descriptor builders; `src/scene/model.ts`: new spec types (`RibbonSpec`, `DiscSpec`, `LabelSpec`) + 9 environment material keys. Core structural model untouched.
- `src/scene/Greybox.tsx` (ribbon/disc/label renderers + layers `fascia|strips|backdrop`), `src/scene/materials.ts` (measured palette, unlit emissive keys, flat-mode IDs), `src/scene/Lights.tsx` (LGT-01/02), `src/dev/DevInspector.tsx` (new layer flags).
- `src/validation/metrics.ts` (+`environmentMetrics`), `tests/environment.test.ts` (new, 16 tests).

## 4. Measurable results

**Fascia profile vs the measured reference step** (`environmentMetrics`, 22 samples): +Z max **2.1 px** (mean 1.7), +X max **3.7 px** (mean 2.7) — inside the ±6 px test threshold. The fitted bottom is a straight world line on each edge (max residual 0.011 / 0.021 m), i.e. the fascia wedge does **not** reintroduce the +X edge-angle residual as geometry (CR-01 respected).

**Test suite:** 31 original tests **preserved unchanged and green** + 16 new = **47 passed** (`tsc` clean; `vite build` OK; `check-dist: OK` — no reference image, no raster assets, no dev overlay in dist). One new test threshold was adjusted during development (post-count with the 2.4 m est. bay); no original test or threshold was modified.

**Rendered check (6 sizes, `data/rendered-check.json`):** plinth ≤ 0.5 px, signs ≤ 0.8 px, floor corners ≤ 2.6 px — identical to Mission 004 levels (flat mode measures the same validated geometry; rim/labels/backdrop are measurement-neutral there).

**Reference checksum:** verified OK before the first probe and before commit.

## 5. Visual evidence (committed review artifacts, `greybox/review/`, 30 files)

Main: `E01` home view, `E02` clean, `E03` overlay 50 %, `E04` overlay + markers, `E05` flat ID, `E06` inspector. Facade/fascia: `F-fascia-plusZ/plusX`, `F-corner-near` (clean + overlay50). Backdrop: `D-backdrop-left/right` (clean + overlay50). Plinth: `P-plinth-006A-clean/overlay50/overlay80`. Signs: `S-SIGN-01…07-006A-overlay50`. Responsive: `V-responsive-006A-1920x1080 / 2560x1080 / 1440x900 / 1024x768`. All captured from the running app in headless Chromium with HOME camera readback (fov 12.0006 confirmed in the log). Before/after comparison: M005 artifacts `R02/D-*/B-*/P-plinth-*` (pre-006-A) vs `E02/F-*/D-backdrop-*/P-plinth-006A-*` (post).

## 6. Remaining visual deviations and uncertainties

| # | Item | Status |
|---|---|---|
| 1 | +X lower-edge angle residual (CR-01) | Unchanged, accepted by owner; the fascia wedge follows the measured band bottom without moving the structural edge |
| 2 | Scenery plane distances (Q-ARCH-06) | Assumptions; positions are by-construction in HOME. In free orbit the bands read as placed scenery, not measured geometry |
| 3 | By-construction scenery heights | All in-frame rays point below the horizon, so scenery sits below y = 0 on distant planes; invisible in HOME (background band), visible in orbit |
| 4 | Back walls / mullions / transoms / rail-post bays on −X/−Z | Est. styling (no measurable reference lines behind the rooms); facade bay 0.96 m is measured on +X |
| 5 | Sign typography/icons | Greybox-level glyphs and auto-fit text; exact typography is art-pass scope |
| 6 | Logo mark / wordmark shapes | Stylised canvas glyphs at the correct positions/sizes; exact artwork is art-pass scope |
| 7 | LGT-01/02 tone match | Approximate (tone-only lighting); VAC-LGT-01/02 remain visual-review items for the owner |
| 8 | Bloom / glow around rim, strips, screens | Deferred to the art pass (Q-3D-07 decided: emissive now, bloom later) |
| 9 | ENV-017 omission | Documented above; owner may re-scope it into 006-C if desired |
| 10 | Executive Office interior | Still the greybox square (CR-07: final geometry unresolved) |

## 7. Handoff statement

The environment layer is complete within the approved scope: every visible structural zone now has its reference-supported shell (fascia, facade, back walls, balustrade styling, plinth details, sign text, strips, background scenery), all measurements and estimates are traceable in `scene-architecture.json` (schema v2), and the full suite (47 tests + build + guards + rendered check) is green. **006-B (robots) and 006-C (furniture) must not start until the owner reviews and approves this report.**
