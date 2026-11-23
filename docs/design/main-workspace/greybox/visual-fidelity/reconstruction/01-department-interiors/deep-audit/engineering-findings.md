# Department Interiors — root-cause findings and targeted corrections

## Decision

**The phase is still open and does not pass acceptance.** The output still has a high visual error, low structure similarity, and does not reproduce the reference's material/rendering detail. The screenshots and computed per-room evidence are in `after-whiteboard-content/`; the audit that preceded the changes is in `audit.md` and `audit.json` at this directory's parent. No camera, room footprint, UI mask, room box, or other department geometry was retuned.

## How to read the measurements

- Section MAE and SSIM compare the source image and current render across the entire catalogued rectangular department ROI, with all occlusions retained. Each ROI's source confidence/notes and pairwise overlap are in the JSON. The ROI is **not** a furniture-only mask.
- Element L1 rankings use the *actual pixel error* within each element's measured source `px_box`, where it exists. For elements without a measured source box, the current projected model box is only a hotspot-search proxy, not ground-truth placement evidence. Such boxes can overlap and their L1 values are not additive.
- Geometry comparisons project each current primitive through the unchanged HOME camera and compare its composite bound to the catalogue `px_box`. Their `pos`/`size` provenance is reported per element; EST./low-confidence data is not treated as exact.
- SSIM is the declared grayscale 8×8 uniform-window, stride-4 variant, averaged across windows—not Gaussian-window SSIM. The exact formula is documented in `audit.json`.

## What the evidence says

### 1. No evidence supports changing the locked camera or room footprints

The stored projected floor-footprint corners are within **0.01–0.30 px** of their architecture targets. Those targets were themselves generated from the same stored footprint and camera, so this is a **self-consistency check, not an independent image digitization**. It provides no reason to change the approved camera, but it does not prove the visible glass/floor boundary is pixel-perfect. The full room ROIs still score only **0.1163–0.1701 SSIM** in the audit captured immediately before the whiteboard content iteration. After the latest iteration, the weighted full-ROI score is **MAE 54.659/255, SSIM 0.14456**. That is still a poor match.

### 2. Proven position bug corrected; image-level outcome is mixed

The source data's `centre_y` values are measured wall-item centres. The renderer had been adding a separate estimated 1.2 m shelf mount and a default whiteboard mount on top of those values. This was an actual placement error, not a style preference. The change now uses `centre_y` directly:

| Source item | Centre error before | After | Interpretation |
|---|---:|---:|---|
| Executive left floating shelf | 56.4 px | 18.6 px | Major vertical displacement corrected; still imperfect |
| Executive right floating shelf | 64.5 px | 28.8 px | Major displacement reduced; residual/height remains |
| Creative Studio pin-board | 27.6 px | 12.1 px | Position brought close to its estimated box |
| Management whiteboard | 29.7 px | 20.2 px | Improved but still displaced |

The measured board-local before/after for the content pass is mixed: Creative Studio MAE **62.48 → 59.74**, but SSIM **0.13083 → 0.11410** (local color error fell while local structure worsened); Management MAE **64.81 → 54.30** and SSIM **0.17151 → 0.17316**. This validates the broad colored-note/diagram category for Management, but the Creative treatment needs adjustment. Neither result is a phase pass or proof the full boards match.

### 3. Main remaining geometric mismatches

The summary below uses the final current geometry audit (see every object row in `after-whiteboard-content/audit.json`). Center residuals are measured against source catalogue boxes; exact reference orientations are not supplied for every item, so rotation comparison stays qualitative where marked ND.

| Section | Largest measured item residual(s) | Direction / distribution finding |
|---|---|---|
| **DEPT-01 Executive Office** | Left/right wall shelves: 18.6/28.8 px centre error; right shelf is 17.6 px shorter than its source box. Desk is +30.5 px tall vs its 44 px source box; rug is +33.7 px tall vs 45 px. | The 7.1×7.1 m room footprint is correctly placed. Shelf vertical anchors were wrong and are now corrected, but the desk/rug composite silhouettes remain too tall. The source clearly has a walnut vertical-slat rear wall; the current single broad wall plane does not reproduce its slatted relief. |
| **DEPT-02 Marketing** | Bar display centre error 20.1 px; width +2.5 px, height −3.0 px. Left measured plant is ~23% wider and ~20% taller than its box. | Source catalog count is 8 desk clusters/robots, 2 displays, one bookcase and two plants; the count is represented in data. The render still has low detail and the workstation/display projection is the larger issue than omitted item records. Exact workstation-to-workstation spacing has only EST. bounds. |
| **DEPT-03 Engineering** | Code display centre error 11.3 px; width +4.6 px. The two measured back plants render ~31% narrower and ~26% taller than their source boxes. | Ten desk clusters and twenty desk-monitor faces are represented. Room footprint aligns. The screen/plant size profile and visual density remain wrong; exact text/code content is ND. |
| **DEPT-04 Creative Studio** | Pin-board centre error 12.1 px after correction; display centre error 4.1 px. Plant silhouettes are consistently too narrow/tall (roughly 15–21% narrow, about 20% tall on the measured set). | Five desk clusters, the art display, bookcase, board and four plants are represented. The board's broad colored-note/diagram category is present, but the latest texture did not improve the full-room score: MAE **55.106 → 55.197**, SSIM **0.12885 → 0.12770** versus the pre-board iteration. Treat its exact layout as unresolved; further tuning needs a local board ROI result. |
| **DEPT-05 Management** | Table centre error 19.4 px; projected width +6 px and height −5.3 px. Board centre error 20.2 px. | The diagonal conference-table direction agrees qualitatively with the reference, but its bounds and surrounding spacing still differ. Five chairs/laptops, display, board, wall panel, plants and planter have records. The table ROI is the largest measured L1 hotspot in this section. |
| **DEPT-06 Research** | Map display centre error 15.2 px, height −6.2 px; bookcase centre error 8.3 px. | Five workstation groups, display, shelf and two plants are represented. The world-map category is present, but the display and nearby furniture still have low local SSIM. Exact map pattern is not measurable. |
| **DEPT-07 QA & Testing** | Check display centre error 9.0 px, height −4.5 px. Right server rack is ~15 px too tall; rack widths are ~7–8% over their measured boxes. | Six workstation groups, two server banks and three plants are represented. The racks/display have the largest measured local hot spots; the reference has denser rack bays/blue status detail than the current large flat surfaces. |

For all seven rooms, `rot_y` is carried from architecture data and is used to project the current primitive geometry. Department front/corner orientation is preserved. The image measurement catalogue does not provide an independent numeric world yaw for each individual desk, shelf or plant. Therefore, do **not** claim sub-degree direction accuracy from a solver value; the Management table diagonal and screen/wall orientation have only qualitative crop review.

### 4. Inventory audit: no catalogue item IDs are silently dropped

All architecture-catalogue item IDs are now tagged on their rendered geometry; the final audit reports **zero source items without a runtime geometry tag in each of the seven rooms**. This verifies that a JSON record was not lost, but not that its silhouette, screen position, size, pose or materials look right. Counts by kind are listed in each section's audit table. Counts are source catalogue counts, not an independent pixel-recognition pass.

Visible reference content that is still missing or materially underrepresented includes: the Executive Office's repeated walnut slats and rich desk/shelf arrangement; readable three-dimensional desk equipment and dense monitor content; patterned/materially detailed floors; whiteboard diagrams/notes with correct small-scale placement; and the layered shapes/highlights of foliage, glass and upholstered/task chairs. These are **fidelity gaps** even where the object category exists in the catalogue.

### 5. Material and lighting diagnosis

The reference crops show soft reflections and warm accents on floors, glass and furniture. The previous department floors were matte `MeshStandardMaterial` at roughness **0.8**, without clearcoat. Evidence-supported experiment: keep every catalogued sampled floor colour fixed, but change resolved floor surfaces to `MeshPhysicalMaterial`, roughness **0.26** (Management wood **0.32**), clearcoat **0.42**, clearcoat roughness **0.2**, and environment intensity **0.8**. This is an appearance estimate from the visible floor reflections, not a measured physical parameter.

Measured before/after result for that experiment: weighted department MAE **54.734 → 54.656** (−0.078/255); weighted SSIM **0.144857 → 0.144862** (+0.000005). Marketing/Engineering MAE improves by ~0.22, while Creative and Research are slightly worse. This is too small and inconsistent to count as success. The warm hue/lighting residual is not independently isolated from furniture/occlusion in these full ROIs.

The current lighting source has one global hemisphere and one directional key plus a local warm point only at the Executive Office. The reference suggests multiple warm room accents and soft reflected light. Their exact fixtures, intensities and positions are not recoverable, so no additional local lamps have been fabricated. Lighting remains a plausible root cause requiring controlled evidence, not an established numeric correction.

### 6. Reference content versus unsupported detail

- **Supported categories:** desks/chairs/robots, monitor screens, bookshelves/books, charts/code/art/map/check displays, conference equipment, QA server racks, department plants, whiteboards and the Executive Office rug/walnut wall are all explicitly visible in the reference or analysis inventory.
- **Not recoverable precisely:** tiny-screen text/values, book titles/exact spine colours/count, exact pin-board/whiteboard note layout, exact rug motif, plant species/individual leaves, specific unseen light fixtures, and precise small-object variants. Current generated book, rug, board and monitor marks are category-level interpretations; they must not be described as exact reconstructed content. No fabricated text/values were added.
- **Unsupported free objects:** the implementation did not add the uncertain Executive desk figurine (U-01) or other unconfirmed white objects as new scene entities.

## Per-section measured pixel result: baseline at audit start → latest render

| Section | Baseline MAE | Latest MAE | Baseline SSIM | Latest SSIM | Readout |
|---|---:|---:|---:|---:|---|
| DEPT-01 | 53.463 | 53.394 | 0.14341 | 0.14712 | small improvement; still poor |
| DEPT-02 | 55.011 | 54.788 | 0.13742 | 0.13754 | MAE improvement; structure change tiny |
| DEPT-03 | 60.720 | 60.331 | 0.11628 | 0.11665 | lowest structural match; major gap remains |
| DEPT-04 | 55.124 | 55.197 | 0.12840 | 0.12770 | MAE better than starting point, SSIM worse |
| DEPT-05 | 53.227 | 53.063 | 0.15912 | 0.15893 | MAE better, SSIM slightly worse |
| DEPT-06 | 50.511 | 50.093 | 0.17011 | 0.16986 | MAE better, SSIM slightly worse |
| DEPT-07 | 55.447 | 55.431 | 0.15634 | 0.15648 | still a major rack/display mismatch |

Baseline values refer to the first committed phase capture; latest values refer to the fresh browser snapshot in `after-whiteboard-content/audit.json`. The change set after the baseline is multiple iterations, so this aggregate delta is diagnostic only and does not attribute all change to one edit.

## Verdict and next work

The best-supported causes are **(1) individual furniture/screen geometry and spacing, (2) surface/detail density and composition, (3) material finish, with likely but unisolated lighting contribution**. Current evidence does not justify changing the approved camera or room footprints; the corner projection check is self-consistency only. Fixing the measured wall-object `centre_y` misuse reduced those geometric residuals, but image-level gains are not sufficient. The department floors' new finish also did not materially raise SSIM. The whiteboard content trial is mixed, and must be improved or reverted based on its local crop tests.

**Gate: NOT PASSED. Do not proceed to Building Envelope or any other phase.** The next evidence-led iteration should target the Executive rear wall/desk silhouette, Engineering's screen+plant proportions, Management's conference table/rack-style details, and a per-board local metric review, one entity at a time. Each proposed geometry/material change must show the specific ROI/element before/after and preserve the full department crop; no masks or exclusions.
