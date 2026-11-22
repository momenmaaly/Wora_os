# 02 — Layout Measurements: WORA Main Workspace

> Reference: `reference/wora-main-workspace.png` · 1672 × 941 px · SHA-256 `6f91ff3d…718036a1` (verified).
> The image is the authority. All measurements were taken on the original pixel grid using zoomed crops (2× to 8×) and checked against pixel data.

## 1. Coordinate system and conventions

| Item | Convention |
|---|---|
| Origin | (0,0) = top-left pixel of the reference |
| Axes | x increases to the right; y increases downward |
| Units | Original-image pixels (1× logical pixels; the file has no DPI metadata) |
| Box | `X, Y` = top-left corner of the bounding box; `W, H` = size; `Centre` = (X + W/2, Y + H/2) |
| Normalised | `nX = X/1672`, `nY = Y/941`, `nW = W/1672`, `nH = H/941`, rounded to 4 decimals |
| Text boxes | Text boxes are ink bounds (cap top to baseline/descender), not line boxes |
| Tolerance | **High** = edge visible and measured to ±2 px. **Medium** = edge soft or partly occluded, ±5 px. **Low** = boundary ambiguous, ±15 px or more (range given in notes) |
| Machine-readable copy | `data/measurements.json` (same values; generated from one source table so docs and data cannot drift) |

**Aspect ratio:** 1672 / 941 = **1.7768**, close to 16:9 (1.7778). A 16:9 viewport at 1672 px width would be 940.5 px tall, so the reference is 16:9 within 0.5 px.

## 2. Region map

```
x:0     235 295        550        1140        1418     1672
y:0 ┌──────────┐        ┌─────search────┐          ┌─profile──┐
    │ REG-01   │        │  UI-040/041   │          │  REG-05  │
 67 ├──────┬───┘        ├─status strip──┤ 127      └──────────┘ 63
    │      │            │    UI-050     │          ┌──────────┐ 83
    │REG-02│            └───────────────┘          │ REG-06   │
    │side- │            REG-03 : 3D viewport       │ Live     │
    │bar   │            (full-bleed, behind all)   │ Activity │
    │      │                                       └──────────┘ 349
    │      │
    │      │         ┌──────── REG-07 Executive Command ──┐ 829 ┌─REG-08─┐ 853
    │      │         │                                    │     └────────┘ 926
941 └──────┘         └────────────────────────────────────┘ 941
           481                                          1333  1369    1657
```

#### Regions

| ID | Element | X | Y | W | H | Centre | nX | nY | nW | nH | Conf. | Notes |
|---|---|---:|---:|---:|---:|---|---:|---:|---:|---:|---|---|
| REG-01 | Brand header bar (top-left) | 0 | 0 | 295 | 67 | (147.5, 33.5) | 0.0000 | 0.0000 | 0.1764 | 0.0712 | Medium | Right edge is a soft fade between x≈292 and x≈310; overlaps the 3D viewport by ≈60 px |
| REG-02 | Left sidebar panel | 0 | 67 | 235 | 874 | (117.5, 504) | 0.0000 | 0.0712 | 0.1406 | 0.9288 | High | Solid panel down to the bottom edge; 1 px edge at x=233–234 |
| REG-03 | 3D viewport (visible area) | 235 | 0 | 1437 | 941 | (953.5, 470.5) | 0.1406 | 0.0000 | 0.8594 | 1.0000 | High | The 3D scene is full-bleed behind every floating overlay |
| REG-04 | Top-centre cluster (search + status strip) | 550 | 10 | 590 | 117 | (845, 68.5) | 0.3289 | 0.0106 | 0.3529 | 0.1243 | High | Union of UI-040 and UI-050 |
| REG-05 | Top-right cluster (notifications + profile) | 1418 | 12 | 239 | 51 | (1537.5, 37.5) | 0.8481 | 0.0128 | 0.1429 | 0.0542 | Medium |  |
| REG-06 | Live Activity panel | 1420 | 83 | 236 | 266 | (1538, 216) | 0.8493 | 0.0882 | 0.1411 | 0.2827 | High |  |
| REG-07 | Executive Command panel | 481 | 829 | 852 | 112 | (907, 885) | 0.2877 | 0.8810 | 0.5096 | 0.1190 | High | Runs to the bottom image edge; bottom corners are not visible |
| REG-08 | View switcher | 1369 | 853 | 288 | 73 | (1513, 889.5) | 0.8188 | 0.9065 | 0.1722 | 0.0776 | High |  |


### 2.1 Derived proportions and spacing (computed from the measured boxes)

| Metric | Value (px) | Normalised / ratio | Confidence |
|---|---:|---|---|
| Sidebar width | 235 | 0.1406 of width | High |
| Brand header height | 67 | 0.0712 of height | Medium |
| Brand header overhang beyond sidebar | ≈60 (to x≈295, fade to ≈310) | — | Medium |
| Sidebar inner horizontal padding (cards) | 19 left / 19 right (cards span x 19–216) | — | High |
| Active nav pill inset | 13 left / 19 right (x 13–216) | — | High |
| Nav row pitch (centre to centre) | ≈43.9 (11 rows from y≈196 to y≈635) | — | High |
| Nav row (pill) height | 40 | — | High |
| Nav icon column / label start | icon x 27–47 (≈20 px) / label x = 61 | — | High |
| Top cluster width | 590 (x 550–1140) | 0.3529 | High |
| Top cluster horizontal centre | x ≈ 845 (search field centre ≈ 843.5; strip centre 845) | 0.505 (image centre is x = 836) | High |
| Search field → status strip gap | 12 (field bottom 51 → strip top 63) | — | Medium |
| Right column width (Live Activity) | 236 | 0.1411 | High |
| Right outer margin (Live Activity / view switcher / profile shell) | 15–16 (right edges at x 1656–1657) | — | High |
| Profile shell → Live Activity gap | 20 (63 → 83) | — | Medium |
| Live Activity row pitch | ≈47–48 (name baselines y 133, 183, 229, 277) | — | High |
| Executive Command width | 852 | 0.5096 | High |
| Executive Command horizontal centre | x ≈ 907 | 0.5425 (≈ plinth centre x 903) | High |
| Executive Command top / bottom | 829 / runs to 941 (bottom corners not visible) | — | High / Medium |
| Command input field | 764 × 49 at (553, 867) | — | High |
| Command panel → view switcher gap | 36 (1333 → 1369) | — | High |
| View switcher bottom margin | 15 (926 → 941) | — | Medium |
| View switcher tab pitch | ≈95 (tab centres x ≈ 1418, 1514, 1609) | — | High |
| 3D viewport visible width | 1437 (x 235–1672) | 0.8594 | High |
| WORA plinth centre | (903, 500) | (0.5401, 0.5313) | High |

### 2.2 Layering (front to back)

1. Floating UI panels: REG-01, REG-02, REG-04, REG-05, REG-06, REG-07, REG-08 (no UI panel overlaps another UI panel).
2. 3D department signs (part of the 3D scene; they render above the room geometry).
3. 3D scene: rooms, robots, furniture, atrium, building, exterior.

UI panels occlude parts of the 3D scene: Marketing and Creative Studio are cut by the sidebar, Engineering by Live Activity, the far corner and Executive Office top by the status strip, and the near corner by the Executive Command panel.

## 3. UI component measurements

#### Brand header

| ID | Element | X | Y | W | H | Centre | nX | nY | nW | nH | Conf. | Notes |
|---|---|---:|---:|---:|---:|---|---:|---:|---:|---:|---|---|
| UI-001 | Logo mark (interlocking W, cyan→blue) | 27 | 23 | 28 | 26 | (41, 36) | 0.0161 | 0.0244 | 0.0167 | 0.0276 | High |  |
| UI-002 | Wordmark "WORA" | 66 | 28 | 72 | 17 | (102, 36.5) | 0.0395 | 0.0298 | 0.0431 | 0.0181 | High | Cap height ≈17 px |
| UI-003 | "Enterprise" badge (pill) | 163 | 26 | 75 | 21 | (200.5, 36.5) | 0.0975 | 0.0276 | 0.0449 | 0.0223 | High |  |
| UI-004 | Collapse/expand chevron glyph | 270 | 31 | 10 | 10 | (275, 36) | 0.1615 | 0.0329 | 0.0060 | 0.0106 | Low | Glyph shape is ambiguous (looks like "›" with an extra stroke) |

#### Sidebar

| ID | Element | X | Y | W | H | Centre | nX | nY | nW | nH | Conf. | Notes |
|---|---|---:|---:|---:|---:|---|---:|---:|---:|---:|---|---|
| UI-010 | Company selector card | 19 | 86 | 197 | 69 | (117.5, 120.5) | 0.0114 | 0.0914 | 0.1178 | 0.0733 | High | 1 px light border, radius ≈10 |
| UI-011 | Company avatar icon (cyan) | 30 | 98 | 20 | 19 | (40, 107.5) | 0.0179 | 0.1041 | 0.0120 | 0.0202 | High |  |
| UI-012 | Text "My Company" | 61 | 100 | 84 | 16 | (103, 108) | 0.0365 | 0.1063 | 0.0502 | 0.0170 | High |  |
| UI-013 | Selector dropdown chevron | 192 | 103 | 8 | 7 | (196, 106.5) | 0.1148 | 0.1095 | 0.0048 | 0.0074 | High |  |
| UI-014 | Live status icon (ring + dot) | 32 | 124 | 16 | 17 | (40, 132.5) | 0.0191 | 0.1318 | 0.0096 | 0.0181 | High |  |
| UI-015 | Text "Live" (green) | 61 | 127 | 29 | 12 | (75.5, 133) | 0.0365 | 0.1350 | 0.0173 | 0.0128 | Medium | The leading "L" merges with a green dot shape; see Q-UI-02 |
| UI-016 | Active nav pill (Company Overview) | 13 | 175 | 203 | 40 | (114.5, 195) | 0.0078 | 0.1860 | 0.1214 | 0.0425 | High | Teal fill, radius ≈10 |
| UI-020 | Nav item "Company Overview" (row) | 13 | 176 | 203 | 40 | (114.5, 196) | 0.0078 | 0.1870 | 0.1214 | 0.0425 | High | Icon x 27–47; label x 61–190; row centre y≈196 |
| UI-021 | Nav item "Executive Office" (row) | 13 | 220 | 203 | 40 | (114.5, 240) | 0.0078 | 0.2338 | 0.1214 | 0.0425 | High | Icon x 27–47; label x 61–167; row centre y≈240 |
| UI-022 | Nav item "Departments" (row) | 13 | 264 | 203 | 40 | (114.5, 284) | 0.0078 | 0.2806 | 0.1214 | 0.0425 | High | Icon x 27–47; label x 61–147; row centre y≈284 |
| UI-023 | Nav item "Agent Directory" (row) | 13 | 308 | 203 | 40 | (114.5, 328) | 0.0078 | 0.3273 | 0.1214 | 0.0425 | High | Icon x 27–47; label x 61–164; row centre y≈328 |
| UI-024 | Nav item "Projects" (row) | 13 | 352 | 203 | 40 | (114.5, 372) | 0.0078 | 0.3741 | 0.1214 | 0.0425 | High | Icon x 27–47; label x 61–115; row centre y≈372 |
| UI-025 | Nav item "Tasks & Workflows" (row) | 13 | 396 | 203 | 40 | (114.5, 416) | 0.0078 | 0.4208 | 0.1214 | 0.0425 | High | Icon x 27–47; label x 61–184; row centre y≈416 |
| UI-026 | Nav item "Knowledge Base" (row) | 13 | 439 | 203 | 40 | (114.5, 459) | 0.0078 | 0.4665 | 0.1214 | 0.0425 | High | Icon x 27–47; label x 61–170; row centre y≈459 |
| UI-027 | Nav item "Reports & Analytics" (row) | 13 | 483 | 203 | 40 | (114.5, 503) | 0.0078 | 0.5133 | 0.1214 | 0.0425 | High | Icon x 27–47; label x 61–190; row centre y≈503 |
| UI-028 | Nav item "Integrations" (row) | 13 | 527 | 203 | 40 | (114.5, 547) | 0.0078 | 0.5600 | 0.1214 | 0.0425 | High | Icon x 27–47; label x 61–139; row centre y≈547 |
| UI-029 | Nav item "Billing & Usage" (row) | 13 | 571 | 203 | 40 | (114.5, 591) | 0.0078 | 0.6068 | 0.1214 | 0.0425 | High | Icon x 27–47; label x 61–159; row centre y≈591 |
| UI-030 | Nav item "Settings" (row) | 13 | 615 | 203 | 40 | (114.5, 635) | 0.0078 | 0.6536 | 0.1214 | 0.0425 | High | Icon x 27–47; label x 61–115; row centre y≈635 |
| UI-031 | Upgrade card | 19 | 727 | 197 | 166 | (117.5, 810) | 0.0114 | 0.7726 | 0.1178 | 0.1764 | High | Top border broken around the crown between x≈92 and x≈143 |
| UI-032 | Crown icon (gold) | 104 | 731 | 26 | 22 | (117, 742) | 0.0622 | 0.7768 | 0.0156 | 0.0234 | High |  |
| UI-033 | Text "Upgrade to Pro" | 67 | 772 | 101 | 15 | (117.5, 779.5) | 0.0401 | 0.8204 | 0.0604 | 0.0159 | High |  |
| UI-034 | Text "Unlock more power" | 60 | 798 | 115 | 13 | (117.5, 804.5) | 0.0359 | 0.8480 | 0.0688 | 0.0138 | High |  |
| UI-035 | Text "for your company" | 66 | 817 | 103 | 13 | (117.5, 823.5) | 0.0395 | 0.8682 | 0.0616 | 0.0138 | High |  |
| UI-036 | "Upgrade Now" button | 40 | 843 | 156 | 36 | (118, 861) | 0.0239 | 0.8959 | 0.0933 | 0.0383 | High | Label x 75–160, y 856–868 |
| UI-037 | Faint mark inside upgrade card (top-left) | 34 | 740 | 10 | 12 | (39, 746) | 0.0203 | 0.7864 | 0.0060 | 0.0128 | Low | Barely visible; see Q-UI-04 |

#### Top-centre

| ID | Element | X | Y | W | H | Centre | nX | nY | nW | nH | Conf. | Notes |
|---|---|---:|---:|---:|---:|---|---:|---:|---:|---:|---|---|
| UI-040 | Search bar outer shell | 560 | 10 | 562 | 47 | (841, 33.5) | 0.3349 | 0.0106 | 0.3361 | 0.0499 | Medium |  |
| UI-041 | Search input field | 572 | 18 | 543 | 33 | (843.5, 34.5) | 0.3421 | 0.0191 | 0.3248 | 0.0351 | High | 1 px light border |
| UI-042 | Search icon | 583 | 27 | 15 | 15 | (590.5, 34.5) | 0.3487 | 0.0287 | 0.0090 | 0.0159 | High |  |
| UI-043 | Placeholder "Search across your company..." | 610 | 27 | 190 | 15 | (705, 34.5) | 0.3648 | 0.0287 | 0.1136 | 0.0159 | High |  |
| UI-044 | Trailing icon in search field | 1093 | 31 | 9 | 8 | (1097.5, 35) | 0.6537 | 0.0329 | 0.0054 | 0.0085 | Low | Very faint "◇"/"<>"-like glyph; see Q-UI-03 |
| UI-050 | Status strip | 550 | 63 | 590 | 64 | (845, 95) | 0.3289 | 0.0670 | 0.3529 | 0.0680 | High |  |
| UI-051 | Building icon | 568 | 83 | 30 | 27 | (583, 96.5) | 0.3397 | 0.0882 | 0.0179 | 0.0287 | High |  |
| UI-052 | Text "My Company" (status strip) | 610 | 80 | 81 | 16 | (650.5, 88) | 0.3648 | 0.0850 | 0.0484 | 0.0170 | High |  |
| UI-053 | Text "Operational" + green cycle icon | 610 | 101 | 66 | 11 | (643, 106.5) | 0.3648 | 0.1073 | 0.0395 | 0.0117 | High | Icon x 668–676 |
| UI-054 | Vertical divider | 725 | 82 | 1 | 30 | (725.5, 97) | 0.4336 | 0.0871 | 0.0006 | 0.0319 | Medium |  |
| UI-055 | Group "24" / "AI Employees" | 753 | 80 | 69 | 32 | (787.5, 96) | 0.4504 | 0.0850 | 0.0413 | 0.0340 | High | Icon 753–773 × 80–90; number x 777–797; label x 753–822 |
| UI-056 | Group "08" / "Working" | 862 | 80 | 57 | 32 | (890.5, 96) | 0.5156 | 0.0850 | 0.0341 | 0.0340 | High | Icon 862–875; number 883–903; dot 862–874 × 101–112; label 879–919 |
| UI-057 | Group "03" / "Waiting" | 963 | 80 | 55 | 32 | (990.5, 96) | 0.5760 | 0.0850 | 0.0329 | 0.0340 | High | Icon 963–977; number 985–1005; dot 964–977; label 982–1018 |
| UI-058 | Group "01" / "Blocked" | 1063 | 80 | 56 | 32 | (1091, 96) | 0.6358 | 0.0850 | 0.0335 | 0.0340 | High | Icon 1063–1077; number 1085–1102; dot 1064–1076; label 1080–1119 |

#### Top-right

| ID | Element | X | Y | W | H | Centre | nX | nY | nW | nH | Conf. | Notes |
|---|---|---:|---:|---:|---:|---|---:|---:|---:|---:|---|---|
| UI-060 | Notification bell | 1433 | 25 | 19 | 19 | (1442.5, 34.5) | 0.8571 | 0.0266 | 0.0114 | 0.0202 | High |  |
| UI-061 | Notification badge "3" | 1444 | 15 | 13 | 14 | (1450.5, 22) | 0.8636 | 0.0159 | 0.0078 | 0.0149 | High |  |
| UI-062 | Vertical divider | 1469 | 22 | 1 | 28 | (1469.5, 36) | 0.8786 | 0.0234 | 0.0006 | 0.0298 | Medium |  |
| UI-063 | User avatar (photo, circular) | 1486 | 21 | 34 | 33 | (1503, 37.5) | 0.8888 | 0.0223 | 0.0203 | 0.0351 | High |  |
| UI-064 | Text "Momen Maaly" | 1530 | 22 | 83 | 16 | (1571.5, 30) | 0.9151 | 0.0234 | 0.0496 | 0.0170 | High |  |
| UI-065 | Text "CEO" | 1530 | 40 | 24 | 10 | (1542, 45) | 0.9151 | 0.0425 | 0.0144 | 0.0106 | High |  |
| UI-066 | Profile dropdown chevron | 1631 | 33 | 9 | 5 | (1635.5, 35.5) | 0.9755 | 0.0351 | 0.0054 | 0.0053 | High |  |

#### Live Activity

| ID | Element | X | Y | W | H | Centre | nX | nY | nW | nH | Conf. | Notes |
|---|---|---:|---:|---:|---:|---|---:|---:|---:|---:|---|---|
| UI-070 | Header: green dot + "Live Activity" | 1435 | 98 | 92 | 14 | (1481, 105) | 0.8583 | 0.1041 | 0.0550 | 0.0149 | High | Dot 1435–1445 × 101–110 |
| UI-071 | Activity row 1: "Marketing Agent" | 1442 | 130 | 198 | 33 | (1541, 146.5) | 0.8624 | 0.1382 | 0.1184 | 0.0351 | High | Avatar 1442–1462 × 130–162; name x 1475–1559, y 133; detail "Finished creating ideas" x 1475–1573, y 152; time "2m ago" x 1609–1640, y 152 |
| UI-072 | Activity row 2: "Dev Agent" | 1442 | 180 | 198 | 33 | (1541, 196.5) | 0.8624 | 0.1913 | 0.1184 | 0.0351 | High | Avatar 1442–1462 × 180–212; name x 1475–1527, y 183; detail "Pushed new code" x 1475–1549, y 200; time "3m ago" x 1609–1640, y 200 |
| UI-073 | Activity row 3: "Reviewer Agent" | 1442 | 227 | 198 | 33 | (1541, 243.5) | 0.8624 | 0.2412 | 0.1184 | 0.0351 | High | Avatar 1442–1462 × 227–259; name x 1475–1553, y 229; detail "Approved the changes" x 1475–1568, y 247; time "4m ago" x 1609–1640, y 247 |
| UI-074 | Activity row 4: "Video Producer" | 1442 | 272 | 198 | 33 | (1541, 288.5) | 0.8624 | 0.2891 | 0.1184 | 0.0351 | High | Avatar 1442–1462 × 272–304; name x 1475–1552, y 277; detail "Started rendering video" x 1475–1574, y 296; time "5m ago" x 1609–1640, y 296 |
| UI-075 | Separator line | 1435 | 316 | 205 | 1 | (1537.5, 316.5) | 0.8583 | 0.3358 | 0.1226 | 0.0011 | Medium |  |
| UI-076 | Link "View All →" | 1583 | 325 | 57 | 11 | (1611.5, 330.5) | 0.9468 | 0.3454 | 0.0341 | 0.0117 | High |  |

#### Executive Command

| ID | Element | X | Y | W | H | Centre | nX | nY | nW | nH | Conf. | Notes |
|---|---|---:|---:|---:|---:|---|---:|---:|---:|---:|---|---|
| UI-080 | Robot avatar on circular backdrop | 499 | 842 | 43 | 45 | (520.5, 864.5) | 0.2984 | 0.8948 | 0.0257 | 0.0478 | High |  |
| UI-081 | Voice badge with waveform | 497 | 889 | 45 | 26 | (519.5, 902) | 0.2972 | 0.9447 | 0.0269 | 0.0276 | High | Waveform bars x 511–531 × 896–912 |
| UI-082 | Title "Executive Command" | 555 | 844 | 135 | 13 | (622.5, 850.5) | 0.3319 | 0.8969 | 0.0807 | 0.0138 | High |  |
| UI-083 | Command input field | 553 | 867 | 764 | 49 | (935, 891.5) | 0.3307 | 0.9214 | 0.4569 | 0.0521 | High | 1 px light border |
| UI-084 | Placeholder "Tell your company what to do..." | 570 | 883 | 206 | 16 | (673, 891) | 0.3409 | 0.9384 | 0.1232 | 0.0170 | High |  |
| UI-085 | Send button (circular, teal) | 1272 | 874 | 37 | 37 | (1290.5, 892.5) | 0.7608 | 0.9288 | 0.0221 | 0.0393 | High |  |

#### View switcher

| ID | Element | X | Y | W | H | Centre | nX | nY | nW | nH | Conf. | Notes |
|---|---|---:|---:|---:|---:|---|---:|---:|---:|---:|---|---|
| UI-090 | Tab "3D View" (active) | 1373 | 863 | 90 | 54 | (1418, 890) | 0.8212 | 0.9171 | 0.0538 | 0.0574 | High | Icon 1410–1428 × 870–889; label 1395–1442 × 899–910 |
| UI-091 | Tab "Floor Plan" | 1468 | 863 | 92 | 54 | (1514, 890) | 0.8780 | 0.9171 | 0.0550 | 0.0574 | Medium | No fill; icon 1503–1521 × 871–889; label 1488–1541 × 899–910 |
| UI-092 | Tab "Live View" | 1563 | 863 | 92 | 54 | (1609, 890) | 0.9348 | 0.9171 | 0.0550 | 0.0574 | Medium | No fill; icon 1597–1621 × 871–887; label 1583–1636 × 899–910 |


## 4. 3D environment and department measurements (screen-space)

All 3D values are **projected screen-space** boxes in the reference at its exact camera framing. Room boxes are axis-aligned envelopes of non-rectangular projected shapes. Their confidence is lower because the walls are glass and the edges are partly occluded.

#### 3D environment

| ID | Element | X | Y | W | H | Centre | nX | nY | nW | nH | Conf. | Notes |
|---|---|---:|---:|---:|---:|---|---:|---:|---:|---:|---|---|
| ENV-001 | Central atrium plaza (open floor) | 560 | 300 | 700 | 300 | (910, 450) | 0.3349 | 0.3188 | 0.4187 | 0.3188 | Low | Boundaries blend into the walkway ring |
| ENV-002 | WORA logo plinth (circular dais, glowing rim) | 795 | 450 | 217 | 100 | (903.5, 500) | 0.4755 | 0.4782 | 0.1298 | 0.1063 | High | Ellipse; centre ≈(903,500) |
| ENV-003 | Plinth logo mark (interlocking W) | 867 | 467 | 68 | 31 | (901, 482.5) | 0.5185 | 0.4963 | 0.0407 | 0.0329 | High |  |
| ENV-004 | Plinth wordmark "WORA" (dark navy) | 842 | 502 | 120 | 19 | (902, 511.5) | 0.5036 | 0.5335 | 0.0718 | 0.0202 | High |  |
| ENV-005 | Central round planter + tree | 750 | 285 | 105 | 147 | (802.5, 358.5) | 0.4486 | 0.3029 | 0.0628 | 0.1562 | High | Planter 750–855 × 372–432; canopy 755–845 × 285–378 |
| ENV-006 | Curved brown sofa (left lounge) | 635 | 375 | 105 | 55 | (687.5, 402.5) | 0.3798 | 0.3985 | 0.0628 | 0.0584 | High |  |
| ENV-007 | Small white round planter | 630 | 420 | 25 | 30 | (642.5, 435) | 0.3768 | 0.4463 | 0.0150 | 0.0319 | Medium |  |
| ENV-008 | Dark round rug + dark ottoman | 660 | 435 | 110 | 40 | (715, 455) | 0.3947 | 0.4623 | 0.0658 | 0.0425 | High |  |
| ENV-009 | Brown sofa (right of planter) | 867 | 370 | 73 | 38 | (903.5, 389) | 0.5185 | 0.3932 | 0.0437 | 0.0404 | High |  |
| ENV-010 | Dark grey curved bench | 930 | 397 | 90 | 50 | (975, 422) | 0.5562 | 0.4219 | 0.0538 | 0.0531 | High |  |
| ENV-011 | Tree planter group (white rectangular planters) | 1180 | 405 | 80 | 105 | (1220, 457.5) | 0.7057 | 0.4304 | 0.0478 | 0.1116 | Medium |  |
| ENV-012 | Tree in white cylindrical planter (bottom centre) | 870 | 715 | 80 | 110 | (910, 770) | 0.5203 | 0.7598 | 0.0478 | 0.1169 | High |  |
| ENV-013 | Low grey cabinets/benches with brass handles | 940 | 740 | 140 | 80 | (1010, 780) | 0.5622 | 0.7864 | 0.0837 | 0.0850 | Low |  |
| ENV-014 | Lower-left exterior facade (floors below) | 236 | 597 | 250 | 344 | (361, 769) | 0.1411 | 0.6344 | 0.1495 | 0.3656 | Medium | Triangular region below the slab edge from (237,597) to (480,826) |
| ENV-015 | Lower-right exterior facade (floors below) | 1333 | 597 | 339 | 344 | (1502.5, 769) | 0.7972 | 0.6344 | 0.2028 | 0.3656 | Medium | Triangular region below the slab edge from (1333,821) to (1672,597) |
| ENV-016 | Exterior glazing + outdoor trees (top band) | 236 | 0 | 1436 | 170 | (954, 85) | 0.1411 | 0.0000 | 0.8589 | 0.1807 | Medium | Mostly covered by the top overlays |
| ENV-017 | Outdoor terrace greenery (right) | 1470 | 330 | 202 | 100 | (1571, 380) | 0.8792 | 0.3507 | 0.1208 | 0.1063 | Medium |  |

#### Departments

| ID | Element | X | Y | W | H | Centre | nX | nY | nW | nH | Conf. | Notes |
|---|---|---:|---:|---:|---:|---|---:|---:|---:|---:|---|---|
| DEPT-01 | Executive Office (room) | 660 | 120 | 410 | 210 | (865, 225) | 0.3947 | 0.1275 | 0.2452 | 0.2232 | Medium |  |
| DEPT-02 | Marketing (room) | 236 | 150 | 420 | 270 | (446, 285) | 0.1411 | 0.1594 | 0.2512 | 0.2869 | Low | Left part hidden behind the sidebar |
| DEPT-03 | Engineering (room) | 1060 | 150 | 380 | 280 | (1250, 290) | 0.6340 | 0.1594 | 0.2273 | 0.2976 | Low | Right part hidden behind the Live Activity panel |
| DEPT-04 | Creative Studio (room) | 236 | 420 | 400 | 290 | (436, 565) | 0.1411 | 0.4463 | 0.2392 | 0.3082 | Low | Left part hidden behind the sidebar |
| DEPT-05 | Management (room) | 1250 | 380 | 422 | 300 | (1461, 530) | 0.7476 | 0.4038 | 0.2524 | 0.3188 | Low | Right part runs off the image edge |
| DEPT-06 | Research (room) | 490 | 545 | 370 | 265 | (675, 677.5) | 0.2931 | 0.5792 | 0.2213 | 0.2816 | Medium |  |
| DEPT-07 | QA & Testing (room) | 960 | 545 | 380 | 265 | (1150, 677.5) | 0.5742 | 0.5792 | 0.2273 | 0.2816 | Medium |  |
| SIGN-01 | Sign "Executive Office" + crown | 792 | 141 | 168 | 35 | (876, 158.5) | 0.4737 | 0.1498 | 0.1005 | 0.0372 | High | Faces the camera (≈0°); crown 805–832 × 150–166 |
| SIGN-02 | Sign "Marketing" + megaphone | 291 | 167 | 135 | 78 | (358.5, 206) | 0.1740 | 0.1775 | 0.0807 | 0.0829 | High | Rotated ≈ −24° (text rises to the right) |
| SIGN-03 | Sign "Engineering" + </> | 1247 | 169 | 173 | 81 | (1333.5, 209.5) | 0.7458 | 0.1796 | 0.1035 | 0.0861 | High | Rotated ≈ +26° (text falls to the right) |
| SIGN-04 | Sign "Creative Studio" + palette | 248 | 442 | 165 | 80 | (330.5, 482) | 0.1483 | 0.4697 | 0.0987 | 0.0850 | High | Rotated ≈ −24° |
| SIGN-05 | Sign "Management" + bar chart | 1430 | 400 | 150 | 85 | (1505, 442.5) | 0.8553 | 0.4251 | 0.0897 | 0.0903 | High | Rotated ≈ +22° |
| SIGN-06 | Sign "Research" + flask | 525 | 560 | 120 | 82 | (585, 601) | 0.3140 | 0.5951 | 0.0718 | 0.0871 | High | Rotated ≈ −27° |
| SIGN-07 | Sign "QA & Testing" + shield-check | 1095 | 560 | 137 | 80 | (1163.5, 600) | 0.6549 | 0.5951 | 0.0819 | 0.0850 | High | Rotated ≈ +26° |


### 4.1 Department positions relative to the plinth centre (903, 500)

| Dept | Approx. room centre (px) | Δx | Δy | Direction from plinth (screen) |
|---|---|---:|---:|---|
| DEPT-01 Executive Office | (865, 225) | −38 | −275 | Up (far corner) |
| DEPT-02 Marketing | (446, 285) | −457 | −215 | Upper-left |
| DEPT-03 Engineering | (1250, 290) | +347 | −210 | Upper-right |
| DEPT-04 Creative Studio | (436, 565) | −467 | +65 | Left |
| DEPT-05 Management | (1461, 530) | +558 | +30 | Right |
| DEPT-06 Research | (675, 678) | −228 | +178 | Lower-left |
| DEPT-07 QA & Testing | (1150, 678) | +247 | +178 | Lower-right |

The visible rooms form a ring of seven around the central atrium. Research and QA & Testing are close to mirror images about x ≈ 903–912. Marketing/Engineering and Creative Studio/Management are only roughly mirrored, because the sidebar and Live Activity panel cut them unevenly.

## 5. Robot positions

Head-centre coordinates are the most reliable robot anchor (±4 px for High confidence). The boxes for seated robots are a **standardised approximation** (30 × 45 px envelope from the head centre), because desks and monitors hide their lower bodies. The boxes for free-roaming robots were measured individually.

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

## 6. Measurement uncertainty summary

| Area | Typical error | Reason |
|---|---|---|
| UI panel edges | ±1–2 px | Crisp edges on a dark background |
| UI text ink bounds | ±1–2 px | Anti-aliasing |
| UI soft-edge items (REG-01 fade, UI-040 shell, REG-05 shell) | ±5 px | Gradient/translucent edges |
| Department signs | ±3 px | Crisp plates, but rotated |
| Room envelopes (DEPT-xx) | ±15–30 px | Glass walls, occlusion by UI, perspective |
| Robot head centres | ±4 px (High) / ±8 px (Medium) | Small objects, partial occlusion |
| Seated robot boxes | ±10 px | Standardised envelope (see §5) |
