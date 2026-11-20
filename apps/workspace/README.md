# WORA Main Workspace — 3D greybox (Mission WORA-3D-GREYBOX-004)

The first executable, real-3D structural greybox of the Main Workspace. It is built with React,
TypeScript, Vite, Three.js and React Three Fiber (the stack approved for the frontend/3D prototype only).
Every dimension comes from `docs/design/main-workspace/architecture/data/scene-architecture.json`
(Mission 003). Nothing is placed by eye.

This is **not** the final scene. It has no robots (they appear only as dev markers), no furniture,
no decorative materials, no doors, no UI panels and no art lighting.

## Requirements

- Node.js ≥ 20 (verified with Node 22.22 and npm 10.9)
- A browser with WebGL 2

## Run

```bash
cd apps/workspace
npm install
npm run dev          # http://localhost:5173 (binds 0.0.0.0)
```

| URL | What it shows |
|---|---|
| `/` | The greybox, full-bleed, in the approved HOME camera with the responsive FOV rule |
| `/#/dev` or `/?dev` | **Dev inspector**: reference-frame or fill-viewport framing, the locked reference as an overlay with an opacity slider (dev server only), measured-vs-projected point markers (plinth, digitised corners, signs, 47 robot heads), measured slab-edge lines, UI-occluder rectangles, layer toggles, flat ID-colour mode with an in-browser rendered check, free orbit and **Reset to HOME** |

Dev URL parameters for scripted checks: `overlay=<0..1>`, `markers=0|1`, `robots=0|1`, `edges=0|1`,
`ui=0|1`, `panel=0|1`, `frame=reference|fill`, `flat=0|1`, `mass|partitions|signs|balustrades=0|1`.
Press **H** to hide or show the panel.

## Verify

```bash
npm run typecheck    # tsc --noEmit (also validates the JSON field paths used by src/config)
npm test             # vitest: 31 structural / responsive / guard tests against the rendered model
npm run build        # production bundle in dist/ (overlay code is compiled out)
npm run validate     # typecheck + tests + build + scripts/check-dist.mjs (no reference image in dist)
```

To regenerate the metrics quoted by the validation report:

```bash
WRITE_METRICS=1 npx vitest run tests/report.test.ts
# -> docs/design/main-workspace/greybox/data/greybox-metrics.json
```

**Rendered-frame check.** This compares the pixels the app actually draws with the camera math.
1. Open `/?dev&flat=1&frame=fill&partitions=0&balustrades=0&markers=0&edges=0` in a browser.
2. Use **Rendered check**, or call `window.__WORA_RENDERED_CHECK__()` from the console.

Results recorded for Mission 004 are in `docs/design/main-workspace/greybox/data/rendered-check.json`.

**Before any QA session:** verify the reference with
`cd docs/design/main-workspace/reference && sha256sum -c wora-main-workspace.png.sha256`.
Run it from `reference/` (see erratum E-05).

## Layout

```
src/
  config/sceneConfig.ts       typed access to scene-architecture.json + measurements.json (no geometry changes)
  config/referencePoints.ts   reference-image measurements used only for validation
  scene/camera.ts             HOME camera, responsive FOV rule (architecture/03 §6), projection helper
  scene/model.ts              pure structural model (G-01…G-18) — rendered AND tested
  scene/Greybox.tsx           renders the model (neutral materials + outline edges)
  scene/CameraRig.tsx         applies HOME + responsive FOV on resize
  scene/Lights.tsx            hemisphere + one directional light (G-20)
  scene/materials.ts          neutral palette; flat ID colours for measurement
  scene/WorkspaceCanvas.tsx   R3F <Canvas>
  dev/                        dev inspector (overlay, markers, orbit, rendered check)
  validation/metrics.ts       all validation metrics (used by tests and the report)
tests/                        vitest suites
scripts/check-dist.mjs        release guard: no reference image / overlay path in dist
```

## Rules for anyone extending this

- Change geometry only through the architecture JSON (bump its `schema`), then re-run `npm run validate`
  and regenerate the metrics.
- The reference overlay is a QA tool. It must never ship (analysis/06 P-6). `check-dist` enforces this.
- Do not invent hidden areas. The slab stops at the minimum supported extents on the −X and −Z sides.
- See `docs/design/main-workspace/greybox/02-technical-handoff.md` before starting the art pass.
