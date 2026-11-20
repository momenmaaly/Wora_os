# 03 — Camera Architecture: WORA Main Workspace

> Coordinate system: `01-coordinate-system.md`. Values: `data/scene-architecture.json → camera`.
> Principle (mission brief and `analysis/03 §9.3`): the camera is **solved numerically from the reference**, not chosen for looks. Every number below comes from a fit with stated residuals. Where cues conflict, the conflict is reported, not hidden.

---

## 1. Result (reference camera state, "HOME")

| Parameter | Value | Uncertainty / note |
|---|---|---|
| Projection | **Perspective** | Orthographic is a documented alternative (§5.3, Q-3D-03) |
| Position | **(60.675, 46.538, 61.964) m** | Distance to the origin 98.42 m. Scales with A-SCALE-01 |
| Target (`lookAt`) | **(−2.186, 0.000, −0.089) m** | The point on the floor under the principal point (836, 470.5). The plinth (0, 0.12, 0) projects to (903, 500) |
| Up | (0, 1, 0) | Roll = 0 (A-ROLL-01) |
| Vertical FOV | **12.0006°** | Bootstrap focal-length 90% interval 3976–5026 px → vFOV 13.5°–10.7° |
| Horizontal FOV | 21.158° at aspect 1672/941 = 1.776833 | — |
| Focal length | f = 4476.3 px at 941 px height ≈ **114.2 mm** at a 24 mm frame height (vertical fit) ≈ 96.4 mm at a 36 mm frame width (horizontal fit) | A long lens. This explains the near-constant robot scale noted in `analysis/03 §9.1` |
| Yaw (azimuth of view direction) | 225.37° | 90% interval 223.88°–227.11°. The view runs along the building diagonal (−X −Z) to within 0.4°; 225° (exactly diagonal) lies inside the interval |
| Pitch (down) | **27.78°** | 90% interval 27.56°–28.01° |
| Roll | 0° (fixed) | Fitted value 0.07°. 90% interval −1.08°…+1.46° |
| Near / far planes | 1.0 m / 400 m | Recommended; not derived from the reference. Narrow FOV + 98 m distance → depth precision is fine with these values |
| Principal point | Canvas centre (A-PP-01) | — |

### 1.1 What this means in plain terms
- The camera hangs about 46.5 m above the floor and about 87 m back horizontally, beyond the near (+X +Z) corner. It looks down the building diagonal at 27.8° below the horizontal through a long (≈114 mm) lens.
- The scene axis is offset to the right of the image centre (x≈876–912 vs 836, `analysis/03 §9.1`). That offset comes from the camera **target**: the plinth sits 67 px right and 29.5 px below the image centre. There is no lens shift.

## 2. Implementation config (Three.js; any engine with a standard pinhole camera works)

```js
// HOME camera — reference composition at any 16:9 canvas (e.g. 1672×941, 1920×1080)
const HOME = {
  fov: 12.0006,                       // vertical, degrees
  position: [60.675, 46.538, 61.964], // metres
  target:   [-2.186, 0.0, -0.089],
  up:       [0, 1, 0],
  near: 1.0, far: 400.0,
};
camera = new THREE.PerspectiveCamera(HOME.fov, canvas.clientWidth / canvas.clientHeight, HOME.near, HOME.far);
camera.position.set(...HOME.position);
camera.up.set(...HOME.up);
camera.lookAt(...HOME.target);
camera.updateProjectionMatrix();
```
- **Verified** with `three@0.187` (r187) in a scratch Node environment. It projects the plinth centre to (903.0, 500.0) ±0.012 px, and all 28 room floor corners match the solver to ≤0.3 px (`05 §3.10`).
- No camera controls may move the HOME state. Any later camera movement (department focus etc.) must be able to return to exactly these values (`04 §6`).

## 3. How it was solved (reproducible procedure)

1. **Line extraction.**
   - Canny edges (σ 1.4) on the reference, with all UI panels and sign plates masked out.
   - Probabilistic Hough transform at two scales: 385 segments of 25 px or longer.
2. **Camera model.** Pinhole; principal point at the canvas centre; unknowns are yaw, pitch, roll and f.
   - World directions X, Z (floor/partition grid) and Y (verticals) have vanishing points v = K·R·d.
3. **Robust fit.**
   - Each segment is assigned to the family whose vanishing direction (seen from the segment midpoint) is closest. The angular threshold is reduced over iterations from 8° to 4°.
   - Then minimise the length-weighted angular residuals (soft-L1 loss).
   - Inliers: **X 170, Z 90, Y 10** segments.
4. **Uncertainty.** 150 bootstrap resamples of the inliers, plus a profile over f (§5.2).
5. **Scale and position.**
   - Place the camera on the ray through (903, 500) so the plinth top centre (0, 0.12, 0) projects exactly there.
   - Pick the distance along that ray so that a 0.75 m desk height projects to the measured mean of 32.5 px (A-SCALE-01).
6. **Independent checks** (not used in the fit):
   - plinth ellipse aspect
   - sign-plate angles
   - lower-left slab edge
   - robot containment
   - leave-one-out corners
   - occlusion parity

   All are reported in `05`.

Line-fit residuals (median / 90th percentile): X 1.29° / 3.24°, Z 0.94° / 2.34°, Y 1.40° / 2.68°.

## 4. Validation against the reference cues from `analysis/03 §9` and `06 §8`

| Cue | Reference | Model | Result |
|---|---|---|---|
| Plinth centre (VAC-CAM-01) | (903, 500) | (903.0, 500.0) | ✔. Exact **by construction** (origin choice), so it is not independent evidence |
| Plinth ellipse aspect (VAC-CAM-03) | 217 × 100 → 2.17 ± 0.08 | 217.0 × 102.4 → **2.119** | ✔ within tolerance (−0.051). Independent of the line fit |
| Pitch implied by the plinth alone | — | 27.06° | Agrees with the line fit (27.78°) to **0.7°** |
| Sign angles (VAC-CAM-02, ±3°) | 0, −24, +26, −24, +22, −27, +26 | 0.1, −20.5, +20.9, −22.8, +22.4, −24.8, +25.1 | **5 / 7 within ±3°.** SIGN-02 Marketing +3.5° and SIGN-03 Engineering −5.1° fail. Both are at the top periphery (`05 §3.3`) |
| Scale constancy (VAC-CAM-04) | Robot heads 22–30 px (ratio 1.36) | 39.6 → 52.2 px/m top to bottom (ratio 1.32) | ✔ consistent |
| Building diagonal vertical (VAC-GEO-01) | Far corner top-centre, near corner bottom-centre | Yaw within 0.4° of the diagonal | ✔ |
| Occlusion parity (VAC-CAM-05) | Same parts hidden by the UI | Every occluded room extreme projects behind its panel | ✔ (`05 §3.7`) |

## 5. Conflicting cues: Q-3D-04 status

### 5.1 "27° vs 41–68°" (analysis/03 §9.1)
- **Mostly resolved.** The plinth ellipse (27.06°) and the global line fit (27.78°) agree.
- The 41–68° estimate came from the floor-slab edge angles under an orthographic, 45°-azimuth assumption. Re-measured:
  - **Lower-left slab edge:** about 30–33° on screen, not 43°. The `analysis/03 §2.1` value (237,597)→(480,826) does not follow the slab edge visible in zoomed crops. Under the solved camera the lower-left edge is parallel to the world X axis to within 0.5–3.7°, so it is **consistent** once perspective is included: lines near the frame edge steepen under perspective.
  - **Lower-right slab edge:** about 33.5° (`analysis/02`) to 40.4° (longest Hough segment) on screen. The model predicts 30.3° there, a 3–10° residual. In world terms the edge would be skewed 3–9° from the grid. This **remains open** (Q-ARCH-05). Do not change the layout to hide it.

### 5.2 Focal length (narrow vs wider FOV)
Profile of the line-fit cost against a fixed f, with the angles re-fitted at each step:

| f (px) | 900 | 1600 | 2500 | 4000 | **4476** | 6000 | 10000 | 30000 |
|---|---|---|---|---|---|---|---|---|
| Cost | 1820 | 722 | 368 | 271 | **≈270** | 280 | 321 | 389 |
| Pitch (°) | 30.4 | 27.5 | 27.6 | 27.8 | 27.8 | 27.8 | 27.8 | 27.9 |

The pitch is stable (27.5–27.9°) for any f ≥ 1600. The minimum is shallow between about 4000 and 6000. The plinth aspect changes by only 0.05 between f = 2000 and f = 10000, so the composition depends little on the exact f inside the interval.

### 5.3 Verticals and perspective vs orthographic (Q-3D-03)
- The 10 vertical segments detected measure 0.0–1.3° from vertical. At their positions the model predicts tilts of 1.0–3.6° (the largest is near the top-right corner). The reference's verticals are **straighter than a pitched pinhole camera produces**, a typical trait of generated images.
- An orthographic camera (same orientation, 45.51 px/m, centred on the plinth) would fix the verticals. But it moves room corners by a median of **30.4 px** (90th percentile 54.8, max 62.0) relative to the perspective solution, and loses the measured top-to-bottom scale gradient (ratio 1.32 vs the measured 1.36).
- **Recommendation: perspective (HOME above).** The vertical residual of up to ~3.6° is accepted as unavoidable (`05 §5`).
- Orthographic frustum, if the owner decides otherwise: left −19.841, right 16.896, top 10.986, bottom −9.690 m around the plinth top centre, same position direction (JSON `camera_alternative_orthographic`).

## 6. Responsive viewport strategy (Q-RESP-01 is still open; this is the recommended default)

- **Same aspect (16:9) at any resolution:** use the HOME values unchanged. The composition is identical; only the pixel density changes.
- **Other aspects:** keep the **composition safe rectangle** visible. This is the union of the seven sign plates and the plinth: px x 248–1580, y 141–642 at 1672×941. In tangent space relative to the principal point that is L −0.1314, R +0.1662, T −0.0736, B +0.0383.

| Aspect a | Rule | vFOV | hFOV | Consequence |
|---|---|---:|---:|---|
| a ≥ 1.7768 (wider than reference), up to 2.537 | Keep **hFOV = 21.158°** (fit width): vFOV = 2·atan(0.18676 / a) | e.g. 21:9 → 9.152° | 21.158° | Crops the top exterior band and the near corner (already behind the command panel). Reveals **no ND content** at the sides |
| 1.581 ≤ a < 1.7768 (e.g. 16:10) | Keep **vFOV = 12.0006°** | 12.001° | e.g. 19.09° | Crops the sides slightly; the safe rectangle remains visible |
| a < 1.581 (e.g. 4:3) | vFOV = 2·atan(0.1662 / a) | 4:3 → 14.21° | 18.87° | Reveals more above and below the reference frame. That content is ND and needs continuity geometry and owner sign-off |
| Portrait (e.g. 9:16) | Not supported by this composition | (32.9° would be needed) | — | Needs a separate design decision |

- Implementation: recompute `camera.fov` on resize using the rule above. Keep `position` and `target` fixed so the plinth stays the compositional centre.
- `camera.setViewOffset` can keep the plinth at the same normalised screen position (0.540, 0.531) if the UI layout requires it.
- UI panels resize independently (Frontend UI Architect). Re-run the occlusion check (`05 §3.7`) for each supported breakpoint, because panels hide different scene regions at other sizes.

## 7. Camera modes (architecture only, not implemented)

| Mode | Purpose | Constraint |
|---|---|---|
| HOME | Reference composition (this document) | Immutable values. All validation is done here |
| FOCUS(dept) | Optional future zoom to a department | Must be an animated transition that can return to HOME exactly. Not defined by the reference, so it needs owner/UX approval |
| FLOOR_PLAN / LIVE_VIEW | The "Floor Plan" (UI-091) and "Live View" (UI-092) tabs in the view switcher REG-08; "3D View" (UI-090) is the active tab in the reference | **ND.** The reference only shows the "3D View" state. Do not design it here |

Free orbit, pan and zoom are **not** part of the reference and stay off unless approved.
