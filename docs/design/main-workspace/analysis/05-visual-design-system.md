# 05 — Visual Design System (extracted): WORA Main Workspace

> Reference: `reference/wora-main-workspace.png` (SHA-256 `6f91ff3d…718036a1`, verified). The image is the authority.
> **Every value here is extracted from the reference.** Sources: **S** = sampled from pixels (median or peak over a small region; shown exactly as sampled); **E** = visual estimate. Sampled colours are rendered appearance, already affected by anti-aliasing, translucency and scene light. They are **not** confirmed source design tokens (none exist; Q-DS-01).
> Token names below are descriptive labels for implementers. They **do not** add or rename anything visible.

---

## 1. Colour palette

### 1.1 UI surfaces
| Token (descriptive) | HEX | Source | Used by |
|---|---|---|---|
| `surface.header` | #091423 | S median | REG-01 brand header |
| `surface.sidebar` | #121C2C | S median (#101A2A near the edge) | REG-02 |
| `surface.card-inset` | #091321 | S median | UI-010 company card interior |
| `surface.panel-deep` | #0A1422 | S median | REG-06 Live Activity; REG-05 shell (#091322 – #151F31) |
| `surface.panel` | #141C2C | S median | UI-050 status strip; UI-040 search shell (#141C2A) |
| `surface.command` | #111A2A | S median | REG-07 |
| `surface.input` | #1C273C | S median | UI-083 command input; UI-041 search field (#141E2F) |
| `surface.button-secondary` | #1A2B43 | S median | UI-036 Upgrade Now |
| `surface.switcher` | #1D222F | S median (translucent) | REG-08 container; inactive tab area #252831 |
| `surface.badge-neutral` | #4C5669 | S median | UI-003 Enterprise pill |
| `surface.avatar-circle` | #0E1C2F | S median | UI-080 backdrop |
| `surface.voice-badge` | #0B2C3C | S median | UI-081 |

### 1.2 Accent and state
| Token | HEX | Source | Used by |
|---|---|---|---|
| `accent.active-fill` | #074A5F | S median (#084C61 over the pill) | UI-016 active nav pill |
| `accent.active-tab` | #06556B | S median (#075B70 over the tab) | UI-090 3D View |
| `accent.primary-button` | #019FBB | S median | UI-085 send |
| `accent.brand-cyan` | #16CBDD | S peak | UI-001 logo highlight, cyan icons |
| `accent.brand-blue-deep` | #035A86 | S median (dark folds) | UI-001 logo shadow side |
| `accent.cyan-icon` | #32DDFF | S peak (#1B9DCC median) | UI-055 people icon |
| `accent.wave` | #0DFFFF | S peak | UI-081 waveform |
| `accent.gold` | #FFC84E | S peak (#C18430 median) | UI-032 crown; SIGN-01 crown #FACF5A peak |
| `status.live` | #11FA73 | S peak (#08DB63 median) | UI-070 dot |
| `status.live-text` | #12DB76 | S peak | UI-015 `Live` |
| `status.working` | #05EB62 | S peak (#04D04D median) | UI-056 dot; icon #1EDF92 peak |
| `status.waiting` | #FEB837 | S peak (#EC9D2A median) | UI-057 dot; icon #FBB845 peak |
| `status.blocked` | #FD362D | S peak (#F12B2A median) | UI-058 dot; icon #FE3D37 peak |
| `status.badge` | #F3272B | S median | UI-061 notification badge |

### 1.3 Text
| Token | HEX | Source | Used by |
|---|---|---|---|
| `text.primary` | #FFFFFF | S peak | Nav labels, titles, names, numbers |
| `text.secondary` | ≈#C8CED6 | E (peaks #CCD3DB, #D8DCE4, #D2D5DA) | Upgrade body, Live Activity details and times |
| `text.tertiary` | ≈#B4BCC6 | E (peak #BDC4CF) | `CEO` |
| `text.placeholder` | ≈#AFB9C0 (command) / ≈#C8CDD5 (search) | S peak / E | UI-084 / UI-043 |
| `icon.muted` | #A3A6B0 | S median (peak #DDE1E5) | Sidebar icons |
| `text.ai-employees` | light bluish-white ≈#E0ECF5 | E (peak #F0F7FA) | `AI Employees` label |

### 1.4 Borders and separators
| Token | HEX | Source | Used by |
|---|---|---|---|
| `border.card` | ≈#3E4D63 | E (line peaks #475B71 / #4F6279) | UI-010, UI-031 |
| `border.input-search` | ≈#4A5568 | E (peak #545F73) | UI-041 |
| `border.input-command` | ≈#2E3848 | E (peak #283143) | UI-083 |
| `border.sidebar-edge` | #131C2B + #091525 | S | 1 px light + 1 px dark at x 233–234 |
| `divider` | faint slate ≈#2A3446 | E | UI-054, UI-062, UI-075 |

### 1.5 3D scene palette (rendered appearance)
| Token | HEX | Source | Used by |
|---|---|---|---|
| `scene.floor-marble` | #ACA0AB – #D2B9B0 | S | Atrium floor |
| `scene.floor-wood` | #805E4C | S | Management floor |
| `scene.floor-qa` | #655B61 | S | QA & Testing floor |
| `scene.walnut` | #897047 | S | Executive Office back wall |
| `scene.table-wood-highlight` | #E4A77D | S | Management table (lit) |
| `scene.leather` | #966B61 | S | Atrium sofa |
| `scene.rug-dark` | #4E4F63 | S | Atrium round rug |
| `scene.bench` | #665D68 | S | Curved bench |
| `scene.frame` | #2A2E33 – #433D3E | S/E | Glass mullions |
| `scene.sign-plate` | #0B1A32 – #1C1C25 | S | Department sign plates |
| `scene.screen-blue` | #134AB0 – #1A55C0 | S | Large displays |
| `scene.plinth-rim` | #E5E2E6 (peak) | S | Plinth glow rim |
| `scene.plinth-logo` | cyan #29C5DA → blue #1E7FB0 | E | ENV-003 |
| `scene.plinth-word` | ≈#12233A | E | ENV-004 |
| `scene.robot-white` | ≈#F2F4FA | E | Robot shells |
| `scene.robot-visor` | ≈#05080F | E | Visors |
| `scene.robot-eye` | ≈#19C6FF – #3FD8FF | E | Eyes |
| `scene.facade` | #38373C – #3B4259 | S | Exterior facade |

## 2. Typography

| Role | Example (verbatim) | Size (E) | Weight (E) | Colour | Case / tracking |
|---|---|---|---|---|---|
| Brand wordmark | `WORA` | ≈24 px (cap 17) | Heavy/Bold | White | Caps, slight + tracking |
| Badge | `Enterprise` | ≈13 px | Medium | White | Sentence |
| Nav label | `Company Overview` | ≈16–17 px | Regular | White | Title Case |
| Card title | `Upgrade to Pro` | ≈16 px | Bold | White | Title-ish |
| Card body | `Unlock more power` | ≈14 px | Regular | Secondary grey | Sentence |
| Button | `Upgrade Now` | ≈15 px | Bold | White | Title |
| Search placeholder | `Search across your company…` | ≈16 px | Regular | Placeholder | Sentence |
| Status primary | `My Company` | ≈15–16 px | Regular | White | Title |
| Status number | `24`, `08`, `03`, `01` | ≈17–18 px | Bold | White | Tabular-looking (est.) |
| Status label | `Working` | ≈12–13 px | Regular | Grey | Sentence |
| Profile name | `Momen Maaly` | ≈16 px | Regular/Medium | White | — |
| Profile role | `CEO` | ≈12 px | Regular | Tertiary | Caps |
| Panel title | `Live Activity`, `Executive Command` | ≈15–16 px | Bold | White | Title |
| Activity name | `Marketing Agent` | ≈13 px | Semibold | White | Title |
| Activity detail / time | `Finished creating ideas` / `2m ago` | ≈11–12 px | Regular | Secondary | Sentence |
| Command placeholder | `Tell your company what to do…` | ≈17 px | Regular | Placeholder | Sentence |
| Tab label | `3D View` | ≈13 px | Medium | White / light grey | Title |
| 3D sign text | `Executive Office` | ≈19–20 px on screen (cap ≈14) | Bold | White | Title |

**Family:** clean neo-grotesque sans; the closest visual matches are Roboto or Inter (not confirmed, Q-UI-06). Use one family throughout, as the reference does.

## 3. Shape, radius, border

| Element class | Radius (E) | Border |
|---|---|---|
| Large floating panels (Live Activity, Executive Command, search shell, profile shell) | 12–14 px | None visible; dark edge |
| Cards (company selector, upgrade) | 10–12 px | 1 px `border.card` |
| Nav active pill | ≈10 px | None |
| Inputs | 10–12 px | 1 px |
| Buttons (Upgrade Now) | ≈8 px | None |
| Active tab (3D View) | ≈10 px | None |
| Badges (Enterprise) | Full pill | None |
| Circular items | 50 % | Avatar: light ring |
| 3D sign plates | ≈10–12 px on screen | None; subtle bevel/edge highlight |

## 4. Depth, shadow, transparency, blur

| Property | Observation |
|---|---|
| Panel elevation | Panels float above the scene with dark, soft drop-shadow edges (E) |
| Transparency | Most panels look opaque. REG-08 and the inactive tab area are slightly translucent (scene colour bleeds into the median). REG-01's right edge is a soft gradient fade |
| Backdrop blur | Not determinable. No clear evidence of frosted-glass blur on any panel (Q-DS-02) |
| Glow | Crown (UI-032), status dots and the send button have a slight glow/bloom (E) |

## 5. Spacing system (measured)

| Measurement | Value (px) |
|---|---|
| Outer screen margin: right | 15–16 |
| Outer screen margin: bottom (view switcher) | 15 |
| Sidebar card inset | 19 |
| Nav pill inset | 13 (left) |
| Nav row height / pitch | 40 / ≈44 |
| Icon → label gap (sidebar) | 14 (icon right 47 → label 61) |
| Live Activity row pitch | ≈47–48 |
| Panel inner padding | ≈15–17 (Live Activity 15; command input text 17) |
| Gap search → status strip | ≈12 |
| Gap command → view switcher | 36 |
| Status metric pitch | ≈100–110 |

The measurements cluster around multiples of ≈4 px (12, 16, 20, 40, 44, 48). That is consistent with a 4 px grid, but this is an **inference**, not a source fact.

## 6. Iconography

| Property | Observation |
|---|---|
| Style | Simple solid/duotone glyphs with rounded geometry; ≈18–20 px in nav, ≈13–15 px in status |
| Colour | Muted grey in inactive nav; white when active; semantic colours in status; cyan for brand/AI icons; gold for premium (crown) |
| 3D sign icons | Megaphone (cyan + pink accent), `</>` (cyan), crown (gold), palette (white), bar chart (cyan), flask (cyan), shield-check (cyan) |
| Library | Not identifiable (Q-UI-07). Match glyph shapes to the reference |

## 7. Lighting and material appearance (3D, summary)

Warm interior light with a cool exterior. Key light from the right/upper-right (E). Glossy white robots with black visors and emissive cyan eyes. Polished reflective marble floor. Clear glass with dark frames. Walnut, oak and warm-wood furniture. Emissive blue screens. Bloom on bright emitters. Full detail in `03 §7–§8`.
