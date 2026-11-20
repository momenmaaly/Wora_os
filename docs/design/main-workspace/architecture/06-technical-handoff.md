# 06 — Technical Handoff: WORA Main Workspace 3D Environment

> Mission WORA-3D-ARCH-003, branch `arena/e6096316-wora-os`. From: 3D Environment Architect. To: 3D Artist / Scene Builder (next), then Frontend UI Architect, Interaction & State Engineer, Visual QA.
> Read in this order: `01` → `02` → `03` → `05` → `04` → this file. Data: `data/scene-architecture.json`.

---

## 1. What is delivered

| File | Content |
|---|---|
| `01-coordinate-system.md` | World frame (metres, +Y up, origin under the plinth centre, X/Z along the building grid), scale assumption, image↔world mappings with full matrices, transform strategy, assumption list |
| `02-floor-plan-architecture.md` | Plan diagram, 7 department footprints with projected corners, sign anchors and walls, atrium, walkways and clearances, slab edges, hidden extents, partitions and balustrades, elevations |
| `03-camera-architecture.md` | Solved HOME camera (position, target, FOV, yaw/pitch/roll with 90% intervals), Three.js config, solve procedure, Q-3D-04 status, perspective vs orthographic, responsive strategy, camera modes |
| `04-scene-hierarchy.md` | Scene graph, component boundaries, lighting architecture, performance budgets, camera mode controller, frontend↔scene API proposal, asset pipeline |
| `05-greybox-validation.md` | Greybox specification (G-01…G-20), validation results with independent vs by-construction labels, VAC status, unmatched / occluded / uncertain / unavoidable list, errata E-01…E-04 |
| `06-technical-handoff.md` | This file |
| `data/scene-architecture.json` | Machine-readable camera, scale, building, atrium, departments, robot floor positions, validation summary, assumptions (schema `wora-main-workspace-architecture/v1`) |

**Not modified:** the reference image, its `.sha256`, `DESIGN-SOURCE.md`, all `analysis/*` files, and `README.md`. No application code exists, and none was added.

## 2. Prototype status and stack justification

**Status: no greybox prototype is committed.** The repository contains only `README.md` and `docs/`: there is no `package.json`, build system or 3D runtime. The mission forbids introducing a stack without first documenting and justifying it.

The architecture was still validated end to end:
- a numerical projection model;
- projected-wireframe overlays;
- a real `three@0.187` `PerspectiveCamera` test.

All of this ran in a scratch environment **outside** the repository (`05 §3.10`).

**Proposed stack (decision Q-ARCH-01, owner approval required before any code lands):**

| Need (from `03`/`04`) | Proposal | Why |
|---|---|---|
| Standard pinhole camera with exact vertical FOV, lookAt and view offset | **Three.js** (r18x; verified with r187) | The `03 §2` config is already verified in it to ≤0.3 px. It has `setViewOffset` for responsive framing, plus `InstancedMesh`, glTF/KTX2/Draco/Meshopt loaders and selective bloom |
| DOM UI overlays above a full-bleed canvas | Any SPA framework. If React is chosen for the UI, use **@react-three/fiber** as the Three.js binding | Keeps the scene and UI in one component tree and event model; the R3F `frameloop="demand"` mode fits the static HOME (`04 §5`) |
| Build / dev server | **Vite + TypeScript** | Minimal configuration, fast HMR, typed `SceneConfig` from the JSON |
| Location in the repo | e.g. `apps/workspace/` with `src/scene/` mirroring `04 §3` | Keeps `docs/` as the specification |

The greybox prototype would then be:
- about 300 lines generating G-01…G-20 from `scene-architecture.json`;
- plus a dev-only reference overlay that P-6 forbids in production;
- plus an automated projection test equivalent to `05 §3.10`.

## 3. Instructions for the 3D Scene Builder

Follow these steps in order. Do not skip validation.

1. **Verify the reference** (P-1): `sha256sum -c docs/design/main-workspace/reference/wora-main-workspace.png.sha256` must print `OK`. If it does not, stop.
2. **Set up units and axes.** In your DCC tool and the runtime use metres, +Y up, right-handed, origin at the plinth's floor centre, with walls on the X/Z grid. Export glTF in world coordinates (`04 §8`).
3. **Create the HOME camera** with exactly `03 §2`: vFOV 12.0006°, position (60.675, 46.538, 61.964), target (−2.186, 0, −0.089), up +Y, aspect 1672/941. In a DCC tool, use either focal length 114.2 mm with sensor fit = vertical and sensor height 24 mm, or 96.4 mm with sensor fit = horizontal and sensor width 36 mm (same FOV). No lens shift.
4. **Build the greybox** G-01…G-20 (`05 §1`) from the JSON:
   - room footprints `departments[*].footprint`, partition height 2.07;
   - the plinth at the origin (r 2.383, h 0.12);
   - slab edges z = 13.91 and x = 14.6;
   - sign plates at `departments[*].sign`.
5. **Validate the greybox in HOME** at 1672×941 against the reference (a dev overlay is allowed; P-6 forbids it in production). Required before the art pass:
   - the plinth ellipse matches 795,450,217,100 within ±3 px;
   - the projected room floor corners match `02 §3` within ±1 px (this checks your camera and import, not the reference);
   - occluded room extremes stay behind the panels (`05 §3.7`).
6. **Art pass inside the footprints.**
   - Model partitions, glass, frames, the walnut wall, furniture and props per `analysis/03 §2–7`.
   - Place atrium props at the `02 §4` floor points.
   - You may refine a footprint against the overlay **only within the uncertainty in `05 §3.5`** (≈±30 px on screen). You must not change adjacency, ring order, room count or relative positions.
   - Record every refinement in the JSON (bump `schema`) and re-run the checks in `05 §3`.
7. **Do not add:**
   - doors or openings (Q-3D-01);
   - level changes (Q-3D-02);
   - extra rooms;
   - visible content in hidden regions (Q-3D-08);
   - robots: these come from the character pipeline, but robot floor positions are already in the JSON.
8. **Executive Office:** keep the chamfered front visually. The chamfer size, plan aspect and sign mounting are open (Q-ARCH-03). Match the screen appearance and log what you chose.
9. **Lower-right slab edge:** model it grid-aligned at x = 14.6 unless the owner rules otherwise (Q-ARCH-05). The 3–10° on-screen difference is a known residual.
10. **Hand over to Visual QA** with an overlay at 1672×941 and the numbers from `05 §3` recomputed for the built scene.

## 4. Unresolved decisions (none were resolved silently)

| ID | Sev. | Question | Recommended default (not applied as a design change) |
|---|---|---|---|
| Q-ARCH-01 | S1 | Approve an application stack for the greybox prototype and the app (`§2`) | Vite + TypeScript + Three.js (+ R3F if the UI is React) |
| Q-3D-04 | S1 → S2 | Camera cue conflict | Mostly resolved: pitch 27.78° (plinth 27.06°). Remaining residuals: lower-right slab 3–10°, SIGN-02/03 +3.5°/−5.1°, verticals ≤3.6°. Owner to accept the residuals |
| Q-ARCH-02 | S2 | Metric scale (A-SCALE-01, desk 0.75 m) → partitions 2.07 m (stylised, low) | Keep. A uniform rescale does not change the composition |
| Q-ARCH-03 | S2 | Executive Office plan aspect (A-EXEC-SYM), chamfer size, SIGN-01 mounting | Square plan, chamfer per visuals, sign at its measured screen position |
| Q-3D-03 / Q-ARCH-04 | S2 | Perspective (f 4476 px) vs orthographic | Perspective (`03 §5.3`) |
| Q-ARCH-05 | S2 | Lower-right slab edge skew (3–9° in world terms) | Grid-aligned edge at x = 14.6; accept the residual |
| Q-ARCH-06 | S2 | Extents of hidden regions (−X, −Z edges; Marketing/Creative left; Engineering right; Executive back; near corner) | Minimal continuity geometry that stays hidden in HOME |
| Q-ARCH-07 | S3 | Apply errata E-01…E-04 to `analysis/03` (as its §9.3 asks)? | Owner's choice. The architecture docs already use the corrected facts |
| Q-RESP-01 | S2 | Supported aspect ratios | `03 §6` rule. Portrait is not supported without a new design |
| Q-3D-01 | S2 | Doors / openings | None in the greybox |
| Q-3D-02 | S2 | Level change at the balustrades between the atrium and rooms | Single level |
| Q-3D-07 | S2 | Light strips emissive vs specular | Decide in the art pass |
| Q-3D-08 | S2 | Hidden content | Must stay hidden in HOME |
| Q-DATA-01 | S1 | UI shows 24 AI Employees vs 47 robots in the scene | Not an architecture decision; affects `ActorSystem` |

Also still open from Mission 002 and owned by other roles: Q-UI-06 (font), Q-ASSET-01 (logo source), Q-ASSET-02 (avatar photo), Q-3D-05 (U-01…U-03), Q-3D-06 (DOF), Q-3D-10 (exact room plans: **partly answered** by `02 §3` at Medium–Low confidence).

## 5. Responsibilities of the next roles

| Role | Takes from this mission | Must preserve |
|---|---|---|
| 3D Artist / Scene Builder | `02`, `03 §2`, `05 §1`, JSON | Footprints, HOME camera, IDs, hidden-region rule |
| Frontend UI Architect | `04 §1, §3, §7`, `03 §6` | Full-bleed canvas behind the panels; panels own pointer events where they cover the canvas |
| Interaction & State Engineer | `04 §6–7` | HOME is restorable exactly; the scene emits events and does not own UI state |
| Visual QA | `05`, `analysis/06` | Validate in HOME at 1672×941, DPR 1; report residuals with the same independent / by-construction distinction |

## 6. Tests and validation performed

| Test | Result |
|---|---|
| Reference checksum (`sha256sum -c`) before and after | OK / OK |
| Camera line fit (270 inlier segments, bootstrap n = 150) | Pitch 27.78° [27.56, 28.01], yaw 225.37° [223.88, 227.11], f 4476 px [3976, 5026] |
| Plinth aspect (independent) | 2.119 vs 2.17 ± 0.08 ✔ |
| Sign angles (independent) | 5/7 within ±3° |
| Free-roaming robots outside rooms (independent) | 7/7 |
| Zone robots inside rooms | 40/40 (35/40 without the containment constraint) |
| Digitised corners, leave-one-out | 10.5–72.1 px (median 26.5 px) |
| Ring offsets (VAC-GEO-04) | 6/7 within ±20 px |
| Occlusion parity | 4/5 hidden as in the reference; Management right corner ⚠ |
| Three.js r187 `PerspectiveCamera` vs solver | ≤0.3 px on 28 corners; plinth centre 0.012 px |
| JSON validity | Parsed by Python `json` and Node `JSON.parse` |
| Repository scope | Only `docs/design/main-workspace/architecture/` added |

## 7. Reproducing the validation

The scratch tooling was deliberately not committed, to avoid adding a stack. To reproduce:
1. Use Python ≥3.10 with numpy, scipy, scikit-image and Pillow, in a virtual environment **outside** the repo.
2. Detect lines as in `03 §3` steps 1–4.
3. Reproduce the projections from the matrices in `01 §4` and the formulas in `01 §5`.
4. Rebuild each room from the constraints in `02 §1`.
5. For the Three.js check: `npm i three@0.187` in a scratch folder, build the camera exactly as in `03 §2`, and project the JSON points with `Vector3.project` → px = ((x+1)/2·W, (1−y)/2·H).

The Scene Builder's own validation (§3 step 5) only needs the JSON and the HOME camera.
