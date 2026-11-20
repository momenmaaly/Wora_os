# 05 — Structural Greybox and Validation Against the Reference

> Inputs: `01`–`04`, `analysis/06-visual-acceptance-checklist.md` (VAC items and protocol P-1…P-6), `analysis/data/measurements.json`.
> **Honesty rule.** No result here is claimed as pixel-perfect. Each check states whether it is **independent** evidence or holds **by construction** (an anchor the solution was built on).
> Validation evidence was produced in a scratch workspace **outside the repository**:
> - Python projection solver;
> - projected-wireframe overlays over the reference;
> - a Three.js r187 projection test.
>
> Images derived from the reference were **not committed** (standing rule: the reference must not be redrawn, cropped or substituted in the repo). Numbers are reported instead.

---

## 1. Structural greybox specification

The greybox is fully defined by `data/scene-architecture.json`. **No prototype is committed**, because the repository has no application environment (`06 §2`). Built in any engine, it contains exactly these elements:

| # | Element | Geometry | Dimensions / position | Source |
|---|---|---|---|---|
| G-01 | Floor slab | Box, top at Y = 0, thickness 0.3 (placeholder) | x from −19 (hidden) to 14.6, z from −17 (hidden) to 13.91. Hidden edges must stay hidden (§3.7) | `02 §6` |
| G-02 | Balustrade +Z | Thin plane, h 1.27 | Along z = 13.91, visible x −5.9…4.4 (extend into hidden regions only) | `02 §6–7` |
| G-03 | Balustrade +X | Thin plane, h 1.27 | Along x = 14.6, visible z −9.4…3.4 | `02 §6–7` |
| G-04 | Plinth (ENV-002) | Cylinder r 2.383, h 0.12 | Centre (0, 0, 0) | `02 §4` |
| G-05…11 | Department rooms DEPT-01…07 | Floor plane + 4 partition planes, h 2.07, thickness 0.05 (placeholder) | Footprints in `02 §3` | `02 §3` |
| G-12…18 | Sign plates SIGN-01…07 | Flat boxes ≈ 4.1 × 0.93 × 0.05 m (est. from the frontal SIGN-01: 168 × 35 px at the local scale). Side plates measure 3.3–4.5 m long from their rotated boxes (est.; plate height not separable from rotation) | Anchors and orientation in `02 §3`. Keep the screen positions | `02 §3` |
| G-19 | Camera | HOME | `03 §2` | `03` |
| G-20 | Lights | Hemisphere + 1 directional (neutral) | `04 §4` | `04` |

**Excluded on purpose:** furniture, robots, atrium props, materials, light strips, glass shading, the facade and exterior detail, and any doors.

## 2. Validation method

1. P-1: checksum verified (`OK`) before and after the work.
2. Project every greybox element with the HOME camera at 1672×941 (equivalent to P-2 at DPR 1). Compare with:
   - `measurements.json` coordinates;
   - the digitised floor corners;
   - the slab edges;
   - the line families.
3. Visually inspect the projected wireframe over the reference at 50% scale (P-3a style, scratch only).
4. Cross-check the camera config in an actual Three.js `PerspectiveCamera`.
5. Tolerances: VAC values where they exist (CAM-01 ±5 px, CAM-02 ±3°, CAM-03 ±0.08, GEO-02/03 ±10 px, GEO-04 ±20 px); otherwise P-4 (Low = ±15 px).

## 3. Results

### 3.1 Camera fit (independent of the layout)
| Metric | Value |
|---|---|
| Segments used | X 170, Z 90, Y 10 (of 385 detected) |
| Angular residual, median / p90 | X 1.29° / 3.24°; Z 0.94° / 2.34°; Y 1.40° / 2.68° |
| Pitch 90% interval | 27.56°–28.01° |
| Yaw 90% interval | 223.88°–227.11° |
| f 90% interval | 3976–5026 px (vFOV 13.5°–10.7°) |

### 3.2 Plinth (VAC-CAM-01, VAC-CAM-03)
| Check | Reference | Greybox | Δ | Independent? | Result |
|---|---|---|---|---|---|
| Centre | (903, 500) | (903.0, 500.0) | 0.0 px | No (origin anchor) | ✔ |
| Width | 217 | 217.0 | 0 | No (sets the radius) | ✔ |
| Height | 100 | 102.4 | +2.4 px | **Yes** | ✔ |
| Aspect | 2.17 ± 0.08 | 2.119 | −0.051 | **Yes** | ✔ |
| Bounding box | 795, 450, 217, 100 | 794.5, 449.9, 217.0, 102.4 | ≤ 2.4 px | Partly | ✔ |

### 3.3 Sign-plate angles (VAC-CAM-02, ±3°), independent
| Sign | Measured | Greybox | Δ | Result |
|---|---:|---:|---:|---|
| SIGN-01 Executive Office | 0° | 0.1° | +0.1 | ✔ |
| SIGN-02 Marketing | −24° | −20.5° | +3.5 | ✘ (top-left periphery) |
| SIGN-03 Engineering | +26° | +20.9° | −5.1 | ✘ (top-right periphery) |
| SIGN-04 Creative Studio | −24° | −22.8° | +1.2 | ✔ |
| SIGN-05 Management | +22° | +22.4° | +0.4 | ✔ |
| SIGN-06 Research | −27° | −24.8° | +2.2 | ✔ |
| SIGN-07 QA & Testing | +26° | +25.1° | −0.9 | ✔ |

5 of 7 pass. Both failures are in the upper band of the frame, where the model predicts flatter angles than drawn. This fits the general pattern that the generated image's perspective is not one consistent pinhole camera at the periphery (see also §3.6 and §3.8). The sign angles were measured from rotated text plates (`analysis/02`), which carries about ±2° of its own uncertainty.

### 3.4 Robot containment (layout check, independent of the robots' use in the fit)
| Variant | Constraints | Zone robots inside | Free-roaming outside all rooms |
|---|---|---|---|
| B: envelope + sign wall | Envelope, sign | 35 / 40 (Engineering 2 at 0.25–0.27 m, QA 3 at 0.52–0.63 m outside) | 7 / 7 |
| A: B + robot containment | + robots | 40 / 40 | 7 / 7 |
| **D (adopted): A + digitised corners** | + 5 corners | **40 / 40** | **7 / 7** |

- The free-roaming robots (ROBOT-041…047) were **never** used as constraints. All 7 land on walkway or atrium floor outside every room, which is an independent check.
- The zone-robot containment in A/D is partly by construction. B shows the result without it: 35/40, with the 5 misses within 0.25–0.63 m.

### 3.5 Digitised partition floor corners (±5 px digitising uncertainty)
| Corner (px) | In-sample residual (D) | Leave-one-out residual | Variant B residual (not fitted) |
|---|---:|---:|---:|
| Marketing near floor corner (371, 420) | 0.3 px | 26.5 px | 26.5 px |
| Management left corner-post foot (1260, 539) | 4.7 px | 13.7 px | 28.1 px |
| Management near floor corner (1508, 653) | 3.0 px | 72.1 px | 121.8 px |
| Research right corner-post foot (885, 720) | 6.2 px | 33.2 px | 33.2 px |
| QA right wall-end foot (1323, 750) | 2.0 px | 10.5 px | 24.6 px |

- **Out-of-sample accuracy of a room corner is about 10–35 px** (median 26.5 px), and up to about 72 px for Management. This is the honest uncertainty of the room footprints where no corner was digitised.
- Executive Office, Engineering and Creative Studio have **no** digitised corner. Their footprints rely on the envelope, sign and robots only (Engineering, Creative), or on A-EXEC-SYM (Executive Office).

### 3.6 Building edges (VAC-GEO-01…03)
| Check | Reference | Greybox | Result |
|---|---|---|---|
| GEO-01 diamond orientation | Diagonal vertical on screen | Yaw within 0.4° of the diagonal | ✔ |
| GEO-02 lower-left slab edge | `analysis/03`: (237,597)→(480,826), 43° | Grid-parallel edge z = 13.91; screen angle about 30° | ✘ against the stated line, but **the stated line is an error** (§6, E-02). The re-measured slab edge (≈30–33° on screen, e.g. (235,630)→(560,820) and Hough (534,785)→(583,817)) deviates only 0.5–3.7° from the grid: ✔ against the re-measurement |
| GEO-03 lower-right slab edge | (1333,821)→(1672,597), 33.5°; Hough (1360,839)→(1669,576), 40.4° | Grid-parallel edge x = 14.6 projects at about 30.3° | ◐. Against the `analysis/02` line, the distance is 14.2 / 9.6 / 4.9 / 0.3 / 4.3 / 9.0 px at 0/20/40/60/80/100% of its length: within ±10 px except the lower 15%. Against the longest Hough segment it is up to 43 px at the ends. **3–10° angular residual**; open as Q-ARCH-05 |
| GEO-08 no roof | Cutaway | No roof geometry | ✔ |

### 3.7 Occlusion parity (VAC-CAM-05)
| Room | Occluded side | Extreme corner (model px) | Falls in | Result |
|---|---|---|---|---|
| DEPT-01 Executive Office | top (back corner, partition top) | (865.0, 84.3) | REG-04 top cluster | ✔ hidden |
| DEPT-02 Marketing | left | (209.3, 260.8) | REG-02 sidebar | ✔ hidden |
| DEPT-03 Engineering | right | (1529.5, 283.0) | REG-06 Live Activity | ✔ hidden |
| DEPT-04 Creative Studio | left | (203.8, 535.3) | REG-02 sidebar | ✔ hidden |
| DEPT-05 Management | right | (1646.9, 495.9) | visible, inside the frame | ⚠ The model shows the corner 25 px inside the frame edge, where a vertical post is visible at x≈1660. `analysis/02` says the room "runs off the image edge". Treated as Low-confidence |

Panels used: REG-02 (0,67,235,874), REG-04 (550,10,590,117), REG-06 (1420,83,236,266). The near corner (+X +Z) lies behind REG-07; the −X / −Z building edges are outside the frame or behind panels.

### 3.8 Ring layout (VAC-GEO-04, ±20 px): offsets of envelope centres from the plinth
| Room | Reference Δ (px) | Greybox Δ (px) | Error | Result |
|---|---|---|---:|---|
| DEPT-01 Executive Office | (−38, −275) | (−38.0, −292.9) | 17.9 | ✔ (the top is occluded, so the measured centre is biased) |
| DEPT-02 Marketing | (−457, −215) | (−469.7, −213.4) | 12.8 | ✔ |
| DEPT-03 Engineering | (+347, −210) | (+390.9, −207.5) | 44.0 | ✘ nominally. The measured envelope's right edge is the Live Activity clip line, so its centre is biased left; the room itself continues behind the panel |
| DEPT-04 Creative Studio | (−467, +65) | (−483.1, +65.0) | 16.1 | ✔ |
| DEPT-05 Management | (+558, +30) | (+548.5, +23.4) | 11.6 | ✔ |
| DEPT-06 Research | (−228, +178) | (−214.9, +182.2) | 13.9 | ✔ |
| DEPT-07 QA & Testing | (+247, +178) | (+241.2, +182.7) | 7.8 | ✔ |

### 3.9 Projection model alternatives
| Model | Room corners vs adopted perspective | Notes |
|---|---|---|
| Orthographic (same orientation, centred on the plinth) | Median 30.4 px, p90 54.8 px, max 62.0 px | Fixes the verticals (0° tilt) but loses the measured scale gradient |
| Affine (linear) approximation | Median 23 px, max 97 px on the floor | Not allowed for placement (`01 §5.3`) |

### 3.10 Implementation cross-check (Three.js r187, scratch Node 22)
| Check | Max error | Mean error |
|---|---:|---:|
| Plinth centre (0, 0.12, 0) → (903, 500) | 0.012 px | — |
| 28 room floor corners vs the Python solver | 0.30 px | 0.12 px |
| 7 sign anchors → measured centres (round trip) | 0.044 px | 0.026 px |
| 47 robot head points → measured head centres (round trip) | 0.036 px | 0.014 px |
| Plinth ellipse projected by Three.js | 794.6, 449.9, 217.0 × 102.4 → aspect 2.119 | — |

The remaining differences come from rounding the JSON values to 2–3 decimals. The camera config in `03 §2` is therefore implementation-ready.

## 4. Summary against the acceptance checklist

| VAC | Status after this mission | Evidence |
|---|---|---|
| VAC-CAM-01 framing anchors | ✔ plinth (by construction). The planter and Executive sign anchors are back-projections, so they hold by construction too | §3.2 |
| VAC-CAM-02 sign angles | ◐ 5/7 within ±3° (max error 5.1°) | §3.3 |
| VAC-CAM-03 plinth aspect | ✔ 2.119 (tolerance 2.17 ± 0.08) | §3.2 |
| VAC-CAM-04 scale constancy | ✔ ratio 1.32 vs measured 1.36 | `03 §4` |
| VAC-CAM-05 occlusion parity | ✔ 4/5, ⚠ Management right corner | §3.7 |
| VAC-GEO-01 diamond orientation | ✔ | §3.6 |
| VAC-GEO-02 lower-left slab | ✔ against the re-measurement; ✘ against the erroneous `analysis/03` line | §3.6, §6 |
| VAC-GEO-03 lower-right slab | ◐ within ±10 px over ≈85% of the stated line (max 14.2 px); 3–10° angular residual (open) | §3.6 |
| VAC-GEO-04 ring layout | ✔ 6/7 within ±20 px; Engineering 44 px (biased measurement) | §3.8 |
| VAC-GEO-08 no roof | ✔ | §3.6 |
| VAC-DEP-15 department set | ✔ exactly 7 rooms, no extras | `02 §3` |

These statuses apply to the **architecture** (geometry and camera). The full VAC items for materials and visuals remain for the build and QA phases.

## 5. Unmatched geometry, occluded regions, uncertain measurements, unavoidable differences

| Category | Item | Size of effect | Handling |
|---|---|---|---|
| Unmatched | Lower-right slab edge angle | 3–10° | Keep grid-aligned; owner decision Q-ARCH-05 |
| Unmatched | SIGN-02 / SIGN-03 angles | +3.5° / −5.1° | Keep geometry; optionally rotate the sign plates in plane by the residual (cosmetic, needs approval) |
| Unmatched | Vertical edges straighter than perspective predicts | 1–3.6° | Accepted (perspective chosen, `03 §5.3`) |
| Unmatched | Management right-corner occlusion | ~25 px | Low confidence; re-check in the art pass |
| Occluded | −X and −Z building edges; Marketing/Creative left parts; Engineering right part; Executive Office back; near corner | ND | Continuity geometry only if it stays hidden (Q-3D-08) |
| Uncertain | Room footprints without a digitised corner (Executive, Engineering, Creative) | ±10–35 px typical (LOO) | Medium–Low confidence; the art pass may refine against the overlay **without** changing adjacency or order |
| Uncertain | Executive Office plan aspect, chamfer, sign mounting | ND | A-EXEC-SYM, Q-ARCH-03 |
| Uncertain | Metric scale | ±5% from the desk spread; any uniform factor is valid | A-SCALE-01, Q-ARCH-02 |
| Uncertain | Partition / balustrade thickness | ND | 0.05 m placeholder |
| Unavoidable | A generated image is not one exact pinhole projection | Residuals above | Reported, **not hidden by moving the layout** |

## 6. Errata found in the Mission 002 analysis (not edited; owner decision Q-ARCH-07)

| ID | Location | Statement | Finding |
|---|---|---|---|
| E-01 | `analysis/03 §4` (intro) and §2.2 | Sign plates are "mounted above each room's atrium-facing glass" | The side signs are on each room's **far, camera-facing wall** (−X or −Z). Evidence: robot containment fails 39/39 with atrium-facing walls; crops show the Marketing sign above the back-wall displays. The Executive sign is mounted further back or higher than the front facet |
| E-02 | `analysis/03 §2.1`, `06 VAC-GEO-02` | Lower-left slab edge from (237,597) to (480,826), ≈43° | The visible slab edge runs at about 30–33° on screen, e.g. (235,630)→(560,820). The 43° line does not follow it. The 43° value fed the "41–68° elevation" cue in Q-3D-04 |
| E-03 | `analysis/03 §9.1` | Camera elevation 27°–60° (Low) | Solved 27.78° (27.56–28.01°) |
| E-04 | `analysis/03 §9.3` | "Record the solved values back into this spec" | Not done, to keep the Mission 002 analysis unchanged. The values live in `architecture/03` and the JSON. Owner decides whether to amend `analysis/03` |
