# 04 — UI Components Specification: WORA Main Workspace

> Reference: `reference/wora-main-workspace.png` (SHA-256 `6f91ff3d…718036a1`, verified). The image is the authority.
> Positions are original-image pixels (x, y, w, h); see `02` for normalised values. **Every visible string is reproduced verbatim. Do not rename, rewrite, shorten or translate any label.**
> Colours are pixel samples or estimates **(est.)**; font sizes are **estimates** derived from measured cap/x-heights (font size ≈ cap height ÷ 0.71). The font family is not identifiable with certainty (Q-UI-06). The visible type is a clean neo-grotesque sans close to *Roboto/Inter*.

---

## 0. Global UI characteristics

| Property | Observation |
|---|---|
| Theme | Dark navy UI on top of a bright 3D scene |
| Panel surfaces | Very dark navy (#091423 – #141C2C), opaque or nearly opaque; small panels may be slightly translucent (REG-08 picks up some scene colour) |
| Corner radii | Panels ≈12–14 px; cards ≈10 px; pills full-round; nav pill ≈10 px; inputs ≈10–12 px (est.) |
| Borders | 1 px subtle light-slate borders on cards and inputs (#3E4D63 – #4A5568 est.) |
| Shadows | Soft dark shadows separate the floating panels from the scene (est.; edges are dark with a faint fall-off) |
| Text colours | Primary white #FFFFFF; secondary grey ≈#B8BFC9 – #D2D6DD (est. from peaks); status colours green/amber/red |
| Icon style | Simple filled/duotone glyphs, ≈16–20 px, light grey (#A3A6B0 median, #DDE1E5 peak) in the sidebar; coloured in status contexts |
| Accent | Teal/cyan (#074A5F active fill, #019FBB send button, #16CBDD logo cyan) |

---

## 1. Brand header (REG-01) · 0, 0, 295, 67
| Property | Value |
|---|---|
| Surface | #091423 (darker than the sidebar), extending ≈60 px past the sidebar over the scene; right edge fades out between x≈292 and x≈310 |
| **UI-001 Logo mark** | 27, 23, 28, 26. Interlocking ribbon "W" built from two loops; gradient from bright cyan (#16CBDD) to deep blue (#035A86 at the dark folds) |
| **UI-002 Wordmark** `WORA` | 66, 28, 72, 17. White, bold/heavy geometric caps, cap height 17 → **≈24 px bold (est.)**; slight positive tracking |
| **UI-003 Badge** `Enterprise` | 163, 26, 75, 21. Pill (fully rounded), fill #4C5669, text white ≈13 px medium (est.), horizontal padding ≈9 px |
| **UI-004 Chevron** | 270, 31, 10, 10. Light grey small glyph (≈`›` plus an extra stroke). Purpose ND (likely sidebar collapse; do not assume, Q-UI-05) |
| Spacing | Logo → wordmark gap ≈11 px; wordmark → badge gap ≈25 px; all centred on y ≈ 36 |

## 2. Sidebar (REG-02) · 0, 67, 235, 874
| Property | Value |
|---|---|
| Surface | #121C2C (median; #101A2A at the edge), full height to the bottom |
| Right edge | 1 px lighter line at x = 233 (#131C2B) and a darker 1 px at x = 234 (#091525) |

### 2.1 Company selector (UI-010) · 19, 86, 197, 69
| Property | Value |
|---|---|
| Shape | Rounded rectangle, radius ≈10, fill #091321, 1 px border ≈#3E4D63 (peak #475B71) |
| Row 1 | **UI-011** cyan rounded-square avatar 30, 98, 20, 19 (cyan #16CBDD family, small dark glyph); **UI-012** `My Company` 61, 100, 84, 16, white, **≈16 px regular (est.)**; **UI-013** chevron `⌄` 192, 103, 8, 7, light grey |
| Row 2 | **UI-014** live icon 32, 124, 16, 17: dark-teal ring (#074D4D) with a bright cyan centre (#83FEFF peak); **UI-015** `Live` 61, 127, 29, 12, green #12DB76 (peak), **≈13 px semibold (est.)**. The "L" appears fused with a filled green dot (Q-UI-02) |
| Internal spacing | Left padding 11 px (icon at x 30); icon → text gap ≈11 px; row centres y ≈ 108 and ≈ 133 |
| State | Collapsed dropdown; status Live |

### 2.2 Navigation list (UI-020 … UI-030)
| Property | Value |
|---|---|
| Rows | 11 rows, pitch ≈43.9 px, row centres y ≈ 196, 240, 284, 328, 372, 416, 460, 503, 547, 591, 635 |
| Row box | x 13–216 (203 px wide), 40 px tall |
| Icon | x 27–47 (≈20 × 18 px), light grey #A3A6B0 (median) / #DDE1E5 (peak); white on the active row |
| Label | Starts at x = 61; white #FFFFFF; **≈16–17 px regular (est.)** (cap height ≈12) |
| **Active row** | **UI-016/UI-020** `Company Overview`: pill 13, 175, 203, 40; radius ≈10; fill **#074A5F** (median; #064C62 at the left); white icon and label |
| Inactive rows | No background; white labels; grey icons |

| ID | Exact label | Icon (as visible) | Label ink x-range | State |
|---|---|---|---|---|
| UI-020 | `Company Overview` | House | 61–190 | **Active** |
| UI-021 | `Executive Office` | Two people (one in front) | 61–167 | Inactive |
| UI-022 | `Departments` | Group of people | 61–147 | Inactive |
| UI-023 | `Agent Directory` | Single person/agent bust | 61–164 | Inactive |
| UI-024 | `Projects` | Folder/briefcase | 61–115 | Inactive |
| UI-025 | `Tasks & Workflows` | Clipboard with check | 61–184 | Inactive |
| UI-026 | `Knowledge Base` | Book/layers with emblem | 61–170 | Inactive |
| UI-027 | `Reports & Analytics` | Bar chart (3 bars) | 61–190 | Inactive |
| UI-028 | `Integrations` | Four connected nodes / puzzle cross | 61–139 | Inactive |
| UI-029 | `Billing & Usage` | Card/receipt with lines | 61–159 | Inactive |
| UI-030 | `Settings` | Gear/cog | 61–115 | Inactive |

### 2.3 Upgrade card (UI-031) · 19, 727, 197, 166
| Property | Value |
|---|---|
| Shape | Rounded rectangle, radius ≈12, fill #111B2B (≈ sidebar), 1 px border ≈#3E4D63 (peak #4F6279). **The top border is interrupted** between x≈92 and x≈143, where the crown sits |
| **UI-032 Crown** | 104, 731, 26, 22; gold #FFC84E (peak) / #C18430 (median) with a warm glow |
| **UI-033** `Upgrade to Pro` | 67, 772, 101, 15; white, **≈16 px bold (est.)**; centred on x≈117 |
| **UI-034 / UI-035** `Unlock more power` / `for your company` | 60, 798, 115, 13 and 66, 817, 103, 13; grey ≈#C3CAD3 (peak #CCD3DB), **≈14 px regular (est.)**; line pitch ≈19 px; centred |
| **UI-036 Button** `Upgrade Now` | 40, 843, 156, 36; radius ≈8; fill #1A2B43; label 75, 856, 85, 12, white **≈15 px bold (est.)**, centred |
| **UI-037** | Very faint teal mark at ≈(34–44, 740–752). Not decoded (Q-UI-04) |
| Alignment | All content horizontally centred on x ≈ 117 (card centre 117.5) |

## 3. Search bar (UI-040 / UI-041)
| Property | Value |
|---|---|
| Outer shell (UI-040) | 560, 10, 562, 47; dark #141C2A; radius ≈14 (est.) |
| Field (UI-041) | 572, 18, 543, 33; fill #141E2F; 1 px border ≈#4A5568 (peak #545F73); radius ≈12 (pill-like) |
| **UI-042 Icon** | Magnifier 583, 27, 15, 15; light grey/white |
| **UI-043 Placeholder** | `Search across your company…` at 610, 27, 190, 15; light grey ≈#C8CDD5 (peak #E1E5EA); **≈16 px regular (est.)** |
| **UI-044 Trailing glyph** | 1093, 31, 9, 8; very faint (≈`◇`/`<>`). ND (Q-UI-03) |
| State | Empty, unfocused |

## 4. Status strip (UI-050) · 550, 63, 590, 64
| Property | Value |
|---|---|
| Surface | #141C2C; radius ≈10–12; directly below the search shell |
| **UI-051** | Building pictogram 568, 83, 30, 27, light grey |
| **UI-052** `My Company` | 610, 80, 81, 16; white **≈15–16 px regular (est.)** |
| **UI-053** `Operational` | 610, 101, 57, 11; light grey/white **≈12–13 px (est.)**; followed by a green circular-arrow icon at x 668–676 |
| **UI-054** | Vertical divider at x≈725, y 82–112, faint slate |
| Metric layout | Each metric has an icon (≈13–15 px) left of a **bold white number (≈17–18 px bold, est.; cap height ≈12)**, and below it a coloured status dot (≈12 px) or nothing, followed by a grey label **≈12–13 px (est.)** |
| **UI-055** | People icon (cyan #32DDFF peak) 753–773 × 80–90 · `24` at x 777–797 · label `AI Employees` x 753–822 (light bluish-white) |
| **UI-056** | Green ring/clock icon (#1EDF92 peak) 862–875 · `08` x 883–903 · green dot (#05EB62) 862–874 × 101–112 · `Working` x 879–919 |
| **UI-057** | Amber ring icon (#FBB845 peak) 963–977 · `03` x 985–1005 · amber dot (#FEB837) 964–977 · `Waiting` x 982–1018 |
| **UI-058** | Red ring icon (#FE3D37 peak) 1063–1077 · `01` x 1085–1102 · red dot (#FD362D) 1064–1076 · `Blocked` x 1080–1119 |
| Spacing | Metric group pitch ≈100–110 px (icon x 753 → 862 → 963 → 1063) |

## 5. Top-right cluster (REG-05) · 1418, 12, 239, 51
| Property | Value |
|---|---|
| Surface | Dark navy #091322 – #151F31, radius ≈12 (est.) |
| **UI-060 Bell** | 1433, 25, 19, 19; white |
| **UI-061 Badge** | 1444, 15, 13, 14; red #F3272B circle, white `3` (≈10 px bold, est.); overlaps the bell's top-right |
| **UI-062 Divider** | x≈1469, y 22–50 |
| **UI-063 Avatar** | 1486, 21, 34, 33; circular photo (man, dark suit, white shirt, tie) with a light ring |
| **UI-064** `Momen Maaly` | 1530, 22, 83, 16; white **≈16 px regular/medium (est.)** |
| **UI-065** `CEO` | 1530, 40, 24, 10; grey #BDC4CF (peak) **≈12 px (est.)** |
| **UI-066 Chevron** | 1631, 33, 9, 5; white/light grey `⌄` |

## 6. Live Activity panel (REG-06) · 1420, 83, 236, 266
| Property | Value |
|---|---|
| Surface | #0A1422; radius ≈12; left padding 15 px (dot at x 1435) |
| **UI-070 Header** | Green dot (#11FA73 peak) 1435, 101, 10, 9 + `Live Activity` 1452, 98, 75, 14, white **≈16 px bold (est.)** |
| Row structure | Avatar (≈20 × 32) at x 1442 · name at x 1475 (white **≈13 px semibold, est.**) · detail at x 1475 (grey #D8DCE4 peak, **≈11–12 px, est.**) · time right-aligned ending x≈1640 (grey #D2D5DA peak, **≈11–12 px, est.**) on the detail baseline |
| Row pitch | ≈47–48 px |

| ID | Name | Detail | Time | Name y | Detail/time y | Avatar |
|---|---|---|---|---|---|---|
| UI-071 | `Marketing Agent` | `Finished creating ideas` | `2m ago` | 133 | 152 | Front-facing robot |
| UI-072 | `Dev Agent` | `Pushed new code` | `3m ago` | 183 | 200 | Front-facing robot |
| UI-073 | `Reviewer Agent` | `Approved the changes` | `4m ago` | 229 | 247 | Front-facing robot |
| UI-074 | `Video Producer` | `Started rendering video` | `5m ago` | 277 | 296 | Robot turned three-quarter right; peach/tan visor area |

| Property | Value |
|---|---|
| **UI-075 Separator** | y≈316, x 1435–1640, 1 px faint slate |
| **UI-076** `View All →` | 1583, 325, 57, 11; grey-white (#EAF1F7 peak) **≈12 px (est.)**; right-aligned to x≈1640; arrow `→` follows the text |

## 7. Executive Command panel (REG-07) · 481, 829, 852, 112
| Property | Value |
|---|---|
| Surface | #111A2A; top corners radius ≈14 (est.); the panel runs to the image's bottom edge |
| **UI-080 Avatar** | 499, 842, 43, 45: robot bust (white helmet, antenna nub, peach ear disc, black visor, blue eyes, blue collar) on a navy circle (#0E1C2F) |
| **UI-081 Voice badge** | 497, 889, 45, 26: dark teal rounded badge (#0B2C3C) with a 5-bar cyan waveform (#0DFFFF peak), bars x 511–531 |
| **UI-082** `Executive Command` | 555, 844, 135, 13; white **≈15 px bold (est.)** |
| **UI-083 Input** | 553, 867, 764, 49; fill #1C273C; 1 px border ≈#283143 – #3A4456; radius ≈10 |
| **UI-084 Placeholder** | `Tell your company what to do…` at 570, 883, 206, 16; grey ≈#AFB9C0 (peak); **≈17 px regular (est.)**; left padding 17 px |
| **UI-085 Send** | 1272, 874, 37, 37 circle; fill #019FBB; white paper-plane icon pointing right, centred ≈(1290, 892); 8 px from the input's right edge |
| State | Empty input, idle |

## 8. View switcher (REG-08) · 1369, 853, 288, 73
| Property | Value |
|---|---|
| Surface | Dark (#1D222F median, slightly translucent); radius ≈12 |
| Tabs | Three equal tabs (≈90–92 px wide, 54 px tall), icon above label, centred |
| **UI-090** `3D View` (**Active**) | 1373, 863, 90, 54; fill **#06556B – #075B70**, radius ≈10; white isometric-cube icon 1410, 870, 18, 19; label 1395–1442 × 899–910 white **≈13 px medium (est.)** |
| **UI-091** `Floor Plan` | Tab area ≈1468–1560; icon (2 × 2 rounded squares, light grey) 1503, 871, 18, 18; label 1488–1541 × 899–910 light grey/white |
| **UI-092** `Live View` | Tab area ≈1563–1655; icon `((•))` broadcast, light grey 1597, 871, 24, 16; label 1583–1636 × 899–910 |

## 9. Visible-state summary
| Component | Visible state in the reference |
|---|---|
| Sidebar nav | `Company Overview` active; all others inactive |
| Company selector | Collapsed; `Live` |
| Search | Empty placeholder |
| Notifications | Badge `3` |
| Status | `Operational`; `24` AI Employees; `08` Working; `03` Waiting; `01` Blocked |
| Live Activity | 4 entries, newest `2m ago` at the top |
| Executive Command | Empty placeholder; send button enabled-looking (solid teal) |
| View switcher | `3D View` active |

Interactive behaviour (hover, focus, pressed, open menus) is **not visible** in the reference and is not specified here (Q-INT-01).
