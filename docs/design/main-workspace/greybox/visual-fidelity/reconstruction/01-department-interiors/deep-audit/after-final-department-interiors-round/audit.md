# Department Interiors — engineering and visual audit

## Capture and method
- Reference SHA-256: `6f91ff3d27f1d69d7189b6d1a599088086bb50048d1c0b492e3ebcdb718036a1`. Fresh current render SHA-256: `d6965f45704cf781bee68d94cd7b450d29c630d7aac300b55d99c8d077341008`.
- Both images: 1672×941; DPR 1; camera pose is recorded in `audit.json`. No post-capture geometry, camera or UI adjustment.
- Per-department reports use the complete source rectangles with no exclusions. Total raw pairwise overlap: 47540 pixels (these overlaps are scored independently).
- Full-ROI weighted RGB MAE: 54.205 / 255. Full-ROI weighted grayscale SSIM (8x8 box window, stride 4): 0.1471.
- Each `sections/dept-NN/` folder contains Reference Crop, Current Render, 50% Overlay and absolute Difference Image.
- MAE is full-ROI RGB; SSIM is the disclosed grayscale box-window variant. Element impact ranking uses actual L1 pixel-error sums inside catalogued reference boxes, or projected current geometry bounds only where the source has no object box. Such attribution overlaps and is not additive.

## Per-section measurements and geometry

| Section | ROI px MAE | SSIM | Data items / types | Measured box count | Worst measured geometry center error | Top local pixel-error contributors |
|---|---:|---:|---|---:|---:|---|
| DEPT-01 Executive Office (room) | 51.60 | 0.1541 | 13: exec-desk 1, rug 1, lounge-chair 2, shelf-wall 2, plant 2, walnut-wall 1, desk 1, chair 1, monitor 2 | 8 | INT-01-SHELF-R Δcenter 28.8px; Δsize 0.4×-17.6px | INT-01-WALNUT (L1 3985328); INT-01-RUG (L1 1747732); INT-01-DESK (L1 1289068) |
| DEPT-02 Marketing (room) | 54.18 | 0.1379 | 37: display-wall 2, shelf-stand 1, plant 2, desk 8, chair 8, monitor 16 | 5 | INT-02-SHELF Δcenter 13.1px; Δsize 4.4×0.9px | SIGN-02 (L1 1602048); INT-02-SHELF (L1 1238432); INT-02-DISP-BAR (L1 904195) |
| DEPT-03 Engineering (room) | 60.29 | 0.1170 | 43: display-wall 1, plant 2, desk 10, chair 10, monitor 20 | 3 | INT-03-PLANT-B Δcenter 0.5px; Δsize -6.9×5.7px | SIGN-03 (L1 3178765); INT-03-DISP-CODE (L1 831768); INT-WC-19-DESK (L1 636575) |
| DEPT-04 Creative Studio (room) | 54.85 | 0.1310 | 28: display-stand 1, shelf-stand 1, whiteboard 1, plant 4, wall-panel 1, desk 5, chair 5, monitor 10 | 8 | INT-04-BOARD Δcenter 12.1px; Δsize 2.9×-3.8px | SIGN-04 (L1 2581009); INT-04-DISP-ART (L1 999368); INT-WC-23-DESK (L1 920411) |
| DEPT-05 Management (room) | 52.65 | 0.1598 | 19: display-wall 1, whiteboard 1, wall-panel 1, conference-table 1, plant 4, planter-box 1, chair 5, laptop 5 | 9 | INT-05-BOARD Δcenter 20.2px; Δsize 5.4×-1.2px | INT-05-TABLE (L1 2851540); SIGN-05 (L1 1846744); INT-05-DISP-CHART (L1 1553190) |
| DEPT-06 Research (room) | 49.64 | 0.1768 | 24: display-wall 1, shelf-stand 1, plant 2, desk 5, chair 5, monitor 10 | 4 | INT-06-SHELF Δcenter 8.3px; Δsize 2.3×-2.8px | INT-06-SHELF (L1 1398288); SIGN-06 (L1 1318374); INT-06-DISP-MAP (L1 961599) |
| DEPT-07 QA & Testing (room) | 55.68 | 0.1568 | 30: display-wall 1, rack 2, plant 3, desk 6, chair 6, monitor 12 | 6 | INT-07-RACK-L Δcenter 5.7px; Δsize 3.3×5.0px | SIGN-07 (L1 1951876); INT-07-RACK-R (L1 1370848); INT-07-RACK-L (L1 1214441) |

## Per-section ranked discrepancy causes (evidence and confidence)

Ranks below are based on measured local RGB L1 error when an object screen box is available, then checked against the reference crop. They describe where pixels differ, not proof that changing only that item will correct them. Geometric/projected box residuals and source confidence are listed per object in `audit.json`.

### DEPT-01 — Executive Office (room)
Whole ROI: MAE 51.60, SSIM 0.1541; catalogue 13 items.
1. `INT-01-WALNUT` (walnut-wall) — L1 3985328, box 190×151 px, MAE 45.8, SSIM 0.257; current projected composite bounds (diagnostic only).
2. `INT-01-RUG` (rug) — L1 1747732, box 180×45 px, MAE 71.9, SSIM 0.092; catalogued reference pixel box.
3. `INT-01-DESK` (exec-desk) — L1 1289068, box 132×44 px, MAE 74.0, SSIM 0.028; catalogued reference pixel box.
4. `INT-WC-01-DESK` (desk) — L1 890207, box 57×72 px, MAE 70.1, SSIM 0.027; current projected composite bounds (diagnostic only).
5. `SIGN-01` (department-sign) — L1 756390, box 168×35 px, MAE 42.9, SSIM 0.273; catalogued reference pixel box.
6. `INT-01-SHELF-R` (shelf-wall) — L1 744723, box 55×60 px, MAE 75.2, SSIM 0.071; catalogued reference pixel box.
7. `INT-01-SHELF-L` (shelf-wall) — L1 318643, box 40×35 px, MAE 75.9, SSIM 0.052; catalogued reference pixel box.
8. `INT-WC-01-CHAI` (chair) — L1 258263, box 21×45 px, MAE 89.1, SSIM -0.176; current projected composite bounds (diagnostic only).
9. `INT-01-PLANT-R` (plant) — L1 132221, box 22×28 px, MAE 71.5, SSIM -0.057; catalogued reference pixel box.
10. `INT-01-LOUNGE-L` (lounge-chair) — L1 128141, box 35×30 px, MAE 40.7, SSIM -0.023; catalogued reference pixel box.

**Visual/engineering review:** This is a confirmed mismatch if it is present in both the crop and the element residual; explanations of pixel residual are provisional until the corresponding model is isolated against the measured target. No unmeasured details should be invented.

### DEPT-02 — Marketing (room)
Whole ROI: MAE 54.18, SSIM 0.1379; catalogue 37 items.
1. `SIGN-02` (department-sign) — L1 1602048, box 135×78 px, MAE 50.7, SSIM 0.250; catalogued reference pixel box.
2. `INT-02-SHELF` (shelf-stand) — L1 1238432, box 78×95 px, MAE 55.7, SSIM 0.098; catalogued reference pixel box.
3. `INT-02-DISP-BAR` (display-wall) — L1 904195, box 70×70 px, MAE 61.5, SSIM 0.070; catalogued reference pixel box.
4. `INT-02-PLANT-L` (plant) — L1 730853, box 50×90 px, MAE 54.1, SSIM 0.112; catalogued reference pixel box.
5. `INT-WC-05-DESK` (desk) — L1 636264, box 60×43 px, MAE 79.0, SSIM 0.042; current projected composite bounds (diagnostic only).
6. `INT-WC-07-DESK` (desk) — L1 581524, box 61×44 px, MAE 69.5, SSIM 0.066; current projected composite bounds (diagnostic only).
7. `INT-WC-03-DESK` (desk) — L1 576900, box 60×42 px, MAE 74.5, SSIM 0.062; current projected composite bounds (diagnostic only).
8. `INT-WC-06-DESK` (desk) — L1 571443, box 61×44 px, MAE 71.0, SSIM 0.029; current projected composite bounds (diagnostic only).
9. `INT-WC-09-DESK` (desk) — L1 567420, box 61×43 px, MAE 70.5, SSIM 0.062; current projected composite bounds (diagnostic only).
10. `INT-WC-02-DESK` (desk) — L1 545279, box 59×42 px, MAE 72.1, SSIM 0.044; current projected composite bounds (diagnostic only).

**Visual/engineering review:** This is a confirmed mismatch if it is present in both the crop and the element residual; explanations of pixel residual are provisional until the corresponding model is isolated against the measured target. No unmeasured details should be invented.

### DEPT-03 — Engineering (room)
Whole ROI: MAE 60.29, SSIM 0.1170; catalogue 43 items.
1. `SIGN-03` (department-sign) — L1 3178765, box 173×81 px, MAE 75.6, SSIM 0.046; catalogued reference pixel box.
2. `INT-03-DISP-CODE` (display-wall) — L1 831768, box 73×68 px, MAE 55.9, SSIM 0.089; catalogued reference pixel box.
3. `INT-WC-19-DESK` (desk) — L1 636575, box 61×44 px, MAE 77.8, SSIM 0.001; current projected composite bounds (diagnostic only).
4. `INT-WC-12-DESK` (desk) — L1 600243, box 59×42 px, MAE 79.4, SSIM 0.036; current projected composite bounds (diagnostic only).
5. `INT-WC-17-DESK` (desk) — L1 593527, box 61×44 px, MAE 72.5, SSIM 0.065; current projected composite bounds (diagnostic only).
6. `INT-WC-15-DESK` (desk) — L1 582195, box 60×43 px, MAE 74.0, SSIM 0.053; current projected composite bounds (diagnostic only).
7. `INT-WC-14-DESK` (desk) — L1 579542, box 60×42 px, MAE 74.9, SSIM 0.048; current projected composite bounds (diagnostic only).
8. `INT-WC-11-DESK` (desk) — L1 575258, box 59×41 px, MAE 77.4, SSIM 0.016; current projected composite bounds (diagnostic only).
9. `INT-WC-10-DESK` (desk) — L1 554174, box 59×41 px, MAE 74.5, SSIM 0.116; current projected composite bounds (diagnostic only).
10. `INT-WC-18-DESK` (desk) — L1 487481, box 62×44 px, MAE 58.2, SSIM 0.080; current projected composite bounds (diagnostic only).

**Visual/engineering review:** This is a confirmed mismatch if it is present in both the crop and the element residual; explanations of pixel residual are provisional until the corresponding model is isolated against the measured target. No unmeasured details should be invented.

### DEPT-04 — Creative Studio (room)
Whole ROI: MAE 54.85, SSIM 0.1310; catalogue 28 items.
1. `SIGN-04` (department-sign) — L1 2581009, box 165×80 px, MAE 65.2, SSIM 0.082; catalogued reference pixel box.
2. `INT-04-DISP-ART` (display-stand) — L1 999368, box 65×63 px, MAE 81.3, SSIM 0.086; catalogued reference pixel box.
3. `INT-WC-23-DESK` (desk) — L1 920411, box 68×50 px, MAE 88.9, SSIM 0.011; current projected composite bounds (diagnostic only).
4. `INT-WC-22-DESK` (desk) — L1 847726, box 68×50 px, MAE 81.9, SSIM 0.013; current projected composite bounds (diagnostic only).
5. `INT-WC-24-DESK` (desk) — L1 812785, box 69×50 px, MAE 77.0, SSIM 0.058; current projected composite bounds (diagnostic only).
6. `INT-WC-21-DESK` (desk) — L1 761799, box 67×48 px, MAE 76.2, SSIM 0.028; current projected composite bounds (diagnostic only).
7. `INT-WC-20-DESK` (desk) — L1 735717, box 66×48 px, MAE 76.3, SSIM 0.036; current projected composite bounds (diagnostic only).
8. `INT-04-WALLPANEL` (wall-panel) — L1 584727, box 44×75 px, MAE 59.1, SSIM 0.074; catalogued reference pixel box.
9. `INT-WC-23-CHAI` (chair) — L1 461999, box 26×53 px, MAE 105.6, SSIM -0.021; current projected composite bounds (diagnostic only).
10. `INT-04-SHELF` (shelf-stand) — L1 411070, box 38×68 px, MAE 53.0, SSIM 0.029; catalogued reference pixel box.

**Visual/engineering review:** This is a confirmed mismatch if it is present in both the crop and the element residual; explanations of pixel residual are provisional until the corresponding model is isolated against the measured target. No unmeasured details should be invented.

### DEPT-05 — Management (room)
Whole ROI: MAE 52.65, SSIM 0.1598; catalogue 19 items.
1. `INT-05-TABLE` (conference-table) — L1 2851540, box 175×75 px, MAE 72.4, SSIM 0.039; catalogued reference pixel box.
2. `SIGN-05` (department-sign) — L1 1846744, box 150×85 px, MAE 48.3, SSIM 0.258; catalogued reference pixel box.
3. `INT-05-DISP-CHART` (display-wall) — L1 1553190, box 75×65 px, MAE 106.2, SSIM 0.050; catalogued reference pixel box.
4. `INT-05-WALLPANEL` (wall-panel) — L1 668437, box 60×72 px, MAE 51.6, SSIM 0.175; catalogued reference pixel box.
5. `INT-05-BOARD` (whiteboard) — L1 518030, box 53×60 px, MAE 54.3, SSIM 0.173; catalogued reference pixel box.
6. `INT-05-CHAIR-0` (chair) — L1 212014, box 25×43 px, MAE 61.8, SSIM 0.031; current projected composite bounds (diagnostic only).
7. `INT-05-CHAIR-1` (chair) — L1 210959, box 25×43 px, MAE 65.4, SSIM 0.060; current projected composite bounds (diagnostic only).
8. `INT-05-PLANTER` (planter-box) — L1 210919, box 40×30 px, MAE 58.6, SSIM 0.038; catalogued reference pixel box.
9. `INT-05-CHAIR-3` (chair) — L1 192292, box 26×43 px, MAE 57.3, SSIM 0.063; current projected composite bounds (diagnostic only).
10. `INT-05-CHAIR-4` (chair) — L1 189162, box 26×43 px, MAE 53.1, SSIM 0.093; current projected composite bounds (diagnostic only).

**Visual/engineering review:** This is a confirmed mismatch if it is present in both the crop and the element residual; explanations of pixel residual are provisional until the corresponding model is isolated against the measured target. No unmeasured details should be invented.

### DEPT-06 — Research (room)
Whole ROI: MAE 49.64, SSIM 0.1768; catalogue 24 items.
1. `INT-06-SHELF` (shelf-stand) — L1 1398288, box 75×95 px, MAE 65.4, SSIM 0.022; catalogued reference pixel box.
2. `SIGN-06` (department-sign) — L1 1318374, box 120×82 px, MAE 44.7, SSIM 0.213; catalogued reference pixel box.
3. `INT-06-DISP-MAP` (display-wall) — L1 961599, box 78×75 px, MAE 54.8, SSIM 0.092; catalogued reference pixel box.
4. `INT-WC-25-DESK` (desk) — L1 863354, box 69×49 px, MAE 83.9, SSIM 0.046; current projected composite bounds (diagnostic only).
5. `INT-WC-29-DESK` (desk) — L1 787764, box 72×51 px, MAE 69.2, SSIM 0.078; current projected composite bounds (diagnostic only).
6. `INT-WC-28-DESK` (desk) — L1 773937, box 71×51 px, MAE 68.9, SSIM -0.001; current projected composite bounds (diagnostic only).
7. `INT-WC-27-DESK` (desk) — L1 728488, box 70×50 px, MAE 68.4, SSIM 0.099; current projected composite bounds (diagnostic only).
8. `INT-WC-26-DESK` (desk) — L1 715979, box 70×49 px, MAE 67.2, SSIM 0.075; current projected composite bounds (diagnostic only).
9. `INT-WC-29-CHAI` (chair) — L1 383272, box 26×57 px, MAE 83.0, SSIM 0.069; current projected composite bounds (diagnostic only).
10. `INT-WC-25-CHAI` (chair) — L1 353086, box 25×54 px, MAE 82.3, SSIM 0.103; current projected composite bounds (diagnostic only).

**Visual/engineering review:** This is a confirmed mismatch if it is present in both the crop and the element residual; explanations of pixel residual are provisional until the corresponding model is isolated against the measured target. No unmeasured details should be invented.

### DEPT-07 — QA & Testing (room)
Whole ROI: MAE 55.68, SSIM 0.1568; catalogue 30 items.
1. `SIGN-07` (department-sign) — L1 1951876, box 137×80 px, MAE 59.4, SSIM 0.190; catalogued reference pixel box.
2. `INT-07-RACK-R` (rack) — L1 1370848, box 68×73 px, MAE 92.1, SSIM 0.064; catalogued reference pixel box.
3. `INT-07-RACK-L` (rack) — L1 1214441, box 48×88 px, MAE 95.8, SSIM 0.069; catalogued reference pixel box.
4. `INT-07-DISP-CHECK` (display-wall) — L1 1128533, box 80×73 px, MAE 64.4, SSIM 0.062; catalogued reference pixel box.
5. `INT-WC-34-DESK` (desk) — L1 851586, box 72×52 px, MAE 75.8, SSIM 0.047; current projected composite bounds (diagnostic only).
6. `INT-WC-30-DESK` (desk) — L1 816466, box 69×49 px, MAE 77.8, SSIM 0.040; current projected composite bounds (diagnostic only).
7. `INT-WC-32-DESK` (desk) — L1 806087, box 71×51 px, MAE 74.2, SSIM 0.035; current projected composite bounds (diagnostic only).
8. `INT-WC-35-DESK` (desk) — L1 684986, box 72×52 px, MAE 59.0, SSIM 0.094; current projected composite bounds (diagnostic only).
9. `INT-WC-33-DESK` (desk) — L1 683226, box 71×51 px, MAE 60.8, SSIM 0.114; current projected composite bounds (diagnostic only).
10. `INT-WC-31-DESK` (desk) — L1 648568, box 70×50 px, MAE 60.9, SSIM 0.073; current projected composite bounds (diagnostic only).

**Visual/engineering review:** This is a confirmed mismatch if it is present in both the crop and the element residual; explanations of pixel residual are provisional until the corresponding model is isolated against the measured target. No unmeasured details should be invented.

## Unsupported, missing, and uncertain content

The architecture catalogue records expected object categories; rendered primitive counts are included per room above. A catalogue entry alone does not prove visual match. Detailed content without a source-specific measurement (tiny screen copy, exact data values, book spine titles, shelf decor variants) is ND and must remain generic or be omitted. In this audit, recently inferred chair/book/rug subgeometry is identified in the source diff and is not treated as a measured target.

## Acceptance status

This is an audit, not an acceptance: **Department Interiors remains open; do not start the next phase.** Any reconstruction change requires a new full-resolution capture, per-room crops, overlays, difference images, geometric residuals, MAE and SSIM; do not judge success by MAE alone.
