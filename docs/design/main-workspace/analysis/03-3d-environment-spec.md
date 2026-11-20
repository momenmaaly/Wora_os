# 03 — 3D Environment Specification: WORA Main Workspace

> Reference: `reference/wora-main-workspace.png` (SHA-256 `6f91ff3d…718036a1`, verified). The image is the authority.
> Scope: building, departments, furniture, robots, materials, lighting and camera **as visible**. Anything not visible is marked **Not determinable (ND)**. Estimates are marked **(est.)**.

---

## 1. What the 3D scene is

- A **single office floor of a multi-storey building**, rendered as a **roofless cutaway** and seen from high above at an oblique angle. It is stylised, clean and "isometric-dollhouse" in look.
- The scene fills the whole canvas (REG-03, full-bleed). All UI panels float above it.
- Visual style: soft global illumination, warm interior light, glossy materials, miniature/tilt-shift character, and chibi-proportioned white robots.

## 2. Building structure and geometry

### 2.1 Overall form (as visible)
| Property | Observation | Conf. |
|---|---|---|
| Floor footprint orientation | The floor reads as a **diamond** on screen. The far corner is at top-centre (≈x 860–900, behind the status strip, exact apex ND). The near corner is at bottom-centre (behind the Executive Command panel, ND). The left and right corners are outside the visible area or behind the sidebar/right edge (ND) | Medium |
| Footprint shape | Roughly square/octagonal with rooms around a central atrium. Exact outline ND (corners hidden) | Low |
| Floor slab edge, lower-left | Visible line from ≈(237, 597) to ≈(480, 826). Screen angle ≈ 43° below horizontal | Medium |
| Floor slab edge, lower-right | Visible line from ≈(1333, 821) to ≈(1672, 597). Screen angle ≈ 33° below horizontal | Medium |
| Lower storeys | Visible below both slab edges (ENV-014, ENV-015): stacked floors with light concrete slab bands, dark glazing and warm-lit interiors. Number of storeys ND (≥2 partially visible on each side) | Medium |
| Upper exterior band | Top ≈170 px: exterior glazing/edge with outdoor trees beyond (ENV-016). Mostly covered by REG-01/04/05 | Medium |
| Outdoor surroundings | Trees and greenery outside the building, top and right (ENV-016, ENV-017), plus trees at the bottom-right corner (x > 1580, y 780–900). The wider site is ND | Medium |
| Roof / ceiling | None: cutaway with no ceiling | High |
| Levels within the floor | One main floor level. The atrium plaza and the room floors appear to be at the same level. A level change is ND (Q-3D-02) | Low |

### 2.2 Partitions, walls and boundaries
| Element | Observation |
|---|---|
| Department enclosures | Each department is a room enclosed mainly by **full-height clear glass walls** with **thin dark anthracite metal frames** (vertical mullions and top/bottom rails) |
| Solid wall segments | Glossy white/light-grey wall slabs at some room backs and corners (e.g. behind the Management whiteboard and the Creative Studio pin-board) |
| Executive Office walls | Back wall in **dark walnut vertical slats**. Glass side and front walls; the front corners are **angled** (faceted plan) |
| Light lines | Bright white linear highlights run along the top edges of the partitions and along the floor edges / walkway borders. They read as emissive LED strips or strong specular highlights (Q-3D-07) |
| Balustrades | Glass balustrades with metal top rails line the walkway edges around the atrium. They are clearly visible between the atrium and Research / QA & Testing, and in front of the Executive Office and Engineering |
| Entrances / doors | **No door leaf, door frame or opening is clearly identifiable** in any room at this resolution (ND, Q-3D-01). Do not invent door positions |
| Corridors | A walkway ring separates the rooms from the atrium. Free-roaming robots stand and walk on it (ROBOT-041, 044, 045, 047). Its exact width is ND, ≈40–80 px on screen (est.) |

### 2.3 Spatial arrangement (ring layout)
```
                    [ Executive Office ]          ← far corner (top-centre)
     [ Marketing ]                     [ Engineering ]
                     ( atrium: planter, lounge,
[ Creative Studio ]    WORA plinth )            [ Management ]
          [ Research ]               [ QA & Testing ]
                    ( near corner: tree planter )  ← bottom-centre, behind command bar
```
- Seven labelled rooms surround the central atrium. The relative screen positions are given in `02 §4.1`.
- Adjacency (as visible): Marketing ↔ Executive Office (left side); Executive Office ↔ Engineering (right side); Marketing above Creative Studio; Engineering above Management; Creative Studio ↔ Research; Research ↔ QA & Testing across the near corner; QA & Testing ↔ Management.

## 3. Central atrium (ENV-001)

| ID | Object | Screen box (x,y,w,h) | Description |
|---|---|---|---|
| ENV-002 | WORA plinth | 795, 450, 217, 100 | Low **circular dais** projected as an ellipse (W/H ≈ 2.17). **Glowing white/silver rim** with bloom; floor-coloured top. Centre (903, 500) |
| ENV-003 | Plinth logo mark | 867, 467, 68, 31 | Interlocking-W ribbon logo, cyan (#29C5DA est.) to blue (#1E7FB0 est.) gradient, laid flat on the dais |
| ENV-004 | Plinth wordmark | 842, 502, 120, 19 | `WORA`, dark navy (#12233A est.), bold geometric caps, laid flat |
| ENV-005 | Round planter + tree | 750, 285, 105, 147 | Grey concrete cylinder (planter 750–855 × 372–432) filled with grass and small yellow-white flowers; a single deciduous tree with a light trunk and a mid-green canopy (755–845 × 285–378) |
| ENV-006 | Curved sofa (left) | 635, 375, 105, 55 | Brown leather (#966B61 sampled), curved, low |
| ENV-007 | Small planter | 630, 420, 25, 30 | White round pot with a green plant |
| ENV-008 | Rug + ottoman | 660, 435, 110, 40 | Dark slate round rug (#4E4F63 sampled) with a dark rectangular ottoman/bench on it; ROBOT-042 sits on it |
| ENV-009 | Sofa (right of planter) | 867, 370, 73, 38 | Dark brown sofa; ROBOT-043 sits on it |
| ENV-010 | Curved bench | 930, 397, 90, 50 | Dark warm-grey upholstered curved bench (#665D68 sampled), unoccupied |
| ENV-011 | Tree planters | 1180, 405, 80, 105 | Small trees and shrubs in white rectangular planters next to the Management room |
| ENV-012 | Bottom-centre tree | 870, 715, 80, 110 | Tree in a white cylindrical planter at the near corner, between Research and QA & Testing |
| ENV-013 | Low cabinets | 940, 740, 140, 80 | Low grey cabinets/benches with small brass handles near the near corner (Low confidence) |
| — | Floor | — | **Polished marble/terrazzo**: light warm grey with thin grey veining and reflections (#ACA0AB to #D2B9B0 sampled) |

## 4. Departments

Sign plates are part of the 3D scene: dark rounded rectangular plaques with a left icon and white bold text, mounted above each room's atrium-facing glass. Each plate is aligned with its room's front wall. In screen space this gives a rotation of 0° (Executive Office) or roughly ±22° to ±27°.

### DEPT-01 · `Executive Office`
| Property | Value |
|---|---|
| Location | Far corner, top-centre; front faces the atrium and the plinth |
| Screen envelope | 660, 120, 410, 210 (Medium) |
| Sign | SIGN-01 at 792, 141, 168, 35; **faces the camera (≈0°)**; gold crown icon + white `Executive Office` |
| Structure | Dark walnut slat back wall (#897047 sampled); glass side/front walls with angled front corners |
| Furniture | Wooden executive desk (≈808–940 × 238–282) with a dark laptop/keyboard, a small white robot-like figurine (U-01, ≈(827,235)) and a small dark object (≈(915,241)); a light-grey tall shape behind the robot (high-back chair or similar, ND); a light patterned rug (≈780–960 × 255–300); dark grey lounge armchairs/sofa front-left (≈730–765 × 260–290) and front-right (≈985–1020 × 260–282) |
| Shelving and decor | Left wall shelf with small plants and objects (≈760–800 × 185–220); right-wall floating wooden shelves with sculptures/vases (≈940–995 × 180–240) |
| Plants | Large potted plants left (≈745, 220) and right (≈1012, 225); a smaller plant at the left back |
| Robots | ROBOT-001 (1) |
| Relationship | Directly "above" the central planter and plinth on screen; Marketing is to its left, Engineering to its right |

### DEPT-02 · `Marketing`
| Property | Value |
|---|---|
| Location | Upper-left of the atrium; the left part is hidden by the sidebar |
| Screen envelope | 236, 150, 420, 270 (Low) |
| Sign | SIGN-02 at 291, 167, 135, 78; rotated ≈ −24° (rises to the right); cyan megaphone with a pink/magenta accent + `Marketing` |
| Displays | Large standing display with a **blue rising bar chart** (≈485–555 × 205–275); dark wall screen with dashboard/line charts on the left wall (≈320–390 × 230–280) |
| Furniture | Wooden bookshelf with books and decor (≈452–530 × 160–255); rows of light-wood desks with 2–3 monitors each; dark office chairs |
| Plants | Large potted plant at the left (≈240–290 × 265–355); potted plant at the right (≈560–600 × 268–330) |
| Robots | ROBOT-002 … ROBOT-009 (8) |
| Relationship | Executive Office to the right; Creative Studio below; ROBOT-041 walks on the walkway at its lower-right |

### DEPT-03 · `Engineering`
| Property | Value |
|---|---|
| Location | Upper-right of the atrium; the right part is hidden by the Live Activity panel |
| Screen envelope | 1060, 150, 380, 280 (Low) |
| Sign | SIGN-03 at 1247, 169, 173, 81; rotated ≈ +26° (falls to the right); cyan `</>` + `Engineering` |
| Displays | Large dark wall display with **code** (blue/white text lines) (≈1287–1360 × 232–300); many monitors with code/blue UIs |
| Furniture | White desks in rows; dark office chairs |
| Plants | Potted plants at the back (≈(1192,195), ≈(1280,225)) |
| Robots | ROBOT-010 … ROBOT-019 (10) |
| Relationship | Executive Office to the left; Management below; ROBOT-044/045 stand on the walkway at its lower-left |

### DEPT-04 · `Creative Studio`
| Property | Value |
|---|---|
| Location | Left of the atrium, below Marketing; the left part is hidden by the sidebar |
| Screen envelope | 236, 420, 400, 290 (Low) |
| Sign | SIGN-04 at 248, 442, 165, 80; rotated ≈ −24°; white painter's palette + `Creative Studio` |
| Displays | Large standing monitor with **colourful artwork** (orange/red/blue shapes) (≈356–421 × 487–550); smaller monitors with colourful art |
| Furniture | Wooden bookshelf/cabinet (≈478–516 × 462–530); whiteboard/pin-board on the back-right wall (≈543–581 × 480–540); grey/white desks with drawer cabinets; dark chairs |
| Plants | ≈(451, 485), small plant on a cabinet ≈(516, 505), large plant ≈(596, 540), plants at the left ≈(256–286, 560–590) |
| Robots | ROBOT-020 … ROBOT-024 (5); uncertain object U-03 |
| Relationship | Marketing above; Research to the lower-right |

### DEPT-05 · `Management`
| Property | Value |
|---|---|
| Location | Right of the atrium, below Engineering; the right part runs off the image |
| Screen envelope | 1250, 380, 422, 300 (Low) |
| Sign | SIGN-05 at 1430, 400, 150, 85; rotated ≈ +22°; cyan bar chart + `Management` |
| Displays | Large wall screen with **bar/line charts** (≈1472–1547 × 460–525); whiteboard with coloured notes/diagrams (≈1317–1370 × 420–480) |
| Furniture | Long **wooden conference table** set diagonally (≈1365–1540 × 505–580; warm wood, highlight #E4A77D sampled) with laptops, papers and devices; dark office chairs; warm wood floor (#805E4C sampled) |
| Plants | Back plants (≈(1390,470), ≈(1430,475)); plant at the left (≈(1290,500)); wooden planter box at the front (≈(1500,620)); plant at the right (≈(1620,550)) |
| Robots | ROBOT-025 … ROBOT-029 (5); uncertain object U-02 |
| Relationship | Engineering above; QA & Testing to the lower-left; ROBOT-047 walks outside its lower-left glass |

### DEPT-06 · `Research`
| Property | Value |
|---|---|
| Location | Lower-left of the atrium, next to the near corner |
| Screen envelope | 490, 545, 370, 265 (Medium) |
| Sign | SIGN-06 at 525, 560, 120, 82; rotated ≈ −27°; cyan flask + `Research` |
| Displays | Large display with a **blue world map** (≈602–680 × 615–690); monitors with charts |
| Furniture | Wooden bookshelf with books (≈705–780 × 575–670); grey desks; dark chairs |
| Plants | Potted plant at the back (≈(682, 592)); plant at the left (≈(485, 710)) |
| Robots | ROBOT-030 … ROBOT-034 (5) |
| Relationship | Creative Studio to the upper-left; atrium above; QA & Testing across the near corner |

### DEPT-07 · `QA & Testing`
| Property | Value |
|---|---|
| Location | Lower-right of the atrium, next to the near corner |
| Screen envelope | 960, 545, 380, 265 (Medium) |
| Sign | SIGN-07 at 1095, 560, 137, 80; rotated ≈ +26°; cyan shield-check + `QA & Testing` |
| Displays | Large screen with a **blue circular check mark** (≈1122–1202 × 622–695); many monitors with blue/colourful test UIs |
| Equipment | **Server racks** with blue LEDs: left-back bank (≈1077–1125 × 567–655) and right bank (≈1222–1290 × 637–710) |
| Furniture | Long desks with many monitors; dark chairs; floor darker than the atrium (#655B61 sampled) |
| Plants | Back-left (≈(1060, 597)); large plant at the right (≈(1287, 710)); behind the glass at the left (≈(990, 640)) |
| Robots | ROBOT-035 … ROBOT-040 (6) |
| Relationship | Research across the near corner; Management to the upper-right |

## 5. Robots and AI employees

### 5.1 Common robot design (as visible on all scene robots)
| Part | Visible design |
|---|---|
| Proportions | Chibi: very large head (≈40–45 % of total height), compact torso, short limbs. Standing height on screen ≈58–66 px; head width ≈22–30 px |
| Head | Glossy **white rounded-box helmet**, wider than tall (≈1.2 : 1), softly bevelled |
| Face | Large **black glossy visor** covering most of the front |
| Eyes | Two **glowing cyan/blue** eye shapes on the visor (arcs/chevrons, expressive; #19C6FF to #3FD8FF est.) |
| Ears | Round side discs, usually blue. ROBOT-046 has an **orange-red** ear disc. The UI command avatar has a peach/orange ear disc |
| Antenna | Small nub on top, visible on ROBOT-046 and the command avatar; ND on the others |
| Torso | White with **blue accent panels**. Some robots wear a **dark navy vest/jacket** (ROBOT-041, 044, 045). ROBOT-046 has a **blue** torso panel. ROBOT-001 has a **blue cravat-like collar accent** |
| Limbs | White arms and legs with light-grey joints; dark feet/soles |
| Props | Free-roaming robots hold **tablets with glowing cyan screens**; seated robots work at monitors/keyboards |
| Materials | Glossy plastic/ceramic white; glass-black visor; emissive eyes and screen props |

### 5.2 Per-robot specification
Head-centre positions are measured. Seated-robot boxes are standardised approximations (see `02 §5`). "Facing the camera" means the visor is visible to the viewer. **No capabilities or behaviours beyond the visible pose are implied.**

| Robot ID | Zone | Head centre (px) | Approx. visible box x,y,w,h (px) | Normalised head centre | Pose / orientation (as visible) | Nearby objects | Conf. |
|---|---|---|---|---|---|---|---|
| ROBOT-001 | Executive Office | (875, 210) | 852, 192, 45, 66 | (0.5233, 0.2232) | Seated behind the executive desk, facing the camera; hands at a dark laptop/keyboard. Blue cravat-like accent at the collar | Executive desk, figurine (U-01), wood-slat wall, sign above | High |
| ROBOT-002 | Marketing | (431, 250) | 416, 237, 30, 45 | (0.2578, 0.2657) | Seated, facing the camera (back row) | Back-row desk monitors, bookshelf, blue bar-chart display | High |
| ROBOT-003 | Marketing | (474, 281) | 459, 268, 30, 45 | (0.2835, 0.2986) | Seated, facing the camera | Back-right desk, monitors | High |
| ROBOT-004 | Marketing | (518, 280) | 503, 267, 30, 45 | (0.3098, 0.2976) | Seated, facing the camera (right end) | Back-right desk, potted plant at right | High |
| ROBOT-005 | Marketing | (363, 285) | 348, 272, 30, 45 | (0.2171, 0.3029) | Seated, facing the camera | Middle desk, monitors, wall dashboard screen | High |
| ROBOT-006 | Marketing | (320, 305) | 305, 292, 30, 45 | (0.1914, 0.3241) | Seated, facing the camera (front-left) | Front-left desk, large plant at left | High |
| ROBOT-007 | Marketing | (338, 325) | 323, 312, 30, 45 | (0.2022, 0.3454) | Seated, back or side turned to the camera; head not clearly visible | Front-left desk, beside ROBOT-006 | Medium |
| ROBOT-008 | Marketing | (395, 335) | 380, 322, 30, 45 | (0.2362, 0.3560) | Seated, facing the camera (front centre) | Front desk monitors | High |
| ROBOT-009 | Marketing | (433, 313) | 418, 300, 30, 45 | (0.2590, 0.3326) | Seated, facing the camera | Centre desk, monitors | Medium |
| ROBOT-010 | Engineering | (1180, 235) | 1165, 222, 30, 45 | (0.7057, 0.2497) | Seated, facing the camera (back row) | Back desk, potted plant behind | High |
| ROBOT-011 | Engineering | (1230, 232) | 1215, 219, 30, 45 | (0.7356, 0.2465) | Seated, facing the camera (back row) | Back desk monitors | High |
| ROBOT-012 | Engineering | (1237, 248) | 1222, 235, 30, 45 | (0.7398, 0.2635) | Seated, head in side profile facing right | Next to ROBOT-011 | Medium |
| ROBOT-013 | Engineering | (1127, 267) | 1112, 254, 30, 45 | (0.6740, 0.2837) | Seated, facing the camera (left) | Left desk, monitors | High |
| ROBOT-014 | Engineering | (1175, 280) | 1160, 267, 30, 45 | (0.7028, 0.2976) | Seated, facing the camera / slightly left | Left desk cluster | High |
| ROBOT-015 | Engineering | (1272, 286) | 1257, 273, 30, 45 | (0.7608, 0.3039) | Seated, facing the camera | Centre desk, below the large code display | High |
| ROBOT-016 | Engineering | (1220, 313) | 1205, 300, 30, 45 | (0.7297, 0.3326) | Seated, facing the camera | Front-centre desk monitors | High |
| ROBOT-017 | Engineering | (1310, 320) | 1295, 307, 30, 45 | (0.7835, 0.3401) | Seated; partly hidden behind a monitor | Front desk | Medium |
| ROBOT-018 | Engineering | (1282, 338) | 1267, 325, 30, 45 | (0.7667, 0.3592) | Seated, facing the camera (front) | Front desk monitors | High |
| ROBOT-019 | Engineering | (1386, 305) | 1371, 292, 30, 45 | (0.8289, 0.3241) | Seated, facing the camera (right) | Right desk, monitors | High |
| ROBOT-020 | Creative Studio | (455, 512) | 440, 499, 30, 45 | (0.2721, 0.5441) | Seated, facing the camera (back desk) | Monitor with colourful artwork, bookshelf | High |
| ROBOT-021 | Creative Studio | (473, 543) | 458, 530, 30, 45 | (0.2829, 0.5770) | Seated, facing left toward its monitor (side view) | Right desk, monitor | High |
| ROBOT-022 | Creative Studio | (313, 558) | 298, 545, 30, 45 | (0.1872, 0.5930) | Seated; only partly visible at the far left | Left desk | Medium |
| ROBOT-023 | Creative Studio | (338, 558) | 323, 545, 30, 45 | (0.2022, 0.5930) | Seated, facing the camera | Monitor with colourful artwork | High |
| ROBOT-024 | Creative Studio | (378, 590) | 363, 577, 30, 45 | (0.2261, 0.6270) | Seated, back to the camera | Front desk, monitors | High |
| ROBOT-025 | Management | (1364, 498) | 1349, 485, 30, 45 | (0.8158, 0.5292) | Seated at the left end of the conference table, facing the camera | Conference table, whiteboard behind | High |
| ROBOT-026 | Management | (1398, 527) | 1383, 514, 30, 45 | (0.8361, 0.5600) | Seated at the table, facing the camera | Conference table | High |
| ROBOT-027 | Management | (1480, 517) | 1465, 504, 30, 45 | (0.8852, 0.5494) | Seated on the far side of the table, facing the camera | Wall screen with charts behind | High |
| ROBOT-028 | Management | (1450, 548) | 1435, 535, 30, 45 | (0.8672, 0.5824) | Seated on the near side of the table; visor visible to the camera | Conference table, laptop | High |
| ROBOT-029 | Management | (1532, 553) | 1517, 540, 30, 45 | (0.9163, 0.5877) | Seated at the right end, facing left toward the table | Conference table | High |
| ROBOT-030 | Research | (723, 642) | 708, 629, 30, 45 | (0.4324, 0.6823) | Seated, facing the camera (back desk) | Bookshelf, monitors | High |
| ROBOT-031 | Research | (757, 680) | 742, 667, 30, 45 | (0.4528, 0.7226) | Seated, facing the camera (right) | Right desk | High |
| ROBOT-032 | Research | (695, 672) | 680, 659, 30, 45 | (0.4157, 0.7141) | Seated, head in side profile facing right; partly hidden | Monitor (colourful screen) | Medium |
| ROBOT-033 | Research | (597, 705) | 582, 692, 30, 45 | (0.3571, 0.7492) | Seated; only partly visible behind a monitor at the left | Left desk | Medium |
| ROBOT-034 | Research | (643, 733) | 628, 720, 30, 45 | (0.3846, 0.7790) | Seated, facing the camera (front desk) | Front desk monitors | High |
| ROBOT-035 | QA & Testing | (1035, 640) | 1020, 627, 30, 45 | (0.6190, 0.6801) | Seated, facing the camera (back row) | Monitors | High |
| ROBOT-036 | QA & Testing | (1006, 667) | 991, 654, 30, 45 | (0.6017, 0.7088) | Seated, facing the camera (left) | Left desk | High |
| ROBOT-037 | QA & Testing | (1100, 670) | 1085, 657, 30, 45 | (0.6579, 0.7120) | Seated, facing the camera | Behind monitors, near the server racks | High |
| ROBOT-038 | QA & Testing | (1077, 700) | 1062, 687, 30, 45 | (0.6441, 0.7439) | Seated, facing the camera | Centre desk | High |
| ROBOT-039 | QA & Testing | (1167, 700) | 1152, 687, 30, 45 | (0.6980, 0.7439) | Seated, head turned to the right (side/back view) | Below the large check-mark screen | High |
| ROBOT-040 | QA & Testing | (1145, 732) | 1130, 719, 30, 45 | (0.6848, 0.7779) | Seated, facing the camera (front) | Front desk monitors | High |
| ROBOT-041 | Atrium / walkway (left) | (617, 347) | 605, 332, 37, 60 | (0.3690, 0.3688) | Walking toward the lower right, mid-stride; dark vest; holding a tablet with a cyan screen; blue ear disc | Between Marketing and the left lounge | High |
| ROBOT-042 | Atrium lounge | (707, 410) | 692, 395, 38, 62 | (0.4228, 0.4357) | Seated on a dark ottoman, facing the camera; device on its lap | Dark round rug, curved brown sofa | High |
| ROBOT-043 | Atrium lounge | (906, 360) | 887, 347, 38, 60 | (0.5419, 0.3826) | Seated on the brown sofa, facing the camera; holding a tablet | Brown sofa ENV-009, central planter | High |
| ROBOT-044 | Atrium / walkway (right) | (1065, 355) | 1050, 342, 30, 58 | (0.6370, 0.3773) | Standing, facing the camera; dark vest; holding a tablet/folder | Near the Engineering glass front | High |
| ROBOT-045 | Atrium / walkway (right) | (1097, 370) | 1082, 357, 38, 60 | (0.6561, 0.3932) | Walking, facing the camera-left; dark vest; holding a glowing blue tablet | Beside ROBOT-044 | High |
| ROBOT-046 | Atrium (right of plinth) | (1073, 483) | 1050, 465, 45, 60 | (0.6417, 0.5133) | Walking; blue torso panel; orange-red ear disc; tablet in one hand and a translucent device in the other | Right of the WORA plinth | High |
| ROBOT-047 | Walkway (lower-left of Management) | (1380, 632) | 1363, 615, 43, 65 | (0.8254, 0.6716) | Walking toward the camera; holding a tablet with a cyan screen | Outside the Management glass front | High |

### 5.3 Counts
| Zone | Robots |
|---|---:|
| Executive Office | 1 |
| Marketing | 8 |
| Engineering | 10 |
| Creative Studio | 5 |
| Management | 5 |
| Research | 5 |
| QA & Testing | 6 |
| Free-roaming (atrium / walkways) | 7 |
| **Total** | **47** |

Uncertain robot-like objects (**not** counted; do not add or remove them without owner confirmation): U-01 desk figurine ≈(827,235), U-02 white object among the Management back plants ≈(1400,447), U-03 white/blue rounded object behind a Creative Studio monitor ≈(436,528).

## 6. Furniture and equipment catalogue (types seen)

| Type | Where | Visible appearance |
|---|---|---|
| Work desks | Marketing, Engineering, Creative Studio, Research, QA & Testing | Rectangular, in rows/clusters; light wood (Marketing), white (Engineering), grey/white (Creative Studio, Research), wood/dark (QA & Testing); some with drawer pedestals |
| Executive desk | Executive Office | Dark wood top with a lighter front panel |
| Conference table | Management | Long, warm wood, diagonal |
| Office chairs | All work rooms | Dark grey/black task chairs with 5-star bases |
| Monitors | All work rooms | Thin-bezel dark monitors, often 2–3 per desk, with blue/cyan or colourful UIs |
| Large displays | Marketing (bar chart), Engineering (code), Creative Studio (art), Management (charts), Research (world map), QA & Testing (check mark) | Large, emissive, mostly blue |
| Bookshelves | Marketing, Creative Studio, Research | Wooden, filled with books and decor |
| Whiteboards / pin-boards | Management, Creative Studio | White boards with coloured notes/diagrams |
| Server racks | QA & Testing | Dark tall racks with blue LED panels |
| Lounge seating | Executive Office, atrium | Dark grey armchairs/sofas; brown leather sofas; dark curved bench; dark ottoman |
| Plants | Everywhere | Mostly broad-leaf indoor plants in white/grey pots; trees in the atrium planters |
| Rugs | Executive Office (light patterned), atrium (dark round) | — |

## 7. Materials and colours (3D)

Values are pixel samples under scene lighting (est.). Treat them as rendered appearance targets, not albedo.

| Material | Appearance | Sampled / est. colour |
|---|---|---|
| Atrium floor | Polished marble/terrazzo, light warm grey, thin veins, reflective | #ACA0AB – #D2B9B0 |
| Room floors | Grey stone/tile (Marketing #927A74, Engineering #8F7F80), warm wood (Management #805E4C), darker grey (QA & Testing #655B61, Creative Studio #836B5F) | sampled |
| Walnut slat wall | Dark warm wood, vertical slats | #897047 (lit) |
| Glass | Clear, slightly blue-grey, with white specular streaks | transparent + reflections |
| Frames / mullions | Dark anthracite metal | #2A2E33 – #433D3E |
| Sign plates | Dark navy/charcoal, matte, rounded | #0B1A32 – #1C1C25 |
| Sign text | White, bold | #FFFFFF |
| Sign icons | Cyan (#29C5F6 est.); crown gold (#FACF5A peak); palette white | sampled peaks |
| Robots | Glossy white (#F2F4FA est., lit samples bluish e.g. #BDBDDC); black visor; cyan eyes | est. |
| Screens | Emissive blue | #134AB0 – #1A55C0 |
| Upholstery | Brown leather #966B61; dark rug #4E4F63; warm-grey bench #665D68 | sampled |
| Concrete planter | Mid grey | #4B536A (shadow side) |
| Foliage | Mid to dark green with yellow-green highlights | #394312 (shadowed canopy) |
| Exterior facade | Grey concrete slabs, dark glazing, warm-lit interiors | #38373C – #3B4259 |

## 8. Lighting

| Property | Observation | Conf. |
|---|---|---|
| Overall mood | Bright, warm interior (peach/golden tint on floors and white surfaces) against cooler blue-grey exterior tones | High |
| Key light direction | Robot contact shadows fall to the **left / lower-left** of the feet (ROBOT-041, ROBOT-046), so the key light comes from the right / upper-right (est.) | Medium–Low |
| Shadows | Soft, short contact shadows under robots and furniture; no hard long shadows | Medium |
| Emissive sources | Monitors and large displays (blue), robot eyes (cyan), plinth rim (white glow with bloom), tablet screens (cyan), linear white strips along partition tops / floor edges | High |
| Reflections | Glossy reflections on the marble floor and glass walls; specular highlights on robot helmets | High |
| Bloom / glow | Visible around the plinth rim, light strips, screens and robot eyes | High |
| Depth of field | The top band (exterior/trees) and parts of the facade look slightly softer than the mid-scene (possible tilt-shift/DOF). Not conclusive (Q-3D-06) | Low |

## 9. Camera and perspective

### 9.1 Observations
| Property | Evidence / measurement | Estimate | Conf. |
|---|---|---|---|
| View type | High oblique "three-quarter" bird's-eye view of a roofless floor | — | High |
| Projection | Object scale changes little from top to bottom (robot heads ≈22–30 px everywhere; ROBOT-001 near the top is not smaller than front-row robots). This suggests **perspective with a long focal length (narrow FOV)** or near-orthographic. Convergence of vertical edges was not measured conclusively (Q-3D-03) | Narrow-FOV perspective (est.) | Medium |
| Camera azimuth | The building's diagonal (far corner to near corner) runs roughly vertically on screen. Department signs are ±22–27° on the left/right sides and 0° for Executive Office. The plinth ellipse's major axis is horizontal | Camera looks along the building's diagonal, ≈45° to the walls (est.) | Medium |
| Camera elevation (pitch down) | Plinth ellipse H/W = 100/217 = 0.46. A flat circle gives elevation ≈ asin(0.46) ≈ **27°**. The floor slab edges (≈43° and ≈33° on screen) suggest a **steeper** view under a 45° azimuth assumption (≈41–68°). **The cues conflict** (common in generated imagery) | 27°–60° (est.); see §9.3 | Low |
| Horizontal symmetry axis | Plinth centre x ≈ 903; Research/QA mirror axis x ≈ 912; Executive Office sign centre x ≈ 876 | Scene axis x ≈ 876–912 (≈0.53 of width), **not** the image centre (836) | Medium |
| Horizon | Not visible (camera looks down; the top of the frame shows exterior trees) | Above the frame | High |
| Field of view | Not measurable from available cues | ND (narrow, est.) | Low |
| Relative scale | Robot standing height ≈60 px vs a desk length of ≈60–90 px: robots are roughly desk-length tall (stylised, oversized relative to furniture). Chairs are ≈20–25 px | — | Medium |

### 9.2 Properties that must stay consistent to reproduce the composition
1. **Framing anchors**: the WORA plinth centre at (903, 500), the central planter at ≈(802, 402), the Executive Office sign at ≈(876, 158) and the seven sign plates at their `02` positions (±5 px at 1672×941).
2. **Azimuth**: the building diagonal stays vertical on screen; the Executive Office sign faces the camera (0°); side signs keep ±22–27°.
3. **Elevation/pitch**: the plinth ellipse aspect stays ≈2.17 : 1 and room envelopes match `02 §4`.
4. **Scale constancy**: robot head sizes stay ≈22–30 px across the frame (no strong foreshortening).
5. **Occlusion relationships**: the same parts of rooms stay hidden behind the sidebar, Live Activity, status strip and command panel.
6. **Light direction**: key light from the right/upper-right; warm interior and cool exterior.

### 9.3 Recommended camera-solve procedure (for the 3D Environment Architect; no design change)
Because the cues conflict, do not hard-code a single assumed angle. Solve the camera **numerically against the reference**: model the layout, then adjust pitch, azimuth, focal length and position until the anchors above project within tolerance (overlay at 1672×941). Record the solved values back into this spec. If no consistent camera meets all anchors, report the residuals to the owner (Q-3D-04). Do not alter the layout to "fix" them.
