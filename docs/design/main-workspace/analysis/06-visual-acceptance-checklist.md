# 06 — Visual Acceptance Checklist: WORA Main Workspace

> Reference: `reference/wora-main-workspace.png` (SHA-256 `6f91ff3d…718036a1`). The image is the authority; on any doubt, compare with the image, not with this list.
> Reviewers fill the **Status** column with ✅ Pass / ❌ Fail (with a note). Every item must pass for visual acceptance.

## 0. Review protocol

| Step | Procedure |
|---|---|
| P-1 | Verify the reference first: `sha256sum -c docs/design/main-workspace/reference/wora-main-workspace.png.sha256` → `OK`. If not OK, **stop** |
| P-2 | Render the implementation at exactly **1672 × 941** CSS px (DPR 1), in the reference's visible state (Company Overview active, 3D View active, empty inputs, same data values) |
| P-3 | Take a screenshot and compare it with the reference using (a) a 50 % opacity overlay, (b) a difference blend, and (c) coordinate checks against `02` / `data/measurements.json` |
| P-4 | Tolerances unless stated otherwise: UI boxes ±2 px (High), ±5 px (Medium), ±15 px (Low); colours ΔE2000 ≤ 3 for UI surfaces/text and ≤ 6 for 3D materials; strings must match exactly, character for character |
| P-5 | Repeat at proportional scales (e.g. 1254 × 706, 2508 × 1412): normalised positions must hold within the same relative tolerance |
| P-6 | Overlay comparison is a QA method only. **The reference must never be used as a background, texture or overlay in the shipped application** |

Verification method codes: **OV** = overlay/difference against the reference; **CO** = coordinate measurement against `02`; **TX** = exact string comparison; **CS** = colour sample (ΔE); **VI** = visual inspection side by side; **CT** = count.

## 1. Interface regions

| ID | Description | Reference location (px) | Expected visual property | Method | Status |
|---|---|---|---|---|---|
| VAC-REG-01 | Brand header bar | 0, 0, 295, 67 | Darker navy than the sidebar (#091423); overhangs the scene to x≈295 with a soft right fade | CO, CS, OV | ☐ |
| VAC-REG-02 | Sidebar | 0, 67, 235, 874 | Width 235 px, full height, #121C2C, 1 px edge at x 233–234 | CO, CS | ☐ |
| VAC-REG-03 | 3D viewport | 235, 0, 1437, 941 | Real 3D scene, full-bleed behind all panels (not an image) | VI, OV | ☐ |
| VAC-REG-04 | Top-centre cluster | 550, 10, 590, 117 | Search bar above the status strip, centred at x≈845 | CO | ☐ |
| VAC-REG-05 | Top-right cluster | 1418, 12, 239, 51 | Bell + badge, divider, avatar, name/role, chevron | CO, VI | ☐ |
| VAC-REG-06 | Live Activity | 1420, 83, 236, 266 | Panel size/position; 15–16 px right margin | CO | ☐ |
| VAC-REG-07 | Executive Command | 481, 829, 852, 112 | Width 852, top at y 829, runs to the bottom edge, centred at x≈907 | CO | ☐ |
| VAC-REG-08 | View switcher | 1369, 853, 288, 73 | 3 tabs; 15 px bottom margin; 36 px gap from the command panel | CO | ☐ |
| VAC-REG-09 | No extra UI | Whole frame | No panels, buttons, labels or widgets beyond those in `01 §3` | VI | ☐ |
| VAC-REG-10 | Layering | Whole frame | UI above the 3D scene; no UI panel overlaps another; the same scene parts are occluded (see `02 §2.2`) | OV | ☐ |

## 2. UI labels: exact text (each must match character for character)

| ID | Expected exact string | Location (px, x,y) | Method | Status |
|---|---|---|---|---|
| VAC-TXT-01 | `WORA` | 66, 28 | TX, CO | ☐ |
| VAC-TXT-02 | `Enterprise` | 163, 26 | TX | ☐ |
| VAC-TXT-03 | `My Company` (sidebar) | 61, 100 | TX | ☐ |
| VAC-TXT-04 | `Live` | 61, 127 | TX, VI (glyph treatment per Q-UI-02 resolution) | ☐ |
| VAC-TXT-05 | `Company Overview` | 61, ≈190 | TX | ☐ |
| VAC-TXT-06 | `Executive Office` (nav) | 61, ≈233 | TX | ☐ |
| VAC-TXT-07 | `Departments` | 61, ≈277 | TX | ☐ |
| VAC-TXT-08 | `Agent Directory` | 61, ≈321 | TX | ☐ |
| VAC-TXT-09 | `Projects` | 61, ≈365 | TX | ☐ |
| VAC-TXT-10 | `Tasks & Workflows` | 61, ≈409 | TX | ☐ |
| VAC-TXT-11 | `Knowledge Base` | 61, ≈453 | TX | ☐ |
| VAC-TXT-12 | `Reports & Analytics` | 61, ≈496 | TX | ☐ |
| VAC-TXT-13 | `Integrations` | 61, ≈540 | TX | ☐ |
| VAC-TXT-14 | `Billing & Usage` | 61, ≈584 | TX | ☐ |
| VAC-TXT-15 | `Settings` | 61, ≈628 | TX | ☐ |
| VAC-TXT-16 | `Upgrade to Pro` | 67, 772 | TX | ☐ |
| VAC-TXT-17 | `Unlock more power` / `for your company` (two lines, this break) | 60, 798 / 66, 817 | TX | ☐ |
| VAC-TXT-18 | `Upgrade Now` | 75, 856 | TX | ☐ |
| VAC-TXT-19 | `Search across your company…` | 610, 27 | TX (ellipsis form per Q-UI-01) | ☐ |
| VAC-TXT-20 | `My Company` (status strip) | 610, 80 | TX | ☐ |
| VAC-TXT-21 | `Operational` | 610, 101 | TX | ☐ |
| VAC-TXT-22 | `24` + `AI Employees` | 777, 80 / 753, 101 | TX | ☐ |
| VAC-TXT-23 | `08` + `Working` | 883, 80 / 879, 101 | TX | ☐ |
| VAC-TXT-24 | `03` + `Waiting` | 985, 80 / 982, 101 | TX | ☐ |
| VAC-TXT-25 | `01` + `Blocked` | 1085, 80 / 1080, 101 | TX | ☐ |
| VAC-TXT-26 | Badge `3` | 1444, 15 | TX | ☐ |
| VAC-TXT-27 | `Momen Maaly` | 1530, 22 | TX | ☐ |
| VAC-TXT-28 | `CEO` | 1530, 40 | TX | ☐ |
| VAC-TXT-29 | `Live Activity` | 1452, 98 | TX | ☐ |
| VAC-TXT-30 | `Marketing Agent` / `Finished creating ideas` / `2m ago` | 1475, 133 | TX | ☐ |
| VAC-TXT-31 | `Dev Agent` / `Pushed new code` / `3m ago` | 1475, 183 | TX | ☐ |
| VAC-TXT-32 | `Reviewer Agent` / `Approved the changes` / `4m ago` | 1475, 229 | TX | ☐ |
| VAC-TXT-33 | `Video Producer` / `Started rendering video` / `5m ago` | 1475, 277 | TX | ☐ |
| VAC-TXT-34 | `View All →` | 1583, 325 | TX | ☐ |
| VAC-TXT-35 | `Executive Command` | 555, 844 | TX | ☐ |
| VAC-TXT-36 | `Tell your company what to do…` | 570, 883 | TX (ellipsis per Q-UI-01) | ☐ |
| VAC-TXT-37 | `3D View` | 1395, 899 | TX | ☐ |
| VAC-TXT-38 | `Floor Plan` | 1488, 899 | TX | ☐ |
| VAC-TXT-39 | `Live View` | 1583, 899 | TX | ☐ |
| VAC-TXT-40 | 3D sign `Executive Office` | 792, 141 | TX | ☐ |
| VAC-TXT-41 | 3D sign `Marketing` | 291, 167 | TX | ☐ |
| VAC-TXT-42 | 3D sign `Engineering` | 1247, 169 | TX | ☐ |
| VAC-TXT-43 | 3D sign `Creative Studio` | 248, 442 | TX | ☐ |
| VAC-TXT-44 | 3D sign `Management` | 1430, 400 | TX | ☐ |
| VAC-TXT-45 | 3D sign `Research` | 525, 560 | TX | ☐ |
| VAC-TXT-46 | 3D sign `QA & Testing` | 1095, 560 | TX | ☐ |
| VAC-TXT-47 | Plinth wordmark `WORA` | 842, 502 | TX | ☐ |

## 3. UI components: geometry, state, style

| ID | Description | Reference location | Expected visual property | Method | Status |
|---|---|---|---|---|---|
| VAC-UI-01 | Logo mark | 27, 23, 28, 26 | Interlocking-W, cyan → blue gradient | OV, CS | ☐ |
| VAC-UI-02 | Company selector card | 19, 86, 197, 69 | Radius ≈10, 1 px border, two rows (name+chevron / live) | CO, OV | ☐ |
| VAC-UI-03 | Active nav pill | 13, 175, 203, 40 | Fill #074A5F, radius ≈10, on `Company Overview` only | CO, CS | ☐ |
| VAC-UI-04 | Nav rhythm | x 13–216, centres y 196 … 635 | 11 rows, pitch ≈44, icons x 27–47, labels x 61 | CO | ☐ |
| VAC-UI-05 | Nav icons | x 27–47 | Each glyph matches `04 §2.2` (house, two people, group, person, folder, clipboard-check, book, bar chart, nodes, card, gear) | VI | ☐ |
| VAC-UI-06 | Upgrade card | 19, 727, 197, 166 | Border broken behind the crown (x≈92–143); centred content | OV | ☐ |
| VAC-UI-07 | Crown | 104, 731, 26, 22 | Gold with glow | CS, VI | ☐ |
| VAC-UI-08 | Upgrade button | 40, 843, 156, 36 | Fill #1A2B43, radius ≈8 | CO, CS | ☐ |
| VAC-UI-09 | Search field | 572, 18, 543, 33 inside shell 560, 10, 562, 47 | Magnifier left, faint trailing glyph right, 1 px border | CO, OV | ☐ |
| VAC-UI-10 | Status strip | 550, 63, 590, 64 | Building icon, company block, divider at x≈725, 4 metric groups at x≈753/862/963/1063 | CO | ☐ |
| VAC-UI-11 | Status colours | dots at y 101–112 | Green #05EB62, amber #FEB837, red #FD362D; matching ring icons above | CS | ☐ |
| VAC-UI-12 | Bell + badge | 1433, 25 / 1444, 15 | Red badge overlapping the bell's top-right | CO, VI | ☐ |
| VAC-UI-13 | Avatar | 1486, 21, 34, 33 | Circular photo with a light ring | CO, VI | ☐ |
| VAC-UI-14 | Live Activity rows | avatars x 1442; text x 1475; time right edge x≈1640 | 4 rows, pitch ≈47–48; Video Producer avatar turned three-quarter right | CO, VI | ☐ |
| VAC-UI-15 | Live Activity separator + link | y≈316; 1583, 325 | Thin line; right-aligned `View All →` | CO | ☐ |
| VAC-UI-16 | Command avatar + voice badge | 499, 842 / 497, 889 | Robot bust on a navy circle; teal badge with a 5-bar cyan waveform | VI, CO | ☐ |
| VAC-UI-17 | Command input | 553, 867, 764, 49 | Fill #1C273C, radius ≈10, placeholder at x 570 | CO, CS | ☐ |
| VAC-UI-18 | Send button | 1272, 874, 37, 37 | Teal #019FBB circle, white paper-plane | CO, CS | ☐ |
| VAC-UI-19 | 3D View tab active | 1373, 863, 90, 54 | Fill #06556B – #075B70, white cube icon + label | CO, CS | ☐ |
| VAC-UI-20 | Floor Plan / Live View tabs | icons at 1503,871 / 1597,871 | Unfilled; 2 × 2 grid icon; broadcast `((•))` icon | VI, CO | ☐ |

## 4. Departments

| ID | Description | Reference location | Expected visual property | Method | Status |
|---|---|---|---|---|---|
| VAC-DEP-01 | Executive Office room | env. 660, 120, 410, 210 | Walnut slat back wall, executive desk, shelves, plants, rug, lounge chairs; angled glass front | OV, VI | ☐ |
| VAC-DEP-02 | Executive Office sign | 792, 141, 168, 35 | Faces the camera (0°); gold crown + white text on a dark plate | CO, VI | ☐ |
| VAC-DEP-03 | Marketing room | env. 236, 150, 420, 270 | Bookshelf, bar-chart display, wall dashboard, desk rows, 2 large plants | OV, VI | ☐ |
| VAC-DEP-04 | Marketing sign | 291, 167, 135, 78 | ≈ −24°; megaphone icon (cyan + pink accent) | CO, VI | ☐ |
| VAC-DEP-05 | Engineering room | env. 1060, 150, 380, 280 | Code wall display, white desk rows, plants | OV, VI | ☐ |
| VAC-DEP-06 | Engineering sign | 1247, 169, 173, 81 | ≈ +26°; cyan `</>` | CO, VI | ☐ |
| VAC-DEP-07 | Creative Studio room | env. 236, 420, 400, 290 | Colourful-art monitor, bookshelf, pin-board, desks, plants | OV, VI | ☐ |
| VAC-DEP-08 | Creative Studio sign | 248, 442, 165, 80 | ≈ −24°; white palette icon | CO, VI | ☐ |
| VAC-DEP-09 | Management room | env. 1250, 380, 422, 300 | Diagonal wood conference table, chart wall screen, whiteboard, planter box, wood floor | OV, VI | ☐ |
| VAC-DEP-10 | Management sign | 1430, 400, 150, 85 | ≈ +22°; cyan bar chart | CO, VI | ☐ |
| VAC-DEP-11 | Research room | env. 490, 545, 370, 265 | World-map display, bookshelf, desks, plants | OV, VI | ☐ |
| VAC-DEP-12 | Research sign | 525, 560, 120, 82 | ≈ −27°; cyan flask | CO, VI | ☐ |
| VAC-DEP-13 | QA & Testing room | env. 960, 545, 380, 265 | Server racks (2 banks), check-mark screen, long desks, plants | OV, VI | ☐ |
| VAC-DEP-14 | QA & Testing sign | 1095, 560, 137, 80 | ≈ +26°; cyan shield-check | CO, VI | ☐ |
| VAC-DEP-15 | Department set | Whole scene | Exactly these 7 labelled rooms; no extra or missing departments | CT | ☐ |

## 5. Robots (one item per robot)

| ID | Description | Reference location | Expected visual property | Method | Status |
|---|---|---|---|---|---|
| VAC-ROB-001 | ROBOT-001 present (Executive Office) | head ≈(875, 210) | Robot visible at this projected position, ±12 px at 1672×941; pose: Seated behind the executive desk, facing the camera | Overlay at 1672×941 | ☐ |
| VAC-ROB-002 | ROBOT-002 present (Marketing) | head ≈(431, 250) | Robot visible at this projected position, ±12 px at 1672×941; pose: Seated, facing the camera (back row) | Overlay at 1672×941 | ☐ |
| VAC-ROB-003 | ROBOT-003 present (Marketing) | head ≈(474, 281) | Robot visible at this projected position, ±12 px at 1672×941; pose: Seated, facing the camera | Overlay at 1672×941 | ☐ |
| VAC-ROB-004 | ROBOT-004 present (Marketing) | head ≈(518, 280) | Robot visible at this projected position, ±12 px at 1672×941; pose: Seated, facing the camera (right end) | Overlay at 1672×941 | ☐ |
| VAC-ROB-005 | ROBOT-005 present (Marketing) | head ≈(363, 285) | Robot visible at this projected position, ±12 px at 1672×941; pose: Seated, facing the camera | Overlay at 1672×941 | ☐ |
| VAC-ROB-006 | ROBOT-006 present (Marketing) | head ≈(320, 305) | Robot visible at this projected position, ±12 px at 1672×941; pose: Seated, facing the camera (front-left) | Overlay at 1672×941 | ☐ |
| VAC-ROB-007 | ROBOT-007 present (Marketing) | head ≈(338, 325) | Robot visible at this projected position, ±12 px at 1672×941; pose: Seated, back or side turned to the camera | Overlay at 1672×941 | ☐ |
| VAC-ROB-008 | ROBOT-008 present (Marketing) | head ≈(395, 335) | Robot visible at this projected position, ±12 px at 1672×941; pose: Seated, facing the camera (front centre) | Overlay at 1672×941 | ☐ |
| VAC-ROB-009 | ROBOT-009 present (Marketing) | head ≈(433, 313) | Robot visible at this projected position, ±12 px at 1672×941; pose: Seated, facing the camera | Overlay at 1672×941 | ☐ |
| VAC-ROB-010 | ROBOT-010 present (Engineering) | head ≈(1180, 235) | Robot visible at this projected position, ±12 px at 1672×941; pose: Seated, facing the camera (back row) | Overlay at 1672×941 | ☐ |
| VAC-ROB-011 | ROBOT-011 present (Engineering) | head ≈(1230, 232) | Robot visible at this projected position, ±12 px at 1672×941; pose: Seated, facing the camera (back row) | Overlay at 1672×941 | ☐ |
| VAC-ROB-012 | ROBOT-012 present (Engineering) | head ≈(1237, 248) | Robot visible at this projected position, ±12 px at 1672×941; pose: Seated, head in side profile facing right | Overlay at 1672×941 | ☐ |
| VAC-ROB-013 | ROBOT-013 present (Engineering) | head ≈(1127, 267) | Robot visible at this projected position, ±12 px at 1672×941; pose: Seated, facing the camera (left) | Overlay at 1672×941 | ☐ |
| VAC-ROB-014 | ROBOT-014 present (Engineering) | head ≈(1175, 280) | Robot visible at this projected position, ±12 px at 1672×941; pose: Seated, facing the camera / slightly left | Overlay at 1672×941 | ☐ |
| VAC-ROB-015 | ROBOT-015 present (Engineering) | head ≈(1272, 286) | Robot visible at this projected position, ±12 px at 1672×941; pose: Seated, facing the camera | Overlay at 1672×941 | ☐ |
| VAC-ROB-016 | ROBOT-016 present (Engineering) | head ≈(1220, 313) | Robot visible at this projected position, ±12 px at 1672×941; pose: Seated, facing the camera | Overlay at 1672×941 | ☐ |
| VAC-ROB-017 | ROBOT-017 present (Engineering) | head ≈(1310, 320) | Robot visible at this projected position, ±12 px at 1672×941; pose: Seated | Overlay at 1672×941 | ☐ |
| VAC-ROB-018 | ROBOT-018 present (Engineering) | head ≈(1282, 338) | Robot visible at this projected position, ±12 px at 1672×941; pose: Seated, facing the camera (front) | Overlay at 1672×941 | ☐ |
| VAC-ROB-019 | ROBOT-019 present (Engineering) | head ≈(1386, 305) | Robot visible at this projected position, ±12 px at 1672×941; pose: Seated, facing the camera (right) | Overlay at 1672×941 | ☐ |
| VAC-ROB-020 | ROBOT-020 present (Creative Studio) | head ≈(455, 512) | Robot visible at this projected position, ±12 px at 1672×941; pose: Seated, facing the camera (back desk) | Overlay at 1672×941 | ☐ |
| VAC-ROB-021 | ROBOT-021 present (Creative Studio) | head ≈(473, 543) | Robot visible at this projected position, ±12 px at 1672×941; pose: Seated, facing left toward its monitor (side view) | Overlay at 1672×941 | ☐ |
| VAC-ROB-022 | ROBOT-022 present (Creative Studio) | head ≈(313, 558) | Robot visible at this projected position, ±12 px at 1672×941; pose: Seated | Overlay at 1672×941 | ☐ |
| VAC-ROB-023 | ROBOT-023 present (Creative Studio) | head ≈(338, 558) | Robot visible at this projected position, ±12 px at 1672×941; pose: Seated, facing the camera | Overlay at 1672×941 | ☐ |
| VAC-ROB-024 | ROBOT-024 present (Creative Studio) | head ≈(378, 590) | Robot visible at this projected position, ±12 px at 1672×941; pose: Seated, back to the camera | Overlay at 1672×941 | ☐ |
| VAC-ROB-025 | ROBOT-025 present (Management) | head ≈(1364, 498) | Robot visible at this projected position, ±12 px at 1672×941; pose: Seated at the left end of the conference table, facing the camera | Overlay at 1672×941 | ☐ |
| VAC-ROB-026 | ROBOT-026 present (Management) | head ≈(1398, 527) | Robot visible at this projected position, ±12 px at 1672×941; pose: Seated at the table, facing the camera | Overlay at 1672×941 | ☐ |
| VAC-ROB-027 | ROBOT-027 present (Management) | head ≈(1480, 517) | Robot visible at this projected position, ±12 px at 1672×941; pose: Seated on the far side of the table, facing the camera | Overlay at 1672×941 | ☐ |
| VAC-ROB-028 | ROBOT-028 present (Management) | head ≈(1450, 548) | Robot visible at this projected position, ±12 px at 1672×941; pose: Seated on the near side of the table | Overlay at 1672×941 | ☐ |
| VAC-ROB-029 | ROBOT-029 present (Management) | head ≈(1532, 553) | Robot visible at this projected position, ±12 px at 1672×941; pose: Seated at the right end, facing left toward the table | Overlay at 1672×941 | ☐ |
| VAC-ROB-030 | ROBOT-030 present (Research) | head ≈(723, 642) | Robot visible at this projected position, ±12 px at 1672×941; pose: Seated, facing the camera (back desk) | Overlay at 1672×941 | ☐ |
| VAC-ROB-031 | ROBOT-031 present (Research) | head ≈(757, 680) | Robot visible at this projected position, ±12 px at 1672×941; pose: Seated, facing the camera (right) | Overlay at 1672×941 | ☐ |
| VAC-ROB-032 | ROBOT-032 present (Research) | head ≈(695, 672) | Robot visible at this projected position, ±12 px at 1672×941; pose: Seated, head in side profile facing right | Overlay at 1672×941 | ☐ |
| VAC-ROB-033 | ROBOT-033 present (Research) | head ≈(597, 705) | Robot visible at this projected position, ±12 px at 1672×941; pose: Seated | Overlay at 1672×941 | ☐ |
| VAC-ROB-034 | ROBOT-034 present (Research) | head ≈(643, 733) | Robot visible at this projected position, ±12 px at 1672×941; pose: Seated, facing the camera (front desk) | Overlay at 1672×941 | ☐ |
| VAC-ROB-035 | ROBOT-035 present (QA & Testing) | head ≈(1035, 640) | Robot visible at this projected position, ±12 px at 1672×941; pose: Seated, facing the camera (back row) | Overlay at 1672×941 | ☐ |
| VAC-ROB-036 | ROBOT-036 present (QA & Testing) | head ≈(1006, 667) | Robot visible at this projected position, ±12 px at 1672×941; pose: Seated, facing the camera (left) | Overlay at 1672×941 | ☐ |
| VAC-ROB-037 | ROBOT-037 present (QA & Testing) | head ≈(1100, 670) | Robot visible at this projected position, ±12 px at 1672×941; pose: Seated, facing the camera | Overlay at 1672×941 | ☐ |
| VAC-ROB-038 | ROBOT-038 present (QA & Testing) | head ≈(1077, 700) | Robot visible at this projected position, ±12 px at 1672×941; pose: Seated, facing the camera | Overlay at 1672×941 | ☐ |
| VAC-ROB-039 | ROBOT-039 present (QA & Testing) | head ≈(1167, 700) | Robot visible at this projected position, ±12 px at 1672×941; pose: Seated, head turned to the right (side/back view) | Overlay at 1672×941 | ☐ |
| VAC-ROB-040 | ROBOT-040 present (QA & Testing) | head ≈(1145, 732) | Robot visible at this projected position, ±12 px at 1672×941; pose: Seated, facing the camera (front) | Overlay at 1672×941 | ☐ |
| VAC-ROB-041 | ROBOT-041 present (Atrium / walkway (left)) | head ≈(617, 347) | Robot visible at this projected position, ±12 px at 1672×941; pose: Walking toward the lower right, mid-stride | Overlay at 1672×941 | ☐ |
| VAC-ROB-042 | ROBOT-042 present (Atrium lounge) | head ≈(707, 410) | Robot visible at this projected position, ±12 px at 1672×941; pose: Seated on a dark ottoman, facing the camera | Overlay at 1672×941 | ☐ |
| VAC-ROB-043 | ROBOT-043 present (Atrium lounge) | head ≈(906, 360) | Robot visible at this projected position, ±12 px at 1672×941; pose: Seated on the brown sofa, facing the camera | Overlay at 1672×941 | ☐ |
| VAC-ROB-044 | ROBOT-044 present (Atrium / walkway (right)) | head ≈(1065, 355) | Robot visible at this projected position, ±12 px at 1672×941; pose: Standing, facing the camera | Overlay at 1672×941 | ☐ |
| VAC-ROB-045 | ROBOT-045 present (Atrium / walkway (right)) | head ≈(1097, 370) | Robot visible at this projected position, ±12 px at 1672×941; pose: Walking, facing the camera-left | Overlay at 1672×941 | ☐ |
| VAC-ROB-046 | ROBOT-046 present (Atrium (right of plinth)) | head ≈(1073, 483) | Robot visible at this projected position, ±12 px at 1672×941; pose: Walking | Overlay at 1672×941 | ☐ |
| VAC-ROB-047 | ROBOT-047 present (Walkway (lower-left of Management)) | head ≈(1380, 632) | Robot visible at this projected position, ±12 px at 1672×941; pose: Walking toward the camera | Overlay at 1672×941 | ☐ |
| VAC-ROB-T01 | Total robot count | Whole scene | Exactly **47** robots, distributed per zone as in `03 §5.3`; uncertain objects U-01…U-03 handled per the owner's resolution of Q-3D-05 | CT | ☐ |
| VAC-ROB-T02 | Robot design | All robots | White rounded-box helmet, black visor, cyan eyes, chibi proportions; vest/blue-panel/ear-colour variants as in `03 §5.1` | VI | ☐ |
| VAC-ROB-T03 | Robot scale | All robots | Head width ≈22–30 px at 1672×941; standing height ≈58–66 px | CO | ☐ |

## 6. Furniture and environmental objects

| ID | Description | Reference location | Expected visual property | Method | Status |
|---|---|---|---|---|---|
| VAC-ENV-01 | WORA plinth | 795, 450, 217, 100 | Ellipse W/H ≈2.17, glowing rim, centre (903, 500) | CO, OV | ☐ |
| VAC-ENV-02 | Plinth logo + wordmark | 867, 467 / 842, 502 | Gradient W mark above dark `WORA` | CO, VI | ☐ |
| VAC-ENV-03 | Central planter + tree | 750, 285, 105, 147 | Grey cylinder planter, grass, flowers, single tree | CO, VI | ☐ |
| VAC-ENV-04 | Left lounge | 635, 375 / 630, 420 / 660, 435 | Curved brown sofa, small white planter, dark rug + ottoman | CO, VI | ☐ |
| VAC-ENV-05 | Right lounge | 867, 370 / 930, 397 | Brown sofa; dark grey curved bench | CO, VI | ☐ |
| VAC-ENV-06 | Tree planters (right) | 1180, 405, 80, 105 | Trees in white rectangular planters | CO, VI | ☐ |
| VAC-ENV-07 | Bottom-centre tree | 870, 715, 80, 110 | Tree in a white cylindrical planter | CO, VI | ☐ |
| VAC-ENV-08 | Low cabinets | 940, 740, 140, 80 | Grey low units with brass handles | VI | ☐ |
| VAC-ENV-09 | Large displays | per `03 §4` | Bar chart (Marketing), code (Engineering), art (Creative Studio), charts (Management), world map (Research), check mark (QA & Testing) | VI | ☐ |
| VAC-ENV-10 | Plants inventory | per `03 §4` | Plant positions per room present; no extra hero plants | VI | ☐ |
| VAC-ENV-11 | Monitors / desks / chairs | per room | Desk rows and monitor density comparable to the reference (side-by-side) | VI, OV | ☐ |

## 7. Building geometry

| ID | Description | Reference location | Expected visual property | Method | Status |
|---|---|---|---|---|---|
| VAC-GEO-01 | Diamond orientation | Whole scene | Far corner top-centre, near corner bottom-centre; building diagonal vertical on screen | OV | ☐ |
| VAC-GEO-02 | Lower-left slab edge | (237,597) → (480,826) | Edge line within ±10 px; facade with lower storeys below | CO, OV | ☐ |
| VAC-GEO-03 | Lower-right slab edge | (1333,821) → (1672,597) | Edge line within ±10 px; facade below | CO, OV | ☐ |
| VAC-GEO-04 | Ring layout | `02 §4.1` | 7 rooms around the atrium at the listed relative offsets (±20 px) | CO | ☐ |
| VAC-GEO-05 | Partitions | All rooms | Clear glass walls with thin dark frames; walnut slats in Executive Office; white solid segments where visible | VI | ☐ |
| VAC-GEO-06 | Balustrades | Atrium edges | Glass balustrades with metal top rails where visible | VI | ☐ |
| VAC-GEO-07 | Exterior | Top band, right terrace, facades | Outdoor trees/greenery and lower storeys visible as in the reference | VI | ☐ |
| VAC-GEO-08 | No roof | — | Cutaway with no ceiling | VI | ☐ |

## 8. Camera and perspective

| ID | Description | Reference location | Expected visual property | Method | Status |
|---|---|---|---|---|---|
| VAC-CAM-01 | Framing anchors | plinth (903,500); planter (802,402); Executive Office sign (876,158) | Within ±5 px | CO | ☐ |
| VAC-CAM-02 | Sign angles | SIGN-01…07 | 0°, −24°, +26°, −24°, +22°, −27°, +26° (±3°) | CO | ☐ |
| VAC-CAM-03 | Plinth ellipse aspect | ENV-002 | W/H = 2.17 ± 0.08 | CO | ☐ |
| VAC-CAM-04 | Scale constancy | All robots | Head size ≈22–30 px top to bottom (no strong foreshortening) | CO | ☐ |
| VAC-CAM-05 | Occlusion parity | UI edges | Same scene parts hidden behind each panel as in the reference | OV | ☐ |

## 9. Lighting and materials

| ID | Description | Reference location | Expected visual property | Method | Status |
|---|---|---|---|---|---|
| VAC-LGT-01 | Mood | Whole scene | Warm interior / cool exterior balance matches | VI, CS | ☐ |
| VAC-LGT-02 | Key light | Robot shadows | Contact shadows fall to the left/lower-left | VI | ☐ |
| VAC-LGT-03 | Emissives + bloom | Screens, eyes, plinth rim, light strips | Present with comparable intensity/bloom | VI | ☐ |
| VAC-LGT-04 | Floor material | Atrium | Polished marble with veins and reflections (#ACA0AB – #D2B9B0) | CS, VI | ☐ |
| VAC-LGT-05 | Robot material | Robots | Glossy white shell, black glass visor, emissive cyan eyes | VI | ☐ |
| VAC-LGT-06 | Wood / glass / metal | Rooms | Walnut wall, warm-wood table, clear glass, anthracite frames | VI, CS | ☐ |

## 10. Colour and typography consistency

| ID | Description | Reference location | Expected visual property | Method | Status |
|---|---|---|---|---|---|
| VAC-CLR-01 | Surface colours | `05 §1.1` | ΔE ≤ 3 vs the sampled values | CS | ☐ |
| VAC-CLR-02 | Accent/state colours | `05 §1.2` | ΔE ≤ 3 | CS | ☐ |
| VAC-CLR-03 | Text colours | `05 §1.3` | White primary, grey secondary as sampled | CS | ☐ |
| VAC-TYP-01 | Font family | All text | One neo-grotesque sans family matching the reference letterforms (per Q-UI-06 resolution) | VI, OV | ☐ |
| VAC-TYP-02 | Sizes and weights | `05 §2` | Ink bounds within ±1 px of the `02` text boxes | CO, OV | ☐ |
| VAC-TYP-03 | Text ink extents | `02 §3` | Label right edges match (e.g. `Company Overview` ends at x≈190) ±2 px | CO | ☐ |

## 11. Integrity

| ID | Description | Expected | Method | Status |
|---|---|---|---|---|
| VAC-INT-01 | Reference unchanged | `sha256sum -c` → OK | CLI | ☐ |
| VAC-INT-02 | Reference not used as a texture/background | Image not shipped in the app bundle and not referenced by any UI/3D asset | Code/asset search | ☐ |
| VAC-INT-03 | All UI is real UI | Text selectable/DOM (or equivalent); buttons interactive | Manual | ☐ |
| VAC-INT-04 | All 3D is real geometry | Rooms, robots and furniture are scene objects, not billboards of the reference | Scene inspection | ☐ |
