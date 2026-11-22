# 05 — Mission 006 Plan: 3D Scene Building Phase (WORA-3D-SCENE-006, proposed)

> Status: **PLANNED — implementation not started.** Prepared 2026-11-20 on branch `arena/e6096316-wora-os`; PR #1 is open and **not merged** (merging is the owner's call).
> Baseline: the Mission 005 review is **accepted for handoff**; its owner decisions (`04-correction-plan.md` §0) are binding for every workstream below.
> The original reference image remains the **absolute visual authority**. No redesign; no invented visible elements; the reference is never modified.

## 1. Binding baseline

| Item | Constraint carried into Mission 006 |
|---|---|
| CR-01 | +X edge stays grid-aligned at x = 14.6; the 3–10° residual is documented, never "fixed" with artificial distortion |
| CR-02 | Building extents: x −17.18 … 14.6, z −15.30 … 13.91 (minimum supported). Everything visible beyond is **environmental background**, not building |
| CR-05 | Sign angles are the solved ones; SIGN-02 +3.5° / SIGN-03 −5.1° residuals are preserved and documented |
| CR-06 | Uniform 0.93 m sign plate height, provisional |
| CR-07 | Executive Office is square 7.10 × 7.10 m **in the greybox only**; final geometry unresolved — must not be treated as confirmed |
| Q-3D-08 | Hidden/ND content stays hidden in HOME; nothing occluded by REG-02/04/06/07 is modelled into visibility |
| Labels/counts | The 24 AI Employees label (UI) and the 47 visible robot count are immutable |
| Process | Geometry/placement changes only via `scene-architecture.json` schema bump → `npm run validate` → regenerate `greybox-metrics.json` |

**Test preservation rule (owner instruction):** all 31 existing passing tests must survive every workstream. Additions are allowed; thresholds must not be weakened; a changed metric value must be explained and approved, never silently re-pinned.

## 2. Common inputs and tooling (all specialists)

- Docs: `DESIGN-SOURCE.md`; `analysis/01–07` + `analysis/data/measurements.json`; `architecture/01–06` + `architecture/data/scene-architecture.json`; `greybox/01–04` + `greybox/data/*.json`.
- App: `apps/workspace/` — model in `src/scene/model.ts`, camera `src/scene/camera.ts` (never repositioned; only `fovForAspect` applies), materials `src/scene/materials.ts`, dev inspector `src/dev/`.
- Verification tools: `npm run validate` (tsc + 31 tests + build + check-dist); `WRITE_METRICS=1 npx vitest run tests/report.test.ts`; rendered check (`__WORA_RENDERED_CHECK__()`); dev routes with `overlay`, `markers`, `edges`, `ui`, `frame` parameters; screenshots committed **only** under `greybox/review/` as review artifacts (owner decision 2026-11-20).
- Before any session: `cd docs/design/main-workspace/reference && sha256sum -c wora-main-workspace.png.sha256`.

## 3. Workstream 006-A — Environment specialist

**Scope.** The building and its setting:
1. Building mass under the slab: facades, glazing bands, and the organic curved parapet silhouette (CR-08; ENV-014/015 regions and the ENV-016 top band).
2. Slab surface: walkways, atrium floor, balustrades → glass, partitions → glazed panels (doors stay absent — Q-3D-01).
3. Atrium plinth details: glowing rim, logo mark (ENV-003), wordmark (ENV-004).
4. Sign plates: text and iconography per `analysis` TXT catalogue; angles fixed (CR-05); height provisional (CR-06).
5. Lighting: honour LGT-01…06; decide Q-3D-07 (light strips emissive vs specular) with the owner; no arbitrary decorative effects.
6. Environmental background per CR-02: exterior glazing, city backdrop, greenery, rooftop band — scenery beyond the building, never extending the floor plate.

**Out of scope:** robots (006-B), furniture (006-C), UI (never part of the 3D scene).

**Handoff criteria (all verifiable):**
- **A1** At HOME 1672×941: mass/parapet silhouette within ±15 px (P-4) of reference sample points along the ENV-014/015 tops; floor plate still ends at the approved extents.
- **A2** Non-regression: VAC-GEO-01/02/03/08 metrics; the +X edge residual unchanged and documented (CR-01).
- **A3** Sign plates: angles unchanged within ±0.2°; text content matches the TXT catalogue; VAC-CAM-02 not artificially "improved" by fitting distortion.
- **A4** Plinth metrics non-regression (centre 3.6 px, width 0 px, top-ellipse aspect 2.119); rim/mark/wordmark land inside their ENV-002/003/004 boxes ±10 px.
- **A5** Lighting complies with LGT-01…06; the Q-3D-07 decision is written down.
- **A6** Guards: `check-dist` green; overlay dev-only; 31 tests preserved plus new tests for every new structural element.

## 4. Workstream 006-B — Robots specialist

**Scope.** The 47 visible robots (ROBOT-01…47, `analysis/02` §5 positions + `analysis/03` §5 appearance/pose): 40 zone robots and 7 free-roaming, in their catalogued poses (seated/standing/working). The three uncertain robot-like objects U-01…U-03 are **excluded** unless the owner approves them.

**Out of scope:** environment, furniture, robot count or identity changes.

**Handoff criteria:**
- **B1** Exactly 47 robots rendered in HOME; each projected anchor within ±15 px (P-4) of its measured centre; per-robot deviations listed in the workstream report.
- **B2** Zone/free assignment preserved; free robots stay inside their measured boxes.
- **B3** Scale constancy documented against VAC-CAM-04 (M003 residual 1.32 vs 1.36 — reported, not silently fitted).
- **B4** Occlusion parity VAC-CAM-05 maintained: robots behind REG-02/04/06/07 remain hidden in HOME.
- **B5** No robot outside the reference's visible set; nothing invented behind occluders.
- **B6** Placement data via the JSON schema bump; 31 tests preserved plus per-robot count/zone tests.

## 5. Workstream 006-C — Furniture specialist

**Scope.** Catalogued furniture only: atrium items ENV-005 (planter + tree), ENV-006–ENV-010 (seating), ENV-011/012 (trees), ENV-013 (cabinets); department furniture per the `analysis/03` §3 catalogue (desk groups, chairs, monitors/screens per department). Materials approximate the `analysis/05` palette.

**Out of scope:** robots, environment structure, any item not in the catalogue, decorative extras.

**Handoff criteria:**
- **C1** Every catalogued item lands inside its measured ENV box (±10 px projected at HOME). The ENV-005 JSON point is the planter's **floor base**, not its visible centre (802, 402) — the documented note stays.
- **C2** Nothing outside the catalogue; nothing in ND/hidden regions.
- **C3** Desk groups stay inside their room footprints; walkway clearances (`ring_clearances_m`) preserved.
- **C4** Materials limited to the `analysis/05` palette; no effects beyond spec.
- **C5** 31 tests preserved plus placement tests for each catalogued item.

## 6. Sequencing and integration

1. **006-A first** (structure), integrated and accepted against A1–A6.
2. **006-B and 006-C in parallel** on the accepted A base; each lands separately with `npm run validate`, regenerated metrics, a rendered check, and its own review-artifact set + mini acceptance report.
3. JSON is the single geometry source; workstreams never fork the model by hand-editing components.
4. **Mission 006 acceptance (gate to any "final" stage):** full VAC checklist run (`analysis/06` §0–11), rendered check at six sizes, side-by-side review artifacts, a new validation report in this doc series, reference checksum verified, all tests green, PR updated — **no merge without the owner.**

## 7. PR and repository checks (reported 2026-11-20, before any implementation — owner instruction)

| Check | Result |
|---|---|
| PR #1 state | OPEN, head `9af22cb` = branch HEAD (verified via `gh pr view` and `git rev-parse`) |
| Expected commits present | All six: `ea16fe2` M001, `8c4301d` M002, `985e7a6` M003, `bbc43b4` M003 fix, `3b38b59` M004, `9af22cb` M005 |
| Review artifacts present | **57/57 PNGs** (20.38 MB blob bytes) under `greybox/review/` in the tree at the PR head, plus `03`/`04` docs. Note: GitHub's PR file list caps at 100 entries (shows 44 PNGs); verified from git directly |
| Repository storage | Object store ≈ 23.4 MiB total (loose). Largest blobs: reference 2.6 MB; R04/R03 review shots 2.1 MB each; next largest ≤ 0.9 MB. Screenshots add ≈ 20.4 MB to clone/checkout — acceptable for this docs-heavy repo; no git-lfs in the environment; an LFS migration remains available later if wanted |
| Build output impact | **None.** `review/` is under `docs/`, outside the Vite app; `dist/` = index.html + one JS chunk + sourcemap, no raster assets; `check-dist: OK` |
| Tests preserved | `npm run validate` re-run: **31/31 passed**, build OK, check-dist OK |
| Merge status | **Not merged** — awaiting owner |
| Implementation status | **Not started** — this document is the preparation only |
