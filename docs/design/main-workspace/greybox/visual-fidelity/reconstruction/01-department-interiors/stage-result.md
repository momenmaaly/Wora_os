# 01-department-interiors — phase result

Captured: 2026-11-22T22:27:43.237Z UTC. Reference SHA-256: `6f91ff3d27f1d69d7189b6d1a599088086bb50048d1c0b492e3ebcdb718036a1`. Before and after screenshots are both native 1672×941; browser DPR is 1, canvas and drawing buffer match the viewport.

| Department ROI | Before different / total | After different / total | Δ PixelDiff | MAE RGB8 before → after | RMSE RGB8 before → after |
|---|---:|---:|---:|---:|---:|
| DEPT-01 Executive Office (room) | 86089/86100 (99.987%) | 86089/86100 (99.987%) | 0.000 pp | 49.88 → 53.46 | 64.15 → 68.29 |
| DEPT-02 Marketing (room) | 113399/113400 (99.999%) | 113399/113400 (99.999%) | 0.000 pp | 55.52 → 55.01 | 70.11 → 69.72 |
| DEPT-03 Engineering (room) | 106367/106400 (99.969%) | 106367/106400 (99.969%) | 0.000 pp | 60.72 → 60.58 | 78.72 → 78.64 |
| DEPT-04 Creative Studio (room) | 116000/116000 (100.000%) | 116000/116000 (100.000%) | 0.000 pp | 55.51 → 55.12 | 72.98 → 72.65 |
| DEPT-05 Management (room) | 126599/126600 (99.999%) | 126599/126600 (99.999%) | 0.000 pp | 53.63 → 53.23 | 69.22 → 68.82 |
| DEPT-06 Research (room) | 98050/98050 (100.000%) | 98050/98050 (100.000%) | 0.000 pp | 50.51 → 50.08 | 65.86 → 65.65 |
| DEPT-07 QA & Testing (room) | 100699/100700 (99.999%) | 100699/100700 (99.999%) | 0.000 pp | 56.06 → 55.45 | 73.44 → 72.90 |

Full frame: 98.524% → 98.524%. Full-frame value is a context check only; phase acceptance uses the seven departmental rows above. Negative percentage-point / MAE / RMSE change is better.

The overlays and absolute-difference maps are in `captures/`. Each department uses its entire measurement rectangle, including robots and any overlaid UI. Intersecting rectangles are scored independently and their raw overlaps are listed in `stage-after.json`; no pixels were excluded and no mask changed between captures. No element was hidden or omitted to improve a score.

Browser errors: 0.

## Gate review — NOT ACCEPTED; phase remains active

The full pixel-difference rate did not improve in any department (all seven ROIs remain 99.969–100.000% different; pixel-difference change is 0.000 percentage points in every ROI). RGB MAE improved slightly in Marketing, Engineering, Creative Studio, Management, Research, and QA, but worsened in the Executive Office; these small changes do not establish a visual-fidelity pass. Full-frame MAE moved from 43.055 to 43.095 and RMSE from 62.639 to 62.738, so the global frame did not improve. This stage is **not accepted**, and no later mission phase may start.

Visual crop review confirms large remaining reference-visible gaps. The Executive Office still does not reproduce the walnut/slatted wall and furnishing/detail density evident in the source; shared desks, screens, bookshelves, boards and QA rack surfaces still read as coarse primitives. This iteration adds separated desk supports, caster-chair bases, shelf books, semantic abstract desk-screen content, an executive laptop and a light patterned executive rug. These changes do not materially close the measured gap yet.

### Measurement limitations and unresolved detail

- Department boxes come directly from `analysis/data/measurements.json`; they are rectangular screen-space bounds, not hand-segmented room silhouettes. Their total raw pairwise intersection is 47,540 pixels, so overlapping screen pixels are counted in each intersecting department. All pixels—including robots, glass, signage and other UI—remain included. These figures are comparable before/after controls, not isolated semantic furniture-only scores.
- Several source boxes have low confidence or are partly occluded. Future reporting must retain those notes and must not present the numbers as exact room-only segmentation.
- Open question for the visual audit: the reference identifies monitor categories (code, charts, artwork, research/test UI) but not legible text, values, or exact small-screen layouts. The current screens therefore use abstract category-consistent marks only; no text or values are invented. Exact small-screen content remains **not determinable from this reference**.
