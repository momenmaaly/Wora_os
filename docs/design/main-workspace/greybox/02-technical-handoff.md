# 02 — Technical Handoff: Executable 3D Greybox

> Mission **WORA-3D-GREYBOX-004**, branch `arena/e6096316-wora-os`. From: 3D Greybox Builder. To: **3D Scene Builder** (structural review, then detailed modelling). Also for Frontend UI Architect, Interaction & State Engineer, Visual QA.
> This file supersedes `architecture/06-technical-handoff.md` §2 ("no prototype is committed") and §7 (scratch-only reproduction). All other parts of `architecture/06` still apply.
> Read in this order: this file → `01-greybox-validation-report.md` → `apps/workspace/README.md` → `architecture/02`, `03`, `05`.

---

## 1. What is delivered

| Deliverable | Location |
|---|---|
| Executable greybox (React + TypeScript + Vite + three r187 + @react-three/fiber 9) | `apps/workspace/` |
| Scene source | `apps/workspace/src/` (config, scene, dev, validation) |
| Setup and run instructions | `apps/workspace/README.md` (pointer in the root `README.md`) |
| Automated validation | `apps/workspace/tests/` (31 tests), `scripts/check-dist.mjs`, `npm run validate` |
| Greybox validation report | `docs/design/main-workspace/greybox/01-greybox-validation-report.md` |
| Metrics data (numbers only) | `greybox/data/greybox-metrics.json` (regenerable) and `greybox/data/rendered-check.json` |
| This handoff | `greybox/02-technical-handoff.md` |

**Not modified:** the reference image and its `.sha256`, `DESIGN-SOURCE.md`, all `analysis/*` and all `architecture/*` files (including the JSON). The approved stack covers the frontend/3D prototype only. **No backend** was added.

## 2. Decisions applied (from the owner) and how

| Decision | Implementation |
|---|---|
| Stack approved (Q-ARCH-01 resolved for the prototype) | React 19.2, TypeScript 5.9, Vite 8.3, three 0.187, @react-three/fiber 9.8 (R3F as the integration layer). Versions are pinned with `^` in `package.json` and locked in `package-lock.json` |
| Perspective camera approved | `PerspectiveCamera` with the exact `architecture/03 §2` HOME config. `CameraRig` throws if the camera is not perspective |
| 0.75 m desk height is provisional | Scale-derived values are read from the JSON (`scale.derived`) and not hard-coded. A uniform rescale only needs a JSON change |
| Executive geometry limited to supported measurements | 7.1 × 7.1 m square footprint from the JSON (A-EXEC-SYM). No chamfer and no back-wall detail. SIGN-01 sits at its measured screen position |
| Hidden building areas must not be invented | The slab stops at the minimum supported extents (−X at Marketing x0 = −17.18, −Z at Engineering z0 = −15.30). Balustrades only along the two visible edges. No continuity geometry |
| Investigate the lower-right edge | Done (`01 §4`). The edge stays grid-aligned at x = 14.6; Q-ARCH-05 stays open with quantified options |
| Do not change the 24 AI Employees label or the 47 robot count | No UI is drawn. The data is untouched and guarded by tests. Robots appear only as dev markers (47 IDs) |

## 3. Scene source map

| Concern | File | Notes |
|---|---|---|
| Data access | `src/config/sceneConfig.ts` | Typed view of `scene-architecture.json` and `measurements.json`, imported through the Vite/TS aliases `@architecture` and `@analysis`. Schema-checked at import. Contains no geometry |
| Validation-only measurements | `src/config/referencePoints.ts` | Digitised corners, slab-edge lines, sign angles and ring offsets, copied verbatim from M002/M003 |
| Camera and responsive rule | `src/scene/camera.ts` | `applyHomeCamera`, `fovForAspect`, `SAFE_RECT`, `projectToPixels` |
| Structural model | `src/scene/model.ts` | Pure descriptors for G-01 slab, the building mass, G-02/03 balustrades, G-04 plinth, G-05…11 rooms (floor + 4 partitions + hit volume) and G-12…18 sign plates. **The renderer and the tests both consume this** |
| Rendering | `src/scene/Greybox.tsx`, `Lights.tsx`, `materials.ts`, `CameraRig.tsx`, `WorkspaceCanvas.tsx` | Neutral materials, outline edges, hemisphere + 1 directional light (G-20). Flat ID-colour mode is for measurement only |
| Dev inspector | `src/dev/*` | Overlay (DEV only), markers, slab-edge lines, UI rects, layers, orbit, rendered check |
| Metrics | `src/validation/metrics.ts` | Every number in the validation report |

Scene graph (names as in `architecture/04`):

```
World
├── Building: slab-main (G-01), building-mass (placeholder), balustrade-plusZ (G-02), balustrade-plusX (G-03)
├── Atrium: plinth (G-04)
└── Departments: DEPT-01…07, each with floor, wall-x0/x1/z0/z1, SIGN-0n-plate
```

Each group carries `userData.refId` or `userData.name` for later picking (`architecture/04 §6`).

## 4. Placeholders and estimates (not measurements)

| Value | Used for | Source |
|---|---|---|
| Slab thickness 0.3 m | G-01 | `architecture/05` placeholder |
| Building mass 11 m deep | Plain stand-in for the lower storeys under the visible edges (ENV-014/015); minimum depth that fills the frame bottom in HOME | Tested (`building mass covers visible facade`) |
| Partition thickness 0.05 m, balustrade 0.03 m, floor plate 0.02 m | Rooms and edges | Placeholders |
| Sign plate 0.93 m high; lengths 4.12 / 4.06 / 5.26 / 4.37 / 3.94 / 3.17 / 3.61 m | G-12…18 | Height from frontal SIGN-01 (est.); lengths fitted to the measured box widths (test reproduces the fit) |
| Partition height 2.07 m, balustrade 1.27 m, plinth top 0.12 m | All | JSON `scale.derived` (provisional scale) |

## 5. Instructions for the 3D Scene Builder

1. **Verify the reference** (P-1): `cd docs/design/main-workspace/reference && sha256sum -c wora-main-workspace.png.sha256` must print `OK`. Run it from `reference/` (E-05).
2. **Run the greybox:** `cd apps/workspace && npm install && npm run validate && npm run dev`. Open `/#/dev`.
3. **Structural review.** In the dev inspector, use the reference frame with the overlay at about 50 % and the markers on. Confirm the open items in `01 §7`, and sign off or raise them with the owner before modelling.
4. **Detailed modelling inside the footprints.**
   - Replace the primitives in `model.ts` / `Greybox.tsx` with modelled assets placed in the same world coordinates. Keep the IDs.
   - Do not move or resize footprints except within the `architecture/05 §3.5` uncertainty.
   - Never change order, adjacency or room count.
   - Record any refinement in `scene-architecture.json` (bump `schema`). Then re-run `npm run validate` and `WRITE_METRICS=1 npx vitest run tests/report.test.ts`.
5. **Keep the guard rails green.** Several tests pin known residuals: 5/7 sign angles, 6/7 ring offsets, 4/5 occlusion, the +X distance profile. A change in them means the geometry moved; it must be explained and approved, not silently re-pinned.
6. **Still not allowed without approval:**
   - doors or openings (Q-3D-01);
   - level changes (Q-3D-02);
   - extra rooms;
   - content in hidden or ND regions (Q-3D-08 / Q-ARCH-06);
   - a skewed +X edge (Q-ARCH-05);
   - an Executive chamfer size (Q-ARCH-03);
   - robots outside the character pipeline.
7. **Reference overlay** is for QA only (P-6). Never import the PNG in `src/`. `check-dist` will fail the build check if the image, an `/@fs/` path or the overlay code reaches `dist/`.

## 6. Notes for the other roles

| Role | Notes |
|---|---|
| Frontend UI Architect | The canvas is full-bleed (`position:absolute; inset:0`). UI panels must be DOM overlays above it (`architecture/04 §1.4`). The default route deliberately draws no panels. The 24 AI Employees label must be implemented exactly as in `analysis` (VAC-TXT-22) |
| Interaction & State Engineer | HOME is restorable exactly (`applyHomeCamera`; the dev "Reset to HOME" button proves it). `window.__WORA_CAMERA__` is a dev convenience, not an API |
| Visual QA | Use the dev route with `frame=reference`, `overlay`, `markers` and `ui=1`. Use the flat mode plus `__WORA_RENDERED_CHECK__()` for render-vs-model checks. Report with the independent / by-construction distinction |

## 7. Open decisions (none resolved silently)

| ID | Status after M004 | Recommended default |
|---|---|---|
| Q-ARCH-01 | **Resolved** for the frontend/3D prototype (owner approval). Backend is out of scope | — |
| Q-3D-03 / Q-ARCH-04 | **Resolved**: perspective (owner approval) | — |
| Q-ARCH-02 scale | Open (provisional 0.75 m desk) | Keep |
| Q-ARCH-03 Executive Office | Open | Square plan, no chamfer in the greybox |
| Q-ARCH-05 lower-right edge | Open, **investigated** (`01 §4`) | Accept the residual (grid-aligned x = 14.6) |
| Q-ARCH-06 / Q-3D-08 hidden extents | Open. **Both −X and −Z edges are visible in HOME** at the minimum extents (`01 §7 U-1`) | Owner to define extents or approve continuity geometry |
| Q-ARCH-07 errata E-01…E-05 | Open | Owner's choice |
| Q-RESP-01 supported aspects | Open | `architecture/03 §6` rule as implemented; portrait unsupported |
| Q-3D-01 / 02 / 07 | Open | None / single level / art pass |
| Q-DATA-01 24 vs 47 | Open, untouched | Not an architecture decision |
| New: plinth drum height (`01 §7 U-4`) | Open | Keep 0.12 m (est.); confirm what the measured box covers |

## 8. Tests and validation performed in this mission

| Test | Result |
|---|---|
| Reference checksum before and after | OK / OK |
| `npm run typecheck` | Pass (also validates every JSON field path used) |
| `npm test` (vitest, 4 files) | 31 / 31 pass |
| `npm run build` | Pass; single JS chunk ≈1.2 MB (≈329 kB gzip), no raster assets |
| `node scripts/check-dist.mjs` | OK |
| Rendered check (headless Chromium 153, SwiftShader WebGL 2, 6 sizes) | Plinth ≤ 0.5 px, signs ≤ 0.8 px, floor corners ≤ 2.6 px (render vs model) |
| Dev server on 0.0.0.0:5173 | Default and `#/dev` routes render; camera read back equals HOME; FOV per rule at every size |
| Scratch-only checks (not committed) | Overlay visual inspection; reference brightness-step probe along both lower edges (`01 §4`) |
