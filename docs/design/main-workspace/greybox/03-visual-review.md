# 03 — Visual Review: Greybox vs Reference

> Mission **WORA-GREYBOX-REVIEW-005**, branch `arena/e6096316-wora-os`. Reviewer: 3D Greybox Builder. Audience: the owner (acceptance) and the 3D Scene Builder.
> Companion document: `04-correction-plan.md` (issue IDs CR-01…CR-08). This review does **not** start the art pass and makes **no** subjective design change.
>
> **Artifact rule.** All screenshots listed in §2 are committed under `greybox/review/` as **review artifacts only** — evidence for this review. They are **not** replacements for the original reference and must never be used as scene input. The reference itself is untouched and was never rendered into any committed build output. Storage decision approved by the owner (2026-11-20, this mission).

## 1. Inputs and preflight

| Input | Status |
|---|---|
| Reference image + checksum | `cd docs/design/main-workspace/reference && sha256sum -c wora-main-workspace.png.sha256` → `wora-main-workspace.png: OK` (verified at review start; re-verified before commit) |
| `DESIGN-SOURCE.md` | Read (lock status, image properties, provenance) |
| Mission 002 analysis `01–07` + `measurements.json` | Read: layout/sign/environment tables (02 §3–4), VAC tolerances (06), uncertainties (07) |
| Mission 003 architecture `01–06` + `scene-architecture.json` | Read: camera solve, element catalogue G-01…G-20, placeholders, open questions Q-ARCH-02/03/05/06, errata E-01…E-05 |
| Mission 004 implementation `apps/workspace/` | Read and inspected (`README.md`, `model.ts`, `camera.ts`, dev routes) |
| Mission 004 validation reports | `greybox/01-greybox-validation-report.md`, `data/greybox-metrics.json`, `data/rendered-check.json`, `greybox/02-technical-handoff.md` |

**Method.** The dev server (`apps/workspace`, port 5173) was loaded in headless Chromium 153 (SwiftShader WebGL 2) at 1672×941 DPR 1 unless stated. Every capture read `window.__WORA_CAMERA__` back and confirmed the HOME pose (60.675, 46.538, 61.964; vFOV 12.0006°) before the frame was taken — every screenshot below is therefore the approved camera. The reference overlay runs at exactly 50 % opacity in the reference frame unless stated. Close-ups were captured at DPR 2–3 for legibility (file pixel sizes are multiples of the cited reference-px windows). New pixel probes in this mission ran in a scratch workspace against the reference; the reference was not modified.

## 2. Visual evidence (all committed under `greybox/review/`)

| Group | Files | Shows |
|---|---|---|
| Main views | `R01-main-camera-view`, `R02-clean-scene` | The greybox in the HOME camera; R02 has no debug output at all |
| Reference overlay | `R03-reference-overlay-50` | Clean scene blended 50 % with the reference |
| Camera & sign alignment | `R04-camera-sign-alignment-overlay-markers` | Overlay + measured-vs-projected markers (plinth, corners, signs), slab-edge lines, UI-occluder rectangles |
| Dev inspector | `R05-dev-inspector-panel` | The inspection UI itself (markers incl. 47 robots, toggles, orbit) |
| Flat ID render | `R06-flat-id-render` | Unlit ID-colour mode used for the M004 rendered check |
| Department close-ups | `D-DEPT-01…07-{clean,overlay50,overlay50-markers}` | Each room, 3 variants each, window per envelope ±40 px |
| Building boundary | `B-{lower-left-plusZ,lower-right-plusX,back-left-minusX,back-right-minusZ}-{clean,overlay50-edges}` | All four slab edges, with and without the overlay + edge lines |
| Plinth comparison | `P-plinth-{clean,overlay50,overlay80,overlay50-markers}` | Atrium plinth at DPR 3, 740–1070 × 410–600 |
| Sign alignment | `S-SIGN-01…07-{clean,overlay50}` | Each sign plate at DPR 3, window per measured box ±30 px |
| Responsive framing | `V-responsive-{1920x1080,2560x1080,1440x900,1024x768}` | Actual browser renders of the home route at four more sizes |

Capture log (URL parameters, window sizes, camera readback) is held in scratch and summarised here; no scratch file is committed.

## 3. Visual review findings

### 3.1 Overall building silhouette
- Diamond orientation, roofless cutaway, near corner at bottom-centre: reproduced (VAC-GEO-01, GEO-08 pass numerically; visually confirmed in R02/R03).
- The mass under both visible slab edges fills to the frame bottom as in the reference (ENV-014/015 regions) — the 11 m placeholder depth is sufficient (B-* clean shots).
- The real building has **organic curved silhouette lines** in the backdrop (a rounded parapet bulging downward at the top-right of the mass, part of the ENV-016 top-band region; not separately catalogued in M002). The greybox mass is a plain straight-edged block. Accepted as a greybox placeholder; an art-pass item, not a correction (CR-08).
- The lower periphery shows the known edge finding (§3.6, CR-01).

### 3.2 Department positions and proportions
- Ring order Executive → Engineering → Management → QA & Testing → Research → Creative Studio → Marketing around the plinth, clockwise from top on screen: correct in every close-up.
- Marketing, Executive Office, Research, QA & Testing and Creative Studio floor plates sit on their reference outlines in the 50 % overlay (D-* overlay50). Management matches its digitised corners (1.9–4.6 px). Proportions (footprint aspect and size relative to the plinth) read correctly.
- Engineering reads slightly right of its measured envelope centre — the known clipped measurement (Live Activity panel at x = 1440), not a model error (VAC-GEO-04 note stands).
- Management runs to the frame edge as in the reference; see §4.4 (CR-04).
- Walkways: the slab between rooms is open floor as in the reference; no walkway geometry was invented (ND), correct for a greybox.

### 3.3 Atrium and plinth
- Centre and width match the reference in the overlay (P-plinth-overlay50/80; the projected circle rides the measured silhouette).
- Top-ellipse aspect 2.119 vs 2.17 ± 0.08: passes (independent, M004 §3.5).
- **New evidence — plinth height (U-4).** A luminance probe down three columns of the reference (x = 830/903/975, y 440–560) finds: rim top ≈ y 445–450, logo band ≈ y 476–512 (the dark "WORA" wordmark at y 506–519 at the centre), and floor contact ≈ y 535–550 (diffuse contact shadow). The measured 217×100 box (ENV-002) therefore covers the **full drum including its glowing rim side**, not only the top disc. The model renders the full drum at 107.3 px — within the ±5 px digitising tolerance of the measured 100 px. **U-4 is closed: the 0.12 m plinth top height stands; no correction.** (CR-03, closed.)
- The glowing rim, logo mark and wordmark are not modelled — art-pass scope, correctly absent.

### 3.4 Camera composition
- R01 is framing-identical to the reference; R04 confirms sign anchors, corner markers and edge lines riding their measured counterparts at 50 % blend. Composition (what is in frame and where) is preserved at all five rendered sizes (R01 + V-*); only the FOV rule changes, per `architecture/03 §6`. At 1024×768 the fit-safe-width rule reveals ~19 % more vertical content than the reference frame (known, Q-RESP-01 open).

### 3.5 Department signs
- 5/7 plate angles within ±3° (S-* overlay50). SIGN-02 (+3.5°) and SIGN-03 (−5.1°) tilt off at the upper periphery (§4.5, CR-05).
- Plate widths ride the measured boxes (lengths were fitted to them); centres ≤ 1.7 px. Heights read 1–27 px taller than the measured boxes (uniform 0.93 m estimate vs unknown per-sign heights) — visible as slight vertical overshoot in S-* close-ups (CR-06).
- Text, icons and the crown are absent by greybox scope (no textures). Not a finding.

### 3.6 Building edges
- Lower-left (+Z): model edge rides the reference within ≤ 1.8 px (B-lower-left overlay). Pass.
- Lower-right (+X): the reference "edge" here is visually a **wide bright fascia band** between the balustrade rail and the lower-storey glazing, with several parallel candidate lines and soft gradients (B-lower-right clean). The model's floor-level edge runs inside that band: within ±10 px of the `analysis/02` line over 80 % of its length, up to 14.2 px at its lower end, and the band's salient step is 3–10° steeper (M004 §4 probe; visually re-confirmed here). No geometry change (CR-01).
- Back edges (−X, −Z): the greybox edges are straight and plain; behind them the reference shows exterior glazing, city backdrop, rooftop greenery and the curved mass band (B-back-*). The gap is **background content beyond the building, not missing building** (§4.1, CR-02).

### 3.7 Visible and hidden geometry
- Every zone visible in the reference is occupied in the greybox (7 rooms + atrium + walkways + two balustrades); nothing visible is missing except in-fiction content excluded by scope (furniture, plants, robots, doors, sign text).
- Nothing is invented: the slab stops at the minimum supported extents; there are no extra rooms, no unseen extensions, no doors (Q-3D-01), no level changes (Q-3D-02). ND regions stay empty in HOME as required (Q-3D-08).

### 3.8 Responsive framing
- V-* renders confirm the composition is preserved at 1920×1080, 2560×1080, 1440×900 and 1024×768; the pose never changes (camera readback identical in every capture). Portrait remains unsupported by design (Q-RESP-01).

## 4. Uncertainty investigations (direct evidence from the original image)

### 4.1 Back building boundaries — RESOLVED as "background, not missing geometry"
Close-ups of the reference immediately beyond the model's −X and −Z edges (B-back-* clean vs `crops` probes) show, in order: a strip of interior floor/ceiling with light strips behind Marketing/Engineering back walls, then exterior glazing with mullions, then outdoor content — city bokeh, rooftop trees and greenery, and the curved white mass band. None of this continues the floor plate in a way that can be measured: no slab corner, wall line or floor boundary is visible anywhere above the back walls. The greybox's minimum-extent slab is therefore **correct under the no-invention rule**; the visible gap is background scenery the greybox does not model (and must not, in HOME). The building's true extents remain unknowable from this image → Q-ARCH-06 / Q-3D-08 stay open for the owner (CR-02).

### 4.2 Lower-right edge — CONFIRMED unresolved by geometry
Visual evidence (B-lower-right, low-right crop): the perceived edge is the bottom of a wide fascia band (tens of px tall), below which sit real lower storeys with glazing to the frame bottom. Candidate "edges" in the band: the glass balustrade rail, the fascia top, the fascia bottom / glazing head — all near-parallel, all soft. Combined with the M004 probe (step line 3.85° / 7.41° steeper than the model on the two lower edges, crossing near x ≈ 1630) and the M004 camera-sweep result (no admissible pinhole camera produces both measured edge angles), the evidence still supports **periphery distortion of the generated image** as the leading explanation, with a skewed slab not excluded. Keep x = 14.6 grid-aligned; owner decision required for any change (CR-01).

### 4.3 Plinth height measurement — RESOLVED (new probe)
As in §3.3: the ENV-002 box covers the full drum; rendered 107.3 px vs measured 100 ± 5 px passes. U-4 closed; the M004 "⚠ full drum" note is superseded by this evidence. No geometry change (CR-03 closed).

### 4.4 Management right corner — RESOLVED (evidence contradicts the old note)
Direct crop evidence (Management right region, ref ≈1480–1672 × 360–720): the room visibly continues past x = 1508 — meeting table, chairs, robots, plants and the right glass wall with a **corner post at x ≈ 1655–1662** running to the frame edge at y ≈ 490–620. `analysis/02`'s "runs off the image edge" is imprecise but its substance (the room is cut by the frame) is right. The greybox corner at (1646.9, 495.9) sits inside the actually-visible room, ~8–15 px left of the visible post — consistent with the fitted footprint within measurement uncertainty. **Not an error; no correction** (CR-04). The VAC-CAM-05 "visible corner" note in M004 stands as a measurement-convention remark, downgraded to informational.

### 4.5 Sign plate angles and dimensions — PARTIALLY RESOLVED
- Angles: 5/7 pass. SIGN-02/03 residuals (+3.5°/−5.1°) sit at the same upper periphery where M003 measured verticals straightened by 1–3.6°, and on the same side as the steepened +X edge — consistent with a smooth image-wide distortion field near the frame periphery rather than per-sign placement errors. No per-sign refit is recommended without new evidence (CR-05).
- Dimensions: lengths are fitted to measured widths (SIGN-03 = 5.26 m exceeds the estimated 3.3–4.5 m range purely from its angle residual, documented since M003). Heights: a uniform 0.93 m estimate over-renders the measured box heights by 1–27 px because rotation and height are entangled in the measured boxes. Per-sign fitted heights would reduce that, but they would replace one estimate with seven fitted ones — owner approval required; recommended to defer to the art pass (CR-06).

### 4.6 Executive Office geometry — CONFIRMED adequate
Overlay close-up (D-DEPT-01-*): the 7.10 × 7.10 m square floor and its four partitions align with the visible glass panels and the SIGN-01 anchor (0.5 px). The angled glass facets seen in the reference are panel curvature/reflections of a symmetrical glazed room, not a chamfered plan; nothing in the image supports a measurable chamfer. Q-ARCH-03 (chamfer for the art pass) stays open; the greybox square plan stands (CR-07).

## 5. Verdict

**The greybox is accepted for structural hand-off.** All objectively verifiable issues are either (a) resolved by this review with direct image evidence — U-4 plinth height, Management right corner, back-boundary reading — or (b) documented as open decisions requiring owner approval, with quantified options in `04-correction-plan.md` (CR-01, CR-02, CR-05, CR-06, CR-07). No correction implemented in this mission changes geometry; consequently the M004 test suite remains valid and was re-run green after the review (31/31, `check-dist` OK). **The next stage (art pass) must not start until the owner accepts this review and rules on the open CR items.**
