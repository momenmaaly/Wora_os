# 01 — Visual Inventory: WORA Main Workspace

| Field | Value |
|---|---|
| Mission | WORA-DESIGN-RE-002 |
| Reference | `docs/design/main-workspace/reference/wora-main-workspace.png` |
| Reference SHA-256 | `6f91ff3d27f1d69d7189b6d1a599088086bb50048d1c0b492e3ebcdb718036a1` (verified `OK` before analysis) |
| Reference size | 1672 × 941 px, PNG, 8-bit RGB |
| Coordinate system | Original image pixels; origin (0,0) at top-left; x to the right, y down |
| Status | Analysis only. No implementation |

> **Authority rule.** This inventory describes the reference. It does not replace it. If this document and the image ever disagree, **the image wins**. IDs below are shared with `02` to `07` and with `data/measurements.json`.

---

## 1. How this inventory was made

- The reference was decoded with Pillow, read-only. It was inspected in about 60 zoomed crops (2× to 8× magnification) with a pixel grid overlaid in original-image coordinates.
- Colours were sampled directly from pixel data (medians and peaks over small regions).
- Every robot, label and component was located on the grid. Positions were cross-checked by drawing the recorded boxes onto a **scratch copy** (never committed) and comparing it with the original.
- Text is transcribed **exactly as visible**. Where a glyph is ambiguous, it is flagged and listed in `07-uncertainties-and-open-questions.md`.

## 2. Top-level composition (summary)

The screen is a **full-bleed 3D isometric-style cutaway of an office building floor**, seen from high above at an angle. **Floating dark UI panels** sit on top of it:

| Region ID | Region | Where (px, x,y,w,h) |
|---|---|---|
| REG-01 | Brand header bar | 0, 0, 295, 67 |
| REG-02 | Left sidebar (navigation) | 0, 67, 235, 874 |
| REG-03 | 3D viewport (visible) | 235, 0, 1437, 941 (behind every overlay) |
| REG-04 | Top-centre cluster: search bar + company status strip | 550, 10, 590, 117 |
| REG-05 | Top-right cluster: notifications + user profile | 1418, 12, 239, 51 |
| REG-06 | Live Activity panel | 1420, 83, 236, 266 |
| REG-07 | Executive Command panel | 481, 829, 852, 112 |
| REG-08 | View switcher (3D View / Floor Plan / Live View) | 1369, 853, 288, 73 |

## 3. UI inventory: every visible string and control

Strings are reproduced verbatim. "…" in this document means the reference shows a trailing ellipsis. Whether it is one character (U+2026) or three dots cannot be determined (Q-UI-01).

### 3.1 Brand header (REG-01)
| ID | Item | Exact visible text / description |
|---|---|---|
| UI-001 | Logo mark | Interlocking "W"-like ribbon mark, cyan-to-blue gradient |
| UI-002 | Wordmark | `WORA` (bold, white, all caps) |
| UI-003 | Plan badge | `Enterprise` (grey pill) |
| UI-004 | Header chevron | Small light glyph resembling `›` with an extra stroke (shape uncertain, Q-UI-05) |

### 3.2 Sidebar (REG-02)
| ID | Item | Exact visible text / description | Visible state |
|---|---|---|---|
| UI-010 | Company selector card | Rounded card with a thin light border | — |
| UI-011 | Company avatar | Cyan rounded-square icon with a small glyph | — |
| UI-012 | Company name | `My Company` | — |
| UI-013 | Dropdown chevron | `⌄`-style chevron | Collapsed |
| UI-014 | Live indicator icon | Dark teal ring with a bright cyan/teal centre dot | — |
| UI-015 | Live label | `Live` in green. The "L" is drawn merged with a filled green dot (Q-UI-02) | Live |
| UI-016 / UI-020 | Nav item | House icon + `Company Overview` | **Active** (teal pill) |
| UI-021 | Nav item | Two-person icon + `Executive Office` | Inactive |
| UI-022 | Nav item | Group/people icon + `Departments` | Inactive |
| UI-023 | Nav item | Person/agent icon + `Agent Directory` | Inactive |
| UI-024 | Nav item | Folder icon + `Projects` | Inactive |
| UI-025 | Nav item | Checklist/clipboard-check icon + `Tasks & Workflows` | Inactive |
| UI-026 | Nav item | Book/stack icon + `Knowledge Base` | Inactive |
| UI-027 | Nav item | Bar-chart icon + `Reports & Analytics` | Inactive |
| UI-028 | Nav item | Connected-nodes icon + `Integrations` | Inactive |
| UI-029 | Nav item | Card/receipt icon + `Billing & Usage` | Inactive |
| UI-030 | Nav item | Gear icon + `Settings` | Inactive |
| UI-031 | Upgrade card | Rounded bordered card. The top border is interrupted behind the crown | — |
| UI-032 | Crown icon | Gold crown with a soft glow | — |
| UI-033 | Card title | `Upgrade to Pro` | — |
| UI-034 / UI-035 | Card body (two lines) | `Unlock more power` / `for your company` | — |
| UI-036 | Button | `Upgrade Now` | Default |
| UI-037 | Faint mark | Very faint teal mark near the card's top-left (Q-UI-04) | — |

### 3.3 Top-centre (REG-04)
| ID | Item | Exact visible text / description |
|---|---|---|
| UI-040 / UI-041 | Search bar (shell + field) | Dark rounded field inside a slightly larger dark shell |
| UI-042 | Search icon | Magnifier |
| UI-043 | Placeholder | `Search across your company…` |
| UI-044 | Trailing glyph | Very faint small glyph at the right end of the field (Q-UI-03) |
| UI-050 | Status strip | Dark rounded bar |
| UI-051 | Building icon | Light grey office-building pictogram |
| UI-052 | Company name | `My Company` |
| UI-053 | Company state | `Operational` followed by a small green circular-arrow icon |
| UI-054 | Divider | Thin vertical divider |
| UI-055 | Metric | People icon (cyan) + `24` / `AI Employees` |
| UI-056 | Metric | Green circular icon + `08` / green dot + `Working` |
| UI-057 | Metric | Amber circular icon + `03` / amber dot + `Waiting` |
| UI-058 | Metric | Red circular icon + `01` / red dot + `Blocked` |

### 3.4 Top-right (REG-05)
| ID | Item | Exact visible text / description |
|---|---|---|
| UI-060 | Notification bell | White bell outline/fill |
| UI-061 | Badge | Red circle with `3` |
| UI-062 | Divider | Thin vertical divider |
| UI-063 | Avatar | Circular photo of a man in a dark suit, white shirt and tie, with a light ring |
| UI-064 | Name | `Momen Maaly` |
| UI-065 | Role | `CEO` |
| UI-066 | Chevron | `⌄`-style dropdown chevron |

### 3.5 Live Activity (REG-06)
| ID | Agent name | Detail line | Time | Avatar |
|---|---|---|---|---|
| UI-070 | Header: green dot + `Live Activity` | — | — | — |
| UI-071 | `Marketing Agent` | `Finished creating ideas` | `2m ago` | Front-facing mini robot |
| UI-072 | `Dev Agent` | `Pushed new code` | `3m ago` | Front-facing mini robot |
| UI-073 | `Reviewer Agent` | `Approved the changes` | `4m ago` | Front-facing mini robot |
| UI-074 | `Video Producer` | `Started rendering video` | `5m ago` | Mini robot in **three-quarter view turned to the right**, with a peach/tan area on the visor (distinct from the other three) |
| UI-075 | Separator | Thin horizontal line | — | — |
| UI-076 | Link | `View All →` | — | — |

### 3.6 Executive Command (REG-07)
| ID | Item | Exact visible text / description |
|---|---|---|
| UI-080 | Avatar | Robot head and shoulders (white helmet, small antenna nub, peach/orange ear disc on its right side as seen, black visor with blue eyes, blue collar) on a dark navy circle |
| UI-081 | Voice badge | Dark teal rounded badge with a cyan 5-bar audio waveform |
| UI-082 | Title | `Executive Command` |
| UI-083 | Input | Large rounded input field |
| UI-084 | Placeholder | `Tell your company what to do…` |
| UI-085 | Send button | Teal circle with a white paper-plane/arrow icon |

### 3.7 View switcher (REG-08)
| ID | Item | Exact text | Icon | State |
|---|---|---|---|---|
| UI-090 | Tab | `3D View` | Isometric cube outline | **Active** (teal fill) |
| UI-091 | Tab | `Floor Plan` | 2 × 2 grid of rounded squares | Inactive |
| UI-092 | Tab | `Live View` | Broadcast symbol `((•))` | Inactive |

## 4. 3D environment inventory

### 4.1 Building and structure
| ID | Item | Description |
|---|---|---|
| — | Building floor | One open-plan floor of a building, shown as a roofless cutaway. The floor is oriented as a **diamond** relative to the screen: the far corner is at top-centre (behind the status strip), the near corner at bottom-centre (behind the Executive Command panel), and the left and right corners are off-screen or behind panels |
| ENV-001 | Central atrium plaza | Open marble floor in the middle with lounge seating, a planter tree and the WORA plinth |
| ENV-002 | WORA logo plinth | Low circular dais with a glowing white/silver rim |
| ENV-003 / ENV-004 | Plinth branding | Interlocking-W logo (cyan→blue) above the dark navy wordmark `WORA` |
| ENV-014 / ENV-015 | Exterior facade | Lower-left and lower-right: the outer facade of the building drops away below the floor slab, showing lower storeys (concrete slabs, dark glazing, warm-lit interiors) |
| ENV-016 | Upper exterior band | Top of the image: exterior glazing/edge of the floor, with outdoor trees beyond (mostly covered by the top UI) |
| ENV-017 | Outdoor terrace greenery | Trees and shrubs on the right, between the Live Activity panel and Management |
| — | Partitions | Glass walls with thin dark metal frames enclose each department. Glossy white/light-grey solid wall segments appear at corners and backs |
| — | Balustrades | Glass balustrades with metal top rails run along the walkway edges around the atrium |
| — | Light strips | Bright white linear highlights along the tops of the partitions and the floor edges (emissive strips or strong specular highlights; see Q-3D-07) |

### 4.2 Departments (exact labels)
| Dept ID | Exact sign text | Sign icon | Position in building | Robots (count) |
|---|---|---|---|---|
| DEPT-01 | `Executive Office` | Gold crown | Far corner (top-centre), facing the atrium | 1 |
| DEPT-02 | `Marketing` | Megaphone (cyan with a pink/magenta accent) | Upper-left side | 8 |
| DEPT-03 | `Engineering` | `</>` code brackets (cyan) | Upper-right side | 10 |
| DEPT-04 | `Creative Studio` | Painter's palette (white) | Left side, below Marketing | 5 |
| DEPT-05 | `Management` | Rising bar chart (cyan) | Right side, below Engineering | 5 |
| DEPT-06 | `Research` | Laboratory flask (cyan) | Lower-left, next to the near corner | 5 |
| DEPT-07 | `QA & Testing` | Shield with a check mark (cyan) | Lower-right, next to the near corner | 6 |

No other department labels are visible. Areas hidden behind UI panels or outside the frame are **not** established; see `07`.

### 4.3 Furniture and objects by zone
| Zone | Visible furniture and equipment |
|---|---|
| Executive Office | Dark walnut vertical-slat back wall; wooden executive desk with a dark laptop/keyboard, a small white robot-like figurine (U-01) and a small dark object; light-grey high-back chair shape behind the robot; floating wooden shelves with decorative objects on the right wall; wall shelf with plants and objects on the left; large potted plants left and right; light patterned rug; dark grey lounge armchairs/sofa front-left and front-right; glass walls with angled front corners |
| Marketing | Wooden bookshelf with books and decor; large standing display with a blue rising bar chart; dark wall screen with dashboard charts on the left wall; rows of light-wood desks with several monitors each; dark office chairs; large potted plants left and right |
| Engineering | Large dark wall display with code (blue/white text lines); white desks in rows with multiple monitors (code/blue screens); dark office chairs; potted plants at the back |
| Creative Studio | Large standing monitor showing colourful artwork; further monitors with colourful art; wooden bookshelf/cabinet; whiteboard/pin-board on the back-right wall; grey/white desks and cabinets; dark chairs; several plants |
| Management | Long wooden conference table with laptops, papers and devices; dark office chairs; large wall screen with charts; whiteboard with notes/diagrams on the left wall; potted plants at the back; wooden planter box with plants at the front; small white robot-like object among the back plants (U-02) |
| Research | Large display with a blue world map; wooden bookshelf with books; grey desks with monitors (charts); dark chairs; potted plants |
| QA & Testing | Banks of server racks with blue LEDs (left-back and right); large screen with a blue check-mark circle; long desks with many monitors; dark chairs; large potted plants |
| Atrium | Round concrete planter with grass and a tree (ENV-005); curved brown sofa (ENV-006); small white round planter (ENV-007); dark round rug with a dark ottoman (ENV-008); brown sofa (ENV-009); dark grey curved bench (ENV-010); trees in white planters (ENV-011); tree in a white cylindrical planter at bottom-centre (ENV-012); low grey cabinets/benches with brass handles (ENV-013) |

### 4.4 Robots (AI employees)
**47 distinct robots** are visible in the 3D scene, each with a unique ID. The full per-robot specification is in `03-3d-environment-spec.md §5`.

| Zone | Count |
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

In addition there are **3 uncertain robot-like objects** that are *not* counted: U-01 (desk figurine, Executive Office, ≈(827,235)), U-02 (white object among the back plants, Management, ≈(1400,447)) and U-03 (white/blue rounded object behind a monitor, Creative Studio, ≈(436,528)). See `07`.

There are also **5 robot avatars in the UI layer** (4 in Live Activity, 1 in Executive Command). These are 2D UI imagery, not 3D scene robots.

| Robot ID | Zone | Head centre (px) | Conf. |
|---|---|---|---|
| ROBOT-001 | Executive Office | (875, 210) | High |
| ROBOT-002 | Marketing | (431, 250) | High |
| ROBOT-003 | Marketing | (474, 281) | High |
| ROBOT-004 | Marketing | (518, 280) | High |
| ROBOT-005 | Marketing | (363, 285) | High |
| ROBOT-006 | Marketing | (320, 305) | High |
| ROBOT-007 | Marketing | (338, 325) | Medium |
| ROBOT-008 | Marketing | (395, 335) | High |
| ROBOT-009 | Marketing | (433, 313) | Medium |
| ROBOT-010 | Engineering | (1180, 235) | High |
| ROBOT-011 | Engineering | (1230, 232) | High |
| ROBOT-012 | Engineering | (1237, 248) | Medium |
| ROBOT-013 | Engineering | (1127, 267) | High |
| ROBOT-014 | Engineering | (1175, 280) | High |
| ROBOT-015 | Engineering | (1272, 286) | High |
| ROBOT-016 | Engineering | (1220, 313) | High |
| ROBOT-017 | Engineering | (1310, 320) | Medium |
| ROBOT-018 | Engineering | (1282, 338) | High |
| ROBOT-019 | Engineering | (1386, 305) | High |
| ROBOT-020 | Creative Studio | (455, 512) | High |
| ROBOT-021 | Creative Studio | (473, 543) | High |
| ROBOT-022 | Creative Studio | (313, 558) | Medium |
| ROBOT-023 | Creative Studio | (338, 558) | High |
| ROBOT-024 | Creative Studio | (378, 590) | High |
| ROBOT-025 | Management | (1364, 498) | High |
| ROBOT-026 | Management | (1398, 527) | High |
| ROBOT-027 | Management | (1480, 517) | High |
| ROBOT-028 | Management | (1450, 548) | High |
| ROBOT-029 | Management | (1532, 553) | High |
| ROBOT-030 | Research | (723, 642) | High |
| ROBOT-031 | Research | (757, 680) | High |
| ROBOT-032 | Research | (695, 672) | Medium |
| ROBOT-033 | Research | (597, 705) | Medium |
| ROBOT-034 | Research | (643, 733) | High |
| ROBOT-035 | QA & Testing | (1035, 640) | High |
| ROBOT-036 | QA & Testing | (1006, 667) | High |
| ROBOT-037 | QA & Testing | (1100, 670) | High |
| ROBOT-038 | QA & Testing | (1077, 700) | High |
| ROBOT-039 | QA & Testing | (1167, 700) | High |
| ROBOT-040 | QA & Testing | (1145, 732) | High |
| ROBOT-041 | Atrium / walkway (left) | (617, 347) | High |
| ROBOT-042 | Atrium lounge | (707, 410) | High |
| ROBOT-043 | Atrium lounge | (906, 360) | High |
| ROBOT-044 | Atrium / walkway (right) | (1065, 355) | High |
| ROBOT-045 | Atrium / walkway (right) | (1097, 370) | High |
| ROBOT-046 | Atrium (right of plinth) | (1073, 483) | High |
| ROBOT-047 | Walkway (lower-left of Management) | (1380, 632) | High |

## 5. Notable cross-element facts (record only, no interpretation)

- The status strip reads `24` `AI Employees`, while **47** robots are visible in the scene. This is recorded as-is (Q-DATA-01). Do not "fix" either side.
- Working/Waiting/Blocked read `08` / `03` / `01`. No robot in the scene is visibly marked with a status colour.
- The Live Activity agent names (`Marketing Agent`, `Dev Agent`, `Reviewer Agent`, `Video Producer`) are **not** visibly linked to specific 3D robots.
