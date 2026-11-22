# 08 — VF-1 Materials & Lighting Report

**Mission:** VF-1 (Visual Foundation Completion Plan §3, owner-approved 2026-11-20) · **Owner role:** 3D Scene Builder (materials) · **Status: COMPLETE — awaiting owner visual approval at the VF-1 gate. Nothing beyond VF-1 was started.**
**Branch:** `arena/e6096316-wora-os` · **Commit:** `⟨see git log — this file is committed together with the implementation⟩` · **Date:** 2026-11-20
**Review package:** `greybox/review/index.html` § 4-VF1 (full-frame pair, adjustable-opacity overlay, 7 close-up pairs, phone evidence, quantitative table, deviation table).

---

## 1. Scope executed (exactly the approved VF-1 scope)

| Requirement (plan) | Delivered |
|---|---|
| PBR surfaces from the sampled palette | `src/scene/materials.ts` rewritten: MeshStandardMaterial/MeshPhysicalMaterial per key; base colours byte-identical to the 006-A catalogued values (test-enforced) |
| Glass transparency/reflection | MeshPhysicalMaterial, roughness 0.06 + clearcoat 1 (glass keys); opacity values unchanged (0.35 partition/balustrade, 0.55 glazing); `SceneEnvironment.tsx` adds three's local RoomEnvironment PMREM (no external assets, P-6-safe), intensity 0.2 EST. |
| Polished marble atrium (VAC-LGT-04) | `src/scene/textures.ts` `createMarbleTexture()` — base `#ACA0AB–#D2B9B0` (MEASURED samples + 2026-11-20 probes `#B0A2AE/#B5A6AD/#CDB3AD`); veins/blotches procedural EST., deterministic seed 20261120; roughness 0.16 + clearcoat 0.5 |
| Real shadows, LGT-02 direction | `Lights.tsx`: directional key (`[35,50,-15]`, `#FFF1E0`, 1.5 — unchanged) now `castShadow`, 2048² map, camera bounds ±55 (covers ENV extents x −17.18…14.6 / z −15.30…14.03), soft (radius 4, normalBias 0.03); glass/backdrop/emissive excluded via `SHADOW_EXCLUDE_*` (test-enforced); `WorkspaceCanvas` `shadows={!flat}` |
| Tone mapping + exposure | ACES Filmic via postprocessing `ToneMapping` (r3f default renderer tone mapping bypassed by the composer); lighting values untouched — mood comes from ACES + reduced env contribution |
| Emissives + bloom (VAC-LGT-03, completes Q-3D-07) | `rim` ×6.0, `strip` ×5.5 HDR (base colours unchanged); `Bloom` mipmapBlur intensity 0.5, **luminanceThreshold 3.0** so diffuse albedo can never bloom; `city` stays unlit non-blooming |
| Per-department floors | `DEPT_FLOOR_COLORS`: DEPT-02 `#927A74`, DEPT-03 `#8F7F80`, DEPT-04 `#836B5F`, DEPT-05 `#805E4C` (+procedural plank texture), DEPT-06 `#817880` (new probe), DEPT-07 `#655B61` — all MEASURED, provenance strings in code and tests; Management wood grain EST. (Q-VF-02 default) |
| No geometry change | **Zero edits to model.ts / environment.ts / scene-architecture.json** — verified by the rendered check (§3) |

## 2. Measured vs estimated (complete provenance)

- **MEASURED:** all base material colours (006-A palette, test-enforced hex equality); marble base range + 3 clean probe patches; 6 department floor tones; light colours/intensities (unchanged from 006-A).
- **FIT:** none new (fascia fits from 006-A unchanged).
- **EST.:** marble vein pattern + blotch layout; wood plank grain; all roughness/clearcoat/metalness/envMapIntensity values; HDR boost magnitudes; bloom threshold/intensity/radius; shadow softness; RoomEnvironment intensity; ACES choice.
- **ASSUMED:** none new.
- **UNRESOLVED:** DEPT-01 Executive floor tone — two probes contaminated by furniture/wall (`#664732` room median, `#433E3E` front band); neutral floor kept (test asserts `DEPT_FLOOR_COLORS['DEPT-01'] === undefined`). Owner may resolve by nominating a clean floor pixel coordinate; no invention.

## 3. Validation results

- `npm run validate` = tsc clean + **vitest 56/56** (47 preserved unmodified + 9 additive VF-1 audit tests in `tests/materials.test.ts`) + vite build ✓ + check-dist OK (no reference image, no raster assets — textures are runtime-generated).
- **Geometry non-regression:** rendered check re-run at 6 sizes — summaries byte-equal to the committed 006-A values (plinth ≤ 0.5 px, floor corners ≤ 2.6 px, signs ≤ 0.8 px; identical occlusion/off-frame sets). `greybox/data/rendered-check.json` regenerated with a VF-1 note. Flat measurement mode byte-identical (test-enforced).
- **Reference checksum:** verified OK before and after the mission.
- **Quantitative appearance comparison** (same-patch medians, reference frame): marble ΔRGB 7.9 / 13.6 / 23.8 (base tone match; warm-zone placement not reproduced — EST. pattern); DEPT-05 centre patch comparison invalid (reference furniture contamination), albedo matches catalogue by construction.

## 4. Changed files (complete list — nothing else touched)

- `apps/workspace/src/scene/materials.ts` (rewritten: PBR spec, DEPT_FLOOR_COLORS, shadow-exclusion sets; FLAT_COLORS byte-identical)
- `apps/workspace/src/scene/textures.ts` (**new**: procedural marble/wood, deterministic, no assets)
- `apps/workspace/src/scene/SceneEnvironment.tsx` (**new**: RoomEnvironment PMREM)
- `apps/workspace/src/scene/Lights.tsx` (shadows on the existing key light; colours/intensities unchanged)
- `apps/workspace/src/scene/WorkspaceCanvas.tsx` (`shadows`, EffectComposer: Bloom + ACES ToneMapping; skipped in flat mode)
- `apps/workspace/src/scene/Greybox.tsx` (shadow flags per material key; per-dept materials via `createDeptMaterials` — no geometry)
- `apps/workspace/tests/materials.test.ts` (**new**, 9 tests)
- `apps/workspace/package.json` + `package-lock.json` (`postprocessing@^6.37.8`, `@react-three/postprocessing@^3.0.4`)
- `docs/design/main-workspace/greybox/data/rendered-check.json` (regenerated, byte-equal numbers + VF-1 note)
- `docs/design/main-workspace/greybox/data/greybox-metrics.json` (regenerated by `WRITE_METRICS=1`)
- `docs/design/main-workspace/greybox/review/` (VF-1 gate artifacts: `index.html` §4-VF1, `VF1-desktop-1672x941.png`, `VF1-phone-portrait-412x915.png`, 7 × `Y-*-ref/vf1render.png`)
- this report.

## 5. Remaining deviations / uncertainties (also in the review page §4-VF1 tables)

V1 marble vein/warm-zone pattern EST.; V2 **DEPT-01 floor tone unresolved**; V3 all PBR/post-processing styling values EST. (owner judgement requested at this gate); V4 robot/furniture materials N/A (not started); V5 shadow softness EST., key direction per the Medium–Low-confidence LGT-02 observation; V6 screen/eye bloom belongs to VF-3/VF-4 scope.

## 6. Boundaries respected

No robots, no furniture (VF-3/VF-4 not started); no VF-2 structural changes; PR #1 open and unmerged; reference immutable (checksum OK); 24 AI Employees label and 47 robot count untouched; HOME camera and responsive rule untouched. **Stopped after VF-1 — awaiting the owner's explicit visual approval before any further mission.**
