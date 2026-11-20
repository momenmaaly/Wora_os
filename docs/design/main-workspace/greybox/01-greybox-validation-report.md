# 01 — Greybox Validation Report: WORA Main Workspace

> Mission **WORA-3D-GREYBOX-004**, branch `arena/e6096316-wora-os`. From: 3D Greybox Builder. To: 3D Scene Builder (structural review), Visual QA.
> Inputs: the locked reference (checksum verified before and after), `DESIGN-SOURCE.md`, `analysis/01–07` and `data/measurements.json`, `architecture/01–06` and `data/scene-architecture.json`.
> Executable: `apps/workspace/` (React 19 + TypeScript 5.9 + Vite 8 + three r187 + @react-three/fiber 9). Run instructions are in `apps/workspace/README.md`.
> Evidence data: `data/greybox-metrics.json` (projection metrics of the rendered model) and `data/rendered-check.json` (pixels read back from the running app).

**Honesty rule.** Nothing here is claimed as pixel-perfect. Each result says whether it is **independent** evidence or holds **by construction** (an anchor the Mission 003 solution was fitted to). Values in px are original reference px at 1672×941, DPR 1, unless stated otherwise. **No screenshots or crops derived from the reference were committed**; only numbers are reported.

---

## 1. Summary

| Area | Result |
|---|---|
| Executable greybox | ✔ Runs (`npm run dev`) and renders a real three.js scene: slab, building mass, 7 department rooms (floor + 4 partitions each), plinth, two visible balustrades, 7 sign plates. It is not an image or billboard |
| Renderer ≡ validated model | ✔ Pixels read back from the WebGL canvas match the camera projection of the model within **≤ 0.5 px** (plinth), **≤ 0.8 px** (sign plates) and **≤ 2.6 px** (floor corners, raster extreme-pixel bias) at six window sizes (§3.1) |
| Camera | ✔ The approved HOME camera is reproduced exactly: yaw 225.371°, pitch 27.783°, roll 0°, vFOV 12.001°, hFOV 21.158°, f 4476.3 px (§3.2) |
| Layout preserved | ✔ 7 rooms, order and adjacency unchanged, footprints byte-identical to the JSON, walkway clearances reproduced within 0.02 m, slab limited to supported extents (§3.3) |
| Department boundaries vs reference | ✔ Digitised corners in-sample 0.3–6.1 px. ◐ Ring layout 6/7 within ±20 px (Engineering 43.3 px, known biased measurement) (§3.4) |
| Atrium / plinth | ✔ Centre 3.6 px, width 0 px (by construction), top-ellipse aspect 2.119 (independent, tolerance 2.17 ± 0.08). ⚠ Full drum silhouette is 7.3 px taller than the measured box (§3.5) |
| Major edges | ✔ Lower-left (+Z) ≤ 1.8 px against the re-measured edge. ◐ Lower-right (+X) within ±10 px over 80 % of the analysis line, 14.2 px at its lower end, and 3.3–10.2° steeper in the reference. Investigated in §4; **not resolved by changing geometry** |
| Responsive | ✔ Pose never changes; only the FOV follows the `architecture/03 §6` rule. The composition safe rectangle stays in frame at all nine tested sizes (≤ 0.8 px overflow at 4:3) (§5) |
| Guards | ✔ 24 AI Employees label and 47 robot positions unchanged; no robot models, furniture, doors, extra rooms or decorative materials; the reference is DEV-overlay only and absent from `dist/` (§6) |

**Overall:** the greybox passes structural review for hand-off, with the open items in §7. It is a **validated structural scene, not a match of the final image**.

## 2. Method

1. **P-1.** `cd docs/design/main-workspace/reference && sha256sum -c wora-main-workspace.png.sha256` → `wora-main-workspace.png: OK`. Checked at the start and at the end of the mission.
2. **Single model.** `src/scene/model.ts` turns the JSON into primitive descriptors. The app renders exactly these descriptors, and the tests project exactly the same ones. The camera is set by the same function (`applyHomeCamera`) in both.
3. **Projection metrics** (`src/validation/metrics.ts`, 31 vitest assertions). A real `THREE.PerspectiveCamera` projects the model and compares it with:
   - `measurements.json`;
   - the digitised corners and slab-edge lines (`architecture/05 §3.5–3.6`);
   - the sign angles (`analysis/02 §4`);
   - the ring offsets (`architecture/05 §3.8`);
   - the UI occluders.
4. **Rendered check.** Headless Chromium 153 with SwiftShader WebGL 2 loads the dev route in **flat ID-colour mode** (unlit, one colour per element type or department). `window.__WORA_RENDERED_CHECK__()` reads the canvas back, segments the colours and compares the rendered extents with the projection. Run at 1672×941, 1920×1080, 2560×1080, 1440×900, 1280×800 and 1024×768, DPR 1.
5. **Reference comparison (P-3).** The dev inspector overlays the locked reference at 50 % in the reference frame and draws the measured points against the live projected points. This was inspected visually at 1672×941 in scratch only. An automated brightness-step probe was run on the reference along both lower slab edges (§4); it used a scratch Python environment outside the repo.
6. **Tolerances.** VAC values from `analysis/06` where they exist (CAM-01 ±5 px, CAM-02 ±3°, CAM-03 ±0.08, GEO-02/03 ±10 px, GEO-04 ±20 px). Otherwise P-4 (Low = ±15 px).

## 3. Results

### 3.1 The running app renders the validated geometry (rendered check)

Maximum deviation of rendered pixels from projected model, per window size (`data/rendered-check.json`):

| Window | FOV rule | Plinth box | Sign-plate boxes (7) | Room floor corners (visible) |
|---|---|---:|---:|---:|
| 1672×941 | reference | 0.5 px | 0.6 px | 1.7 px |
| 1920×1080 | reference (Δaspect < 0.001) | 0.5 px | 0.7 px | 2.0 px |
| 2560×1080 | fit-width | 0.5 px | 0.6 px | 2.6 px |
| 1440×900 | keep-vertical | 0.4 px | 0.6 px | 1.7 px |
| 1280×800 | keep-vertical | 0.5 px | 0.7 px | 2.5 px |
| 1024×768 | fit-safe-width | 0.5 px | 0.8 px | 1.5 px |

Notes on the floor-corner check:
- Floor corners are taken as the extreme pixels of each flat-coloured floor. That biases them by up to about 2 px on a raster, and the floor plates are 0.02 m thick.
- Two corners are hidden behind sign plates in every size and are excluded: Executive Office top corner (SIGN-01) and Creative Studio right corner (SIGN-06).
- Corners outside the canvas are also excluded: Research bottom corner at 2560×1080, and the Management right corner at ≤ 1.6 aspect.

The slab underside edges were measured on the 1672×941 flat render. They lie 0.6 px (+Z) and 1.1 px (+X) from their projections.

### 3.2 Camera alignment (G-19)

| Quantity | Approved (`architecture/03 §2`) | Three.js camera in the app | Δ |
|---|---|---|---|
| Yaw | 225.37° | 225.371° | 0.00° |
| Pitch | 27.78° | 27.783° | 0.00° |
| Roll | 0° | 0.000° | 0 |
| vFOV / hFOV | 12.0006° / 21.158° | 12.001° / 21.158° | 0 |
| Focal length at 941 px | 4476 px | 4476.3 px | 0.3 px |
| Position / target | (60.675, 46.538, 61.964) / (−2.186, 0, −0.089) | identical (read back from `window.__WORA_CAMERA__` in Chromium) | 0 |

**VAC-CAM-01 framing anchors** (none are independent; all are fit anchors or back-projections):

| Anchor | Reference | Greybox | Error |
|---|---|---|---|
| Plinth centre | (903, 500) | (903.1, 503.6) | 3.6 px ✔ |
| Executive Office sign anchor | (876, 158) | (876.0, 158.5) | 0.5 px ✔ |
| Planter (802, 402) | — | — | Not evaluated. The planter is furniture and is not in the greybox. The JSON point is its floor base, not its visible centre |

**VAC-CAM-02 sign angles** are independent:
- SIGN-01 0.1°, SIGN-04 1.2°, SIGN-05 0.4°, SIGN-06 2.2° and SIGN-07 0.9° are within ±3°.
- **SIGN-02 +3.5°** and **SIGN-03 −5.1°** fail. These are the same values as Mission 003, at the upper periphery.

**VAC-CAM-04 scale constancy:** not applicable, because robots are not modelled. Mission 003 measured a ratio of 1.32 against 1.36.

### 3.3 Layout preservation (accuracy requirements)

| Check | Result |
|---|---|
| Department set and order | Exactly DEPT-01…07 with the JSON names; footprints equal the JSON values (test `layout preservation`) |
| Ring order around the plinth (clockwise from top, on screen) | Executive Office → Engineering → Management → QA & Testing → Research → Creative Studio → Marketing ✔ |
| Walkway clearances (derived, `ring_clearances_m`) | All 7 pairs reproduced within 0.02 m. Walkways are the slab surface between the rooms; their width is ND, so no separate walkway geometry was invented |
| Room floor corners vs the M003 solver | ≤ 0.30 px on all 28 corners (implementation consistency, not a reference check) |
| Slab footprint | x −17.18 … 14.6, z −15.30 … 13.91. The −X and −Z edges sit at the **minimum supported extent** (Marketing x0, Engineering z0); see §7 U-1 |
| Executive Office | 7.10 × 7.10 m square (A-EXEC-SYM, as supplied). No chamfer is modelled, because its size is ND |
| Partition height | 2.07 m (derived from the provisional 0.75 m desk height; a uniform rescale does not change the composition) |

### 3.4 Department boundary alignment

**Digitised partition floor corners** (in-sample, ±5 px digitising uncertainty):

| Corner | Reference | Greybox | Error |
|---|---|---|---:|
| Marketing near floor corner | (371, 420) | (371.0, 419.7) | 0.3 px |
| Management left corner-post foot | (1260, 539) | (1256.2, 541.7) | 4.6 px |
| Management near floor corner | (1508, 653) | (1509.6, 655.4) | 2.9 px |
| Research right corner-post foot | (885, 720) | (879.1, 718.6) | 6.1 px |
| QA right wall-end foot | (1323, 750) | (1323.8, 751.8) | 1.9 px |

These corners were used in the M003 fit, so they are **not independent**. The honest out-of-sample uncertainty of a room corner is the M003 leave-one-out residual: 10.5–72.1 px, median 26.5 px. Executive Office, Engineering and Creative Studio have no digitised corner.

**Ring layout (VAC-GEO-04, ±20 px).** Envelope centres (floor plus partition tops) relative to the plinth:

| Room | Reference Δ | Greybox Δ | Error |
|---|---|---|---:|
| Executive Office | (−38, −275) | (−38.6, −292.9) | 17.9 ✔ |
| Marketing | (−457, −215) | (−470.2, −213.4) | 13.3 ✔ |
| Engineering | (+347, −210) | (+390.3, −207.5) | **43.3 ✘** |
| Creative Studio | (−467, +65) | (−483.6, +65.1) | 16.6 ✔ |
| Management | (+558, +30) | (+548.1, +23.4) | 11.9 ✔ |
| Research | (−228, +178) | (−215.4, +182.2) | 13.3 ✔ |
| QA & Testing | (+247, +178) | (+240.7, +182.7) | 7.9 ✔ |

The Engineering failure has a known cause: its measured envelope is clipped by the Live Activity panel at x = 1440, so the measured centre is biased left. The modelled envelope runs to x = 1529.5, behind the panel.

**Occlusion parity (VAC-CAM-05):**
- The occluded extremes are hidden as in the reference for 4 of 5 rooms: Executive top by REG-04, Marketing left by REG-02, Engineering right by REG-06, Creative left by REG-02.
- ⚠ The **Management right corner (1646.9, 495.9) is visible** in the greybox. `analysis/02` says the room runs off the edge, but a post is visible at x ≈ 1660 in the reference. This is unchanged from Mission 003, and confidence is Low.

**Sign plates (G-12…18):**
- Anchors round-trip to the measured centres within 0.04 px (by construction).
- The plates are 0.93 m high (est.). Their lengths were fitted so that each projected box width equals the measured width: 4.12 / 4.06 / 5.26 / 4.37 / 3.94 / 3.17 / 3.61 m.
- Box centres are within 1.7 px.
- Box heights are 1–27 px larger than measured, because each sign's real plate height is not separable from its rotation (`architecture/05` G-12…18). A uniform 0.93 m was kept instead of fitting per-sign heights.
- SIGN-03 at 5.26 m is longer than the estimated 3.3–4.5 m range because of its −5.1° angle residual.

### 3.5 Atrium and plinth (G-04; VAC-ENV-01, VAC-CAM-01, VAC-CAM-03)

| Check | Reference | Greybox | Δ | Independent? | Result |
|---|---|---|---|---|---|
| Centre of the full silhouette | (903.5, 500) | (903.1, 503.6) | 3.6 px | No (origin anchor) | ✔ ±5 |
| Width | 217 | 217.0 | 0 | No (sets r = 2.383 m) | ✔ |
| Top-ellipse height / aspect | 100 / 2.17 | 102.4 / 2.119 | +2.4 px / −0.051 | **Yes** | ✔ (±0.08) |
| Full drum silhouette height / aspect (top + 0.12 m side) | 100 / 2.17 | 107.3 / 2.022 | **+7.3 px / −0.148** | **Yes** | ⚠ outside ±0.08 if the measured box is the whole drum |

- The atrium is the open slab floor inside the ring. No boundary was invented, because none is visible (ENV-001, Low).
- The plinth is off-centre towards the camera (+X +Z) relative to the ring, as measured. It was **not** re-centred.
- The drum discrepancy depends on what the 795, 450, 217 × 100 box covers. If it is only the top disc, the result passes. If it includes the glowing rim side, the 0.12 m height (est.) is too tall by about 0.05 m. This is reported, not adjusted (§7 U-4).

### 3.6 Major edge alignment (G-01…03; VAC-GEO-01/02/03/08)

| Edge | Reference line | Model angle / reference angle | Perpendicular distance at 0/20/40/60/80/100 % (px) | Result |
|---|---|---|---|---|
| +Z lower-left | M003 re-measured (235,630)→(560,820) | −29.8° / −30.3° | 1.4 · 0.8 · 0.1 · 0.5 · 1.1 · 1.8 | ✔ |
| +Z lower-left | M003 Hough (534,785)→(583,817) | −29.8° / −33.1° | 15.7 · 15.0 · 14.3 · 13.6 · 13.0 · 12.3 | ◐ short segment, 3.3° |
| +Z lower-left | `analysis/02`/`03` line (237,597)→(480,826) | −29.8° / −43.3° | 31 · 15.5 · 0.1 · 15.6 · 31.2 · 46.8 | ✘, but the line itself is erratum **E-02** |
| +X lower-right | `analysis/02` (1333,821)→(1672,597) | +30.2° / +33.5° | **14.2** · 9.6 · 4.9 · 0.3 · 4.3 · 9.0 | ◐ within ±10 px except the lower 15 % |
| +X lower-right | M003 longest Hough (1360,839)→(1669,576) | +30.2° / +40.4° | 43.3 · 28.9 · 14.5 · 0.2 · 14.2 · 28.6 | ✘ 10.2° |

- **VAC-GEO-01** diamond orientation: ✔. The building diagonal is vertical on screen (yaw within 0.4° of the diagonal).
- **VAC-GEO-08** no roof: ✔.
- The −X and −Z slab edges have no measured counterpart (ND). In HOME both are partly visible (§7 U-1):
  - the −X edge (on Marketing's back wall line) in the upper-left, from (235, 332) to (765, 127);
  - the −Z edge (on Engineering's back wall line) in the upper-right, from (928, 127) to (1420, 322), and again at x ≥ 1656.

## 4. Investigation: lower-right (+X) building-edge discrepancy (Q-ARCH-05)

The question is why the visible lower-right slab edge is steeper in the reference than a grid-aligned edge in the solved camera. Five tests were run without changing any geometry.

1. **Is the edge just at a different x?** Back-projecting the measured lines onto the floor gives:
   - `analysis/02` line: x from 14.99 (z 3.30) to 14.33 (z −8.65), mean x 14.67;
   - Hough segment: x from 15.77 to 13.75, mean x 14.79.

   Both means are inside the JSON range 14.3–15.8 and close to the adopted 14.6. A different grid-aligned x shifts the line but **cannot change its angle**, so this is not the cause.

2. **Is it a different edge height?** The measured lines were back-projected at y = 0 (floor), y = −0.3 (slab underside) and y = 1.27 (balustrade top). The world skew from the Z axis is identical at all three heights (3.1° for the analysis line, 9.0° for the Hough segment). Height does not explain it.

3. **Can the camera absorb it?** The camera was rotated about the target within the M003 90 % bootstrap interval (yaw −1.47…+1.74°, pitch ±0.22°):
   - The +X edge only reaches 28.5°–31.7°, against 33.5° / 40.4° measured.
   - Yaw trades the two edges almost 1:1. Yaw −5° gives +X 35.4° but +Z −25.3°, which breaks the lower-left edge that currently fits to 0.5°.
   - Only a pitch increase steepens both edges (+5° → +Z −33.4°, +X 33.7°). But pitch is pinned to 27.56–28.01° by the line fit and the plinth aspect.

   No single pinhole camera consistent with the rest of the image matches the +X edge.

4. **What does the reference itself show?** An automated probe looked for the strongest bright-above / dark-below step within ±50 px of the model edges in the reference. It ran in scratch, and the reference was not modified or committed. It tracks one continuous line along each edge:
   - **+Z:** 24 of 24 samples, 17 → 36 px below the model edge, **3.85° steeper**;
   - **+X:** 34 of 34 samples, from +43.5 px at x = 1340 to −8 px at x = 1660, **7.41° steeper**. It crosses the model edge near x ≈ 1630.

   This step is most likely the bottom of the slab fascia, the white band above the lower-storey glazing. Its sub-pixel identity is uncertain. **Both** visible lower edges are therefore steeper than the pinhole model predicts: about 4° on the left and about 7–10° on the right.

5. **Is it the room layout?** No. The +X edge was never used to place rooms. Management and QA & Testing match their digitised corners within 1.9–4.6 px right next to that edge.

**Finding.** The discrepancy is consistent with the generated image not being a single exact pinhole projection near its lower periphery. The same pattern appears in the upper periphery: SIGN-02 and SIGN-03 are +3.5° / −5.1° off, and the verticals are straightened by 1–3.6°. The lower-right side shows it most strongly. A genuinely non-orthogonal slab (skewed 3–9° in plan) cannot be excluded, but no other building line supports it: the M003 line fit puts the building's X and Z line families on the grid with median angular residuals of 1.29° and 0.94°.

**Handling.**
- The edge stays grid-aligned at x = 14.6, per the M003 recommendation.
- Owner decision **Q-ARCH-05 remains open**. The two options are:
  - (a) accept the residual;
  - (b) approve a skewed +X slab edge. The data would support x ≈ 15.8 at z 3.4 to x ≈ 13.75 at z −9.4. This would be an architectural change and would need a JSON schema bump.
- Neither the camera nor any geometry was adjusted to hide the residual.

## 5. Responsive behaviour

The camera pose is constant at every size. Only the FOV changes, following `architecture/03 §6`:
- keep hFOV above the reference aspect;
- keep vFOV between 1.581 and 1.777;
- fit the safe-rectangle width below 1.581.

Projected sign plates and plinth (`data/greybox-metrics.json → responsive`):

| Size | Aspect | Rule | vFOV / hFOV | Canvas in reference-frame units (W × H) | Safe-rect overflow | Plinth (normalised) |
|---|---:|---|---|---|---:|---|
| 1672×941 | 1.777 | reference | 12.001 / 21.158 | 1 × 1 | 0 | 0.540, 0.531 |
| 1920×1080 | 1.778 | reference | 12.001 / 21.169 | 1.001 × 1 | 0 | 0.540, 0.531 |
| 2560×1440 | 1.778 | reference | 12.001 / 21.169 | 1.001 × 1 | 0 | 0.540, 0.531 |
| 1366×768 | 1.779 | fit-width | 11.988 / 21.158 | 1 × 0.999 | 0 | 0.540, 0.531 |
| 2560×1080 | 2.370 | fit-width | 9.010 / 21.158 | 1 × 0.75 | 0 | 0.540, 0.542 |
| 3440×1440 | 2.389 | fit-width | 8.941 / 21.158 | 1 × 0.744 | 0 | 0.540, 0.542 |
| 1440×900 | 1.600 | keep-vertical | 12.001 / 19.093 | 0.90 × 1 | 0 | 0.545, 0.531 |
| 1280×800 | 1.600 | keep-vertical | 12.001 / 19.093 | 0.90 × 1 | 0 | 0.545, 0.531 |
| 1024×768 | 1.333 | fit-safe-width | 14.211 / 18.874 | 0.89 × 1.186 | 0.8 px | 0.545, 0.526 |

What changes with aspect ratio:
- **Composition.** There is no change in camera position, target or orientation. The plinth stays within 0.5 % of its normalised position.
- **Ultrawide.** The upper and lower 12.5 % of the reference frame are cropped. All signs and the plinth stay visible. The Research bottom corner leaves the frame at 2560×1080.
- **Narrow, < 1.581.** To keep all signs, the view reveals 18.6 % more height than the reference. That shows the ND area above and below the building, here the plain background and the slab's −X edge (§7 U-1). This is the documented consequence of the rule (Q-RESP-01).
- **Portrait** is not supported, as in M003.
- The rendered checks in §3.1 confirm that the running app applies the same FOVs, read back from `window.__WORA_CAMERA__`.

## 6. Acceptance checklist (analysis/06), greybox scope

Status legend: ✔ pass · ◐ partial · ✘ fail · ⚠ known issue · — not in greybox scope (later phase).

| VAC | Status | Evidence |
|---|---|---|
| P-1 checksum | ✔ OK before and after | §2 |
| P-2 1672×941 at DPR 1 | ✔ (3D only; UI panels are a later phase) | §3.1 |
| P-3 overlay / coordinate checks | ✔ coordinate checks; overlay inspected in the dev route (scratch, nothing committed) | §3 |
| P-5 proportional scales | ✔ 1920×1080 and 2560×1440 are proportional within 0.001 aspect, so normalised positions are identical | §5 |
| P-6 no reference in the shipped app | ✔ overlay is DEV-gated, compiled out, and checked by `check-dist` | §6.1 |
| VAC-REG-03 3D viewport is real 3D | ✔ (canvas is full-bleed; panels are not yet built) | §3.1 |
| VAC-DEP-15 department set | ✔ exactly 7 | §3.3 |
| VAC-DEP-02/04/06/08/10/12/14 sign boxes | ◐ position ✔ (centre ≤ 1.7 px, width exact by fit); plate height ND (box +1…+27 px) | §3.4 |
| VAC-DEP-01/03/05/07/09/11/13 room envelopes | ◐ via GEO-04 (6/7) | §3.4 |
| VAC-ENV-01 plinth | ✔ centre and width; ⚠ drum height +7.3 px | §3.5 |
| VAC-ENV-02…11 furniture / props | — excluded by mission rules | — |
| VAC-ROB-001…047, T01 | — robots are markers only. 47 positions preserved; head round trip ≤ 0.036 px; zone 40/40 inside, free-roaming 7/7 outside | §6.1 |
| VAC-GEO-01 diamond orientation | ✔ | §3.6 |
| VAC-GEO-02 lower-left slab | ✔ against the re-measured edge (≤ 1.8 px); ✘ against the erroneous line (E-02) | §3.6 |
| VAC-GEO-03 lower-right slab | ◐ within ±10 px over 80 % of the line (max 14.2 px); 3.3° steeper (10.2° against Hough) | §3.6, §4 |
| VAC-GEO-04 ring layout | ◐ 6/7 (Engineering, biased measurement) | §3.4 |
| VAC-GEO-05/06 partitions / balustrades | ◐ geometry present (neutral translucent planes); glass, frames and walnut are art-pass items | — |
| VAC-GEO-07 exterior | ◐ lower storeys shown only as a plain building mass under the visible edges; no exterior detail | §7 U-2 |
| VAC-GEO-08 no roof | ✔ | §3.6 |
| VAC-CAM-01 framing anchors | ✔ plinth 3.6 px and Executive sign 0.5 px (both by construction); planter not evaluated | §3.2 |
| VAC-CAM-02 sign angles | ◐ 5/7 within ±3° | §3.2 |
| VAC-CAM-03 plinth aspect | ✔ top ellipse 2.119; ⚠ full drum 2.022 | §3.5 |
| VAC-CAM-04 scale constancy | — no robots | — |
| VAC-CAM-05 occlusion parity | ✔ 4/5; ⚠ Management right corner | §3.4 |
| VAC-LGT-*, VAC-CLR-*, VAC-TYP-* | — neutral greybox lighting and materials only | — |
| VAC-INT-01 reference unchanged | ✔ | §2 |
| VAC-INT-02 reference not shipped | ✔ `check-dist: OK` | §6.1 |
| VAC-INT-04 3D is real geometry | ✔ for structure (rooms are meshes); robots and furniture come later | §3.1 |

### 6.1 Guard rails (automated, `tests/guards.test.ts`, `scripts/check-dist.mjs`)

- `measurements.json` still names the status group `Group "24" / "AI Employees"`. The 47 robot records and the 47 robot floor positions are unchanged. Robots appear only as dev markers with IDs; there are no models.
- Generated element types are only slab, mass, floor, partition, balustrade, plinth and sign. Every room has 4 closed partitions, with no openings or doors.
- `src/` contains no raster import and no reference path.
- The overlay URL is `import.meta.env.DEV`-gated.
- `dist/` contains no raster files and no copy of the reference (SHA-256 compared). It has no `/@fs/` path and no overlay code. The only reference mention is the provenance `reference.path` string inside the bundled JSON data.

## 7. Unresolved differences and open items

| # | Item | Size of effect | Handling / owner |
|---|---|---|---|
| U-1 | Hidden extents: −X and −Z slab edges (Q-ARCH-06, Q-3D-08) | The slab ends at x = −17.18 and z = −15.30, on the back-wall lines of Marketing and Engineering. In HOME, both edges are **visible**: upper-left from (235, 332) to (765, 127) and upper-right from (928, 127) to (1420, 322). Beyond them the greybox shows the plain background, where the reference shows more floor, back glazing and exterior trees (ENV-016) | Not invented, per the mission rule. The owner must define the extents, or approve continuity geometry |
| U-2 | Lower storeys (ENV-014 / ENV-015) | A plain box 11 m deep below the slab fills the visible facades to the frame bottom. The storey count and facade are ND | Placeholder only; the art pass must define it |
| U-3 | Lower-right slab edge (Q-ARCH-05) | 3.3–10.2° steeper; up to 14.2 px (analysis line) or 43 px (Hough) | §4. Grid-aligned edge kept; owner decision |
| U-4 | Plinth drum height | +7.3 px silhouette height if the measured box covers the side | Keep 0.12 m (est.); confirm what the box covers |
| U-5 | SIGN-02 / SIGN-03 angles | +3.5° / −5.1° | Peripheral non-pinhole residual; an in-plane rotation would be cosmetic and needs approval |
| U-6 | Sign plate heights | Box heights +1…+27 px | Plate height is ND; uniform 0.93 m (est.) kept |
| U-7 | Engineering ring offset | 43.3 px | Biased measurement (clipped by REG-06) |
| U-8 | Management right corner visible | ~25 px inside the frame | Low confidence; recheck in the art pass |
| U-9 | Room corner accuracy without digitised corners | LOO 10–72 px (median 26.5) | Executive Office, Engineering and Creative Studio are Medium–Low confidence |
| U-10 | Executive Office plan, chamfer and sign mounting (Q-ARCH-03) | ND | Square 7.1 m footprint as supplied; no chamfer modelled |
| U-11 | Metric scale (Q-ARCH-02) | Desk 0.75 m provisional | Uniform; does not affect the composition |
| U-12 | Narrow aspects reveal ND content (Q-RESP-01) | +18.6 % height at 4:3 | Rule as approved in M003; owner to confirm the supported range |
| U-13 | Q-DATA-01 (24 AI Employees vs 47 robots) | — | Not changed; not an architecture decision |
