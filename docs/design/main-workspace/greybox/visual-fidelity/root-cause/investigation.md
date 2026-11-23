# WORA — Visual Difference Root Cause Investigation

**Status: comparison mechanics validated for exact native-size RGB-pixel comparison; visual parity is not achieved. Diagnosis only: no application, UI, geometry, or reference-image changes were made in this investigation.**

## Verdict

The **98.5240% full-frame pixel-difference result is real for the two specified raster images**. It is not caused by a resize, crop, viewport-size mismatch, device-pixel-ratio mismatch, shifted canvas, camera zoom, or unstable capture. A fresh capture at 1672×941 is byte-identical to the earlier `after/reference-native-1672x941-full.png`; two consecutive browser captures also match at every pixel.

Visual inspection of the exact-size side-by-side and 50% overlay confirms that the large difference is mainly **content/rendering fidelity**: the reference is a richly textured, photorealistic office image, whereas the current scene is a simplified low-poly/greybox rendering with different fine geometry, materials, environment, lighting and robot appearance. The broad office composition is recognizable and placed in corresponding areas; local silhouettes/details are not pixel-aligned. The seven department boxes and 47 robot boxes fit the broad corresponding zones in both annotated images, but bounding-box fit alone does **not** prove every object centroid, pose, or physical size matches.

## Capture and alignment checks

| Check | Evidence / result |
|---|---|
| Reference | 1672×941; SHA-256 `6f91ff3d27f1d69d7189b6d1a599088086bb50048d1c0b492e3ebcdb718036a1` |
| Fresh browser screenshot | 1672×941; SHA-256 `29d83fc8e484e04451bd1746312178311c140bb27d925cf2b8b1409ee8fa4960`; exactly the same bytes as the earlier after-capture |
| Viewport / DPR | 1672×941; `deviceScaleFactor=1`, `devicePixelRatio=1`, visual viewport scale 1 |
| Canvas | CSS rect `(0,0)–(1672,941)`; bitmap and drawing buffer both 1672×941 |
| UI root | Full-frame rect; selected view is `3D View` |
| Resize / crop | None. Source and capture are decoded and compared at the same x,y coordinates, one pixel to one pixel |
| Capture stability | Two consecutive full-page browser captures: 1,573,352/1,573,352 identical RGB pixels |
| Camera | Runtime position `(60.675,46.538,61.964)`, orientation quaternion exactly matches the camera reconstructed from the approved target/up vector (delta `0`), vertical FOV `12.0006°`, aspect `1.7768331562`, zoom `1`, near/far `1/400`; all match the approved scene-camera configuration within `1e-6` (aspect delta `1.56e-7`) |
| Alpha | Reference, browser screenshot and raw WebGL-canvas PNG have zero non-opaque pixels; full-page screenshots are RGB PNGs. No transparent-pixel mismatch is possible in the compared files |
| Color handling | WebGL drawing buffer reports `srgb`; Three/R3F source defaults are sRGB output with ACES filmic tone mapping for this non-flat canvas. Neither PNG has an `sRGB`, `gAMA`, `iCCP`, or `cHRM` chunk; the reference contains a private `caBX` chunk. The source profile is therefore unknown: byte metrics are valid as encoded-RGB comparisons, but they cannot establish physical/display colorimetric equivalence |

The original raster has no embedded camera metadata, so its historic camera pose cannot be read from the PNG. The current pose matches the approved camera fitted to the reference geometry, and the visual overlay shows the broad composition in the same frame; this is not a claim that the raster itself records camera settings.

## Full-frame pixel methods

No color transform was applied before computing these metrics; alpha is absent from the RGB comparison. “Different pixel” means at least one of its three stored RGB bytes differs.

| Method | Different pixels | Share |
|---|---:|---:|
| Exact RGB pixel mismatch | 1,550,130 / 1,573,352 | 98.5240% |
| Exact RGB pixel match | 23,222 / 1,573,352 | 1.4760% |
| At least one differing RGB channel | 4,423,810 / 4,720,056 channels | 93.723% of channels |
| Max-channel absolute difference ≥8 | 1,216,475 pixels | 77.3174% |
| Max-channel absolute difference ≥16 | 1,108,070 pixels | 70.4273% |
| Max-channel absolute difference ≥32 | 925,103 pixels | 58.7982% |
| Luma absolute difference ≥8 | 1,100,574 pixels | 69.9509% |
| RGB Euclidean distance ≥16 | 1,146,293 pixels | 72.8567% |
| RGB MAE / RMSE (0–255) | 43.3176 / 63.0410 | — |

These independent threshold/luma/distance views all show a large difference; the result is not an artifact of the exact-match threshold alone. The earlier QA’s `>16` threshold is not numerically identical to this investigation’s `≥16` threshold. Exact mismatch counts are unaffected by that convention.

## Region ROIs and mask audit

All boxes use the reference’s top-left-origin pixel coordinate system from `analysis/data/measurements.json`; the original and current image dimensions are identical, so the same boxes apply to both without transforms. `roi-boxes-original-reference.png` and `roi-boxes-current-screenshot.png` display every box on its image. Rectangles were checked visually against both images. No rectangle is out of bounds.

Masks are made mutually exclusive with this documented precedence: **UI Shell → Live Activity → Robots → Building Geometry → Department Interiors → Lighting and Environment**. Earlier classes own intersecting pixels; overlaps are assigned, not dropped. The exclusive masks have **zero pairwise overlapping pixels** and partition all 1,573,352 frame pixels when the explicitly reported unmapped remainder is included. Raw box intersections are substantial, however, so these are broad ROI comparisons—not semantic object segmentation.

| Exclusive region | ROI pixels | Exact RGB matches | Different pixels | Pixel difference | RGB MAE (0–255) | Share of total absolute RGB error* |
|---|---:|---:|---:|---:|---:|---:|
| Department Interiors (seven measured room boxes) | 543,699 | 4 | 543,695 | 99.9993% | 53.6763 | 42.82% |
| Building Geometry proxies (ENV-014/015 facades, ENV-016 top glazing/environment band) | 315,903 | 1 | 315,902 | 99.9997% | 55.1229 | 25.55% |
| Lighting and Environment (ENV-001–013, ENV-017, after precedence) | 126,280 | 0 | 126,280 | 100.0000% | 52.5311 | 9.73% |
| UI Shell (measured regions, Live Activity reported separately) | 422,822 | 22,661 | 400,161 | 94.6405% | 14.1923 | 8.80% |
| Robots (47 measured 30×45 / individual boxes, after precedence) | 70,295 | 0 | 70,295 | 100.0000% | 83.8077 | 8.64% |
| Live Activity (REG-06 full panel box) | 62,776 | 554 | 62,222 | 99.1175% | 26.3740 | 2.43% |
| Uncategorized scene remainder (explicit, not hidden) | 31,577 | 2 | 31,575 | 99.9937% | 43.5512 | 2.02% |
| **UI Shell + Live Activity** | **485,598** | **23,215** | **462,383** | **95.2193%** | **15.7671** | **11.23%** |

\* Error share is each **exclusive** region’s sum of absolute RGB-channel byte differences divided by the full frame’s sum. It ranks byte-error contribution, not semantic severity. The combined UI row is a roll-up and must not be added to its two component rows.

**Box limitations:** “Department Interiors” boxes span whole department rectangles and include some room boundaries/furnishings/background; they are not pixel-accurate interior masks. “Building Geometry” is only the three measured facade/top-band proxies and does not cover every interior partition or glass rail. Robot rectangles include nearby pixels and can intersect department/environment boxes; priority assigns those pixels to Robots. In the raw rectangle sets, 130,833 Building-proxy pixels, 156,011 Department-box pixels and 124,695 Environment-box pixels overlap earlier classes. None is discarded, but the attribution follows the declared precedence. The remaining 31,577 scene pixels are separately measured as uncategorized. The visible annotations make these limitations inspectable rather than concealing them.

## Correction to interpretation of prior layer scores

The previous `UI Shell 95.2174%` was computed from a screenshot with the canvas hidden, not from the final composited browser screenshot. On the **same UI boxes**, this investigation finds:

- Canvas-hidden UI layer vs reference: **462,374 / 485,598 different (95.2174%)**, MAE 16.0697.
- Actual final screenshot vs reference: **462,383 / 485,598 different (95.2193%)**, MAE 15.7671.
- The hidden-canvas UI image differs from the final composition at **28,494 pixels inside those UI boxes**, because translucent UI allows the underlying 3D canvas to show through.

The previous `3D Scene 99.9994%` score’s exact-difference count happens to be unchanged on the equivalent ROI: 1,087,747/1,087,754 pixels differ for both the isolated scene and the full screenshot. But the two images differ at **72,956 pixels (6.707% of that scene ROI)** because measured UI boxes do not include every shadow/overhang of the composited interface. MAE also changes from 55.7878 (isolated scene) to 55.6167 (final screenshot). Therefore the old layer percentages are not an exact description of the final composite even where their headline pixel-difference ratio coincides. The full-frame 98.5240% result is not affected by this layer-isolation issue.

## Visual root-cause assessment, ordered by measured impact

1. **Department room content and construction (largest broad ROI; 42.82% of absolute byte error).** In the side-by-side and overlay, the seven departments occupy the same broad regions, but the reference contains dense detailed office furniture, partitions, screens and surface texture; the current rendering uses simplified geometry and materially different rendered detail. The department bboxes include both contents and some architecture, so this is not a pure “interiors-only” attribution.
2. **Building envelope and geometry (25.55% in the measured exterior proxies).** The reference shows finely detailed glazing, rails, floor edge and exterior; the current image has simplified low-poly envelope/facade forms. The three proxy boxes are not exhaustive of internal building geometry.
3. **Lighting and environment (9.73%).** Visually, the reference’s lush outdoor scene, warm interior lighting, reflections and textured floor contrast with the current generic grey city backdrop, muted materials and simpler lighting/shadow response. The source PNG’s missing color profile limits colorimetric attribution, but cannot explain the clearly visible scene-detail and structure differences.
4. **UI Shell (8.80%, excluding Live Activity).** Broad panel placement is aligned, but icons, glyph/text rasterization, profile/avatar treatment, detail and colors differ. This ROI’s exact RGB mismatch is lower than scene ROIs, while its broad pixel-difference percentage remains high.
5. **Robots (8.64%).** Visually the robot groups recur around corresponding desks/zones, but the robot designs, rendering, colors and local silhouettes are strongly different. Zero exact pixels in the broad robot boxes does not mean that every robot center is misplaced; the boxes include background and desk pixels, so a separate object-mask/centroid test would be needed to quantify placement error.
6. **Live Activity (2.43%).** Its panel is at the corresponding top-right position, but its text/avatar/detail pixels are not the same as the reference.

This ordering is a diagnostic priority list based on exclusive bounding-box ROIs, not a claim that these categories are pure or that the pixel-error share equals subjective importance.

## Evidence files

- `original-reference.png` — original bytes, native 1672×941.
- `current-browser-screenshot.png` — fresh browser screenshot, native 1672×941.
- `original-and-current-side-by-side.png` — 3344×941; two unscaled, uncropped 1672×941 images.
- `50-percent-opacity-overlay.png` — native-sized arithmetic 50% RGB overlay.
- `absolute-difference.png` — native-sized raw per-channel absolute difference; `absolute-difference-contrast-x4.png` is a visibility-enhanced companion.
- `roi-boxes-original-reference.png`, `roi-boxes-current-screenshot.png` — region boxes and labels drawn at reference pixel coordinates.
- `region-difference-*.png` — six region difference views plus combined-UI and uncategorized-remainder views; each remains native-sized with non-ROI pixels black.
- `current-webgl-canvas.png`, `repeat-browser-screenshot.png` — raw canvas and repeatability evidence.
- `investigation.json` — exact hashes, capture/browser/camera/PNG diagnostics, counts, threshold metrics, every bbox, mask precedence/intersections and region metrics.
- `apps/workspace/scripts/visual-difference-investigation.mjs` — reproducible, read-only browser/image diagnostic runner.

**Conclusion for the gate:** comparison alignment is sufficiently verified to trust the *encoded-pixel* full-frame mismatch and its counts. The remaining caveats are source color-profile metadata and the approximate/overlapping semantic bounding boxes—not viewport registration. The visual review finds genuine broad rendering/content mismatch, with department interiors and the measured envelope proxies dominating the ROI error. This is evidence and diagnosis only; it does not authorize or start any visual repair.
