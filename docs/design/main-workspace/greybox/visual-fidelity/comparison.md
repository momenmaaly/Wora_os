# WORA visual fidelity — before/after report

Generated: 2026-11-23T07:49:04.085Z (UTC)
Reference: `6f91ff3d27f1d69d7189b6d1a599088086bb50048d1c0b492e3ebcdb718036a1` — 1672×941; native comparison is one-to-one.
Capture provenance:
- Before: Preserved screenshot bytes reused; metrics re-computed now. No browser recapture.
- After: Fresh Chromium browser screenshots captured during this run.
- Browser errors after: 0

> **Outcome: not pixel-identical; task remains open.** This pass produced small measurable UI improvements, but the native full-frame difference is still 98.5240% and scene-only is 99.9993%. No zero-difference claim is made.

## Native comparison by region

Pixel difference and threshold >16 are percentages of ROI pixels. RMSE is absolute 8-bit RGB. SSIM is spatial 8×8-block luma mean. Negative pp is an improvement; higher SSIM is an improvement.

| Region | Before diff | After diff | Change | >16 before → after | RMSE8 before → after | SSIM before → after |
|---|---:|---:|---:|---:|---:|---:|
| Full frame | 98.5300% | 98.5240% | -0.0060 pp | 69.9107% → 69.6121% | 63.3785 → 62.4663 | 0.3397 → 0.3441 |
| UI Shell (reference UI boxes only) | 95.2366% | 95.2174% | -0.0192 pp | 17.0027% → 16.5268% | 44.9221 → 43.3560 | 0.6585 → 0.6698 |
| 3D Scene (outside reference UI boxes) | 99.9994% | 99.9993% | -0.0001 pp | 93.6616% → 93.4419% | 70.3733 → 69.6286 | 0.1927 → 0.1938 |
| Geometry and Element Positions (measured rooms/signs/robot boxes) | 99.9995% | 99.9994% | -0.0001 pp | 93.6852% → 93.4574% | 70.7574 → 69.9931 | 0.1946 → 0.1957 |
| Colors and Materials (measured environment/sign ROIs) | 99.9993% | 99.9993% | 0.0000 pp | 94.6495% → 94.5567% | 69.2392 → 69.0682 | 0.2440 → 0.2450 |
| Lighting and Shadows (open-floor samples; objects/UI excluded) | 99.9992% | 99.9992% | 0.0000 pp | 94.0496% → 93.6116% | 56.7646 → 56.5898 | 0.2962 → 0.2953 |
| UI Shell union | 95.2366% | 95.2174% | -0.0192 pp | 17.0027% → 16.5268% | 44.9221 → 43.3560 | 0.6585 → 0.6698 |
| UI · Brand header | 97.7116% | 97.7392% | 0.0276 pp | 59.2501% → 57.1547% | 95.8748 → 92.2844 | 0.2617 → 0.3028 |
| UI · Sidebar | 93.5517% | 93.4913% | -0.0604 pp | 17.6619% → 17.1052% | 49.6019 → 48.2735 | 0.6921 → 0.7012 |
| UI · Top-centre | 99.8317% | 99.8301% | -0.0016 pp | 26.2412% → 26.2458% | 48.4831 → 48.2362 | 0.3900 → 0.3899 |
| UI · Top-right | 99.6029% | 99.6029% | 0.0000 pp | 74.4349% → 75.3818% | 107.0376 → 107.5390 | 0.2227 → 0.2357 |
| UI · Live Activity | 99.1286% | 99.1159% | -0.0127 pp | 23.0438% → 21.2151% | 65.0072 → 61.0359 | 0.4942 → 0.5529 |
| UI · Executive Command | 95.3211% | 95.3447% | 0.0236 pp | 15.9140% → 15.8691% | 36.2118 → 35.3196 | 0.6585 → 0.6550 |
| UI · View switcher | 99.8851% | 99.8851% | 0.0000 pp | 21.0530% → 20.9651% | 44.5525 → 44.9948 | 0.7115 → 0.7056 |
| Typography and Icons | 95.4137% | 95.3733% | -0.0404 pp | 28.0943% → 27.4201% | 62.6133 → 61.0230 | 0.5574 → 0.5728 |
| Scene geometry · DEPT-01 Executive Office (room) | 100.0000% | 100.0000% | 0.0000 pp | 92.8704% → 92.4631% | 65.4154 → 67.9696 | 0.1659 → 0.1652 |
| Scene geometry · DEPT-02 Marketing (room) | 99.9991% | 99.9991% | 0.0000 pp | 94.5741% → 94.1146% | 71.6814 → 68.8199 | 0.1466 → 0.1478 |
| Scene geometry · DEPT-03 Engineering (room) | 99.9990% | 99.9980% | -0.0010 pp | 92.3882% → 91.9440% | 79.0921 → 77.8184 | 0.1088 → 0.1109 |
| Scene geometry · DEPT-04 Creative Studio (room) | 100.0000% | 100.0000% | 0.0000 pp | 92.2888% → 92.0759% | 73.4893 → 72.5558 | 0.1342 → 0.1408 |
| Scene geometry · DEPT-05 Management (room) | 99.9992% | 99.9992% | 0.0000 pp | 91.5292% → 91.1130% | 69.2241 → 68.0061 | 0.1636 → 0.1647 |
| Scene geometry · DEPT-06 Research (room) | 100.0000% | 100.0000% | 0.0000 pp | 91.0444% → 90.8445% | 67.0603 → 65.2095 | 0.1800 → 0.1866 |
| Scene geometry · DEPT-07 QA & Testing (room) | 99.9990% | 99.9990% | 0.0000 pp | 91.9345% → 91.5412% | 74.5550 → 73.1563 | 0.1714 → 0.1717 |
| Scene material/light · ENV-001 Central atrium plaza (open floor) | 99.9995% | 99.9995% | 0.0000 pp | 94.9843% → 94.6890% | 63.7860 → 63.7980 | 0.2645 → 0.2640 |
| Scene material/light · ENV-002 WORA logo plinth (circular dais, glowing rim) | 100.0000% | 100.0000% | 0.0000 pp | 99.0553% → 99.0553% | 63.6528 → 63.6504 | 0.4832 → 0.4832 |
| Scene material/light · ENV-003 Plinth logo mark (interlocking W) | 100.0000% | 100.0000% | 0.0000 pp | 99.2884% → 99.2884% | 71.8511 → 71.8502 | 0.4640 → 0.4640 |
| Scene material/light · ENV-004 Plinth wordmark "WORA" (dark navy) | 100.0000% | 100.0000% | 0.0000 pp | 98.6842% → 98.6842% | 71.2772 → 71.2767 | 0.3885 → 0.3884 |
| Scene material/light · ENV-005 Central round planter + tree | 100.0000% | 100.0000% | 0.0000 pp | 95.6527% → 95.3288% | 59.6712 → 59.7586 | 0.1401 → 0.1426 |
| Scene material/light · ENV-006 Curved brown sofa (left lounge) | 100.0000% | 100.0000% | 0.0000 pp | 95.5844% → 95.5844% | 76.1537 → 76.1522 | 0.1978 → 0.1978 |
| Scene material/light · ENV-009 Brown sofa (right of planter) | 100.0000% | 100.0000% | 0.0000 pp | 98.4499% → 98.4499% | 84.6683 → 84.6683 | 0.1723 → 0.1723 |
| Scene material/light · ENV-010 Dark grey curved bench | 100.0000% | 100.0000% | 0.0000 pp | 93.0222% → 93.0222% | 60.4731 → 60.4723 | 0.3447 → 0.3447 |
| Scene material/light · ENV-014 Lower-left exterior facade (floors below) | 100.0000% | 100.0000% | 0.0000 pp | 96.2149% → 96.2278% | 79.9863 → 79.7121 | 0.1471 → 0.1480 |
| Scene material/light · ENV-015 Lower-right exterior facade (floors below) | 99.9990% | 99.9990% | 0.0000 pp | 94.2568% → 94.3196% | 68.7272 → 68.7221 | 0.2680 → 0.2676 |
| Scene material/light · ENV-016 Exterior glazing + outdoor trees (top band) | 100.0000% | 100.0000% | 0.0000 pp | 94.8452% → 94.8416% | 61.9894 → 61.9282 | 0.2968 → 0.2974 |

## Required viewport comparisons

All dimensions have fresh after screenshots. Before screenshots are preserved; comparisons at non-native dimensions use uniform contain, nearest-neighbour and centred dark letterboxing. They are diagnostics because there is no matching owner-approved reference at these aspect ratios; in particular mobile is not judged against a desktop image.

| Viewport | ROI | Before diff | After diff | Change | SSIM before → after |
|---|---|---:|---:|---:|---:|
| desktop-1920x1080 | fullFrame | 98.5195% | 98.5149% | -0.0046 pp | 0.3572 → 0.3613 |
| desktop-1920x1080 | measuredUiRegions | 95.2296% | 95.2153% | -0.0143 pp | 0.6829 → 0.6947 |
| desktop-1920x1080 | sceneOutsideMeasuredUi | 99.9998% | 99.9996% | -0.0002 pp | 0.2127 → 0.2133 |
| desktop-1440x900 | fullFrame | 99.0211% | 99.0239% | 0.0028 pp | 0.2455 → 0.2493 |
| desktop-1440x900 | measuredUiRegions | 96.5175% | 96.5277% | 0.0102 pp | 0.4127 → 0.4249 |
| desktop-1440x900 | sceneOutsideMeasuredUi | 99.9999% | 99.9998% | -0.0001 pp | 0.1853 → 0.1865 |
| desktop-1366x768 | fullFrame | 98.5333% | 98.5284% | -0.0049 pp | 0.3036 → 0.3101 |
| desktop-1366x768 | measuredUiRegions | 95.2836% | 95.2679% | -0.0156 pp | 0.6183 → 0.6311 |
| desktop-1366x768 | sceneOutsideMeasuredUi | 99.9997% | 99.9997% | 0.0000 pp | 0.1580 → 0.1613 |
| mobile-390x844 | fullFrame | 100.0000% | 100.0000% | 0.0000 pp | 0.3178 → 0.3085 |
| mobile-390x844 | measuredUiRegions | 100.0000% | 100.0000% | 0.0000 pp | 0.0639 → 0.0631 |
| mobile-390x844 | sceneOutsideMeasuredUi | 100.0000% | 100.0000% | 0.0000 pp | 0.3375 → 0.3277 |
| mobile-430x932 | fullFrame | 100.0000% | 99.9998% | -0.0002 pp | 0.3190 → 0.3191 |
| mobile-430x932 | measuredUiRegions | 100.0000% | 100.0000% | 0.0000 pp | 0.0746 → 0.0741 |
| mobile-430x932 | sceneOutsideMeasuredUi | 100.0000% | 99.9997% | -0.0003 pp | 0.3386 → 0.3390 |

Required viewports captured: 1920×1080, 1440×900, 1366×768, 390×844, 430×932; plus native 1672×941. Desktop Inter regular/semibold and mobile Inter were verified by the browser after fonts.ready.

## Findings and remaining blockers

- UI text/shape anti-aliasing, typeface metrics, and colors were conflated in exact pixel counts; Inter is now explicitly embedded because the measured UI CSS requested it but the baseline had no font asset.
- The browser-only gold REFERENCE SNAPSHOT · STATIC line in Live Activity was an invented visible element; removed from the visible layer while retaining the local/static disclosure in the tooltip and screen-reader-only text.
- The top-right reference contains a real portrait; the implementation intentionally uses a neutral circle, so this region cannot be exact without an approved avatar source.
- The measured room and robot ROIs remain near-total pixel mismatch; visual inspection shows broad layout correspondence but substantial differences in room boundaries, windows/environment, robot/desk detail, materials, lighting and shadows. No robot position or building geometry was altered in this pass; identifying a permissible geometry/asset correction needs a separately reviewed plan.
- Mobile has no reference image and is composed as a distinct narrow-screen UI. Letterboxed desktop-reference metrics are recorded solely for transparency and are not a mobile quality score.

- Independent review: **not performed**. No independent reviewer/orchestration service was available; this is not represented as an independent pass.
- Layer masks and measurement definitions are documented in the JSON report. Per-region native difference images, native full/UI/scene overlays and each viewport's contain-diff/overlay images are in the adjacent `before/` and `after/` folders.
- The reference asset was not modified. No building geometry or robot positions were changed. Scene reconstruction requires a reviewed, justified follow-up plan; do not infer exact alignment from aggregate percentages alone.

## Validation

Automated suite: 87 tests passed; TypeScript check and Vite production build passed. Browser captures: Chromium 153 headless with SwiftShader, deviceScaleFactor 1; no console/page errors. SwiftShader is not a hardware-GPU performance benchmark.
