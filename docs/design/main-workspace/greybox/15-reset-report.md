# 15 · Design-Fidelity Reset — Implementation Report (2026-11-21)

**Status: implementation + comparison loop executed; NOT visually accepted.** This report documents
the reset work per the owner's CRITICAL DESIGN FIDELITY RESET directive. Per §6 the final review
package (independent reviewer pass) is pending — this is the implementer's report only.

## 1. What was reconstructed

### 1.1 Dashboard UI shell (the largest audit finding)
The reference is the complete WORA dashboard with the 3D scene floating behind it; the app previously
rendered only the scene. Rebuilt as real DOM components (`apps/workspace/src/ui/UiShell.tsx`,
`src/ui/uiSpec.ts` — **no images**, `data-testid="ui-shell"`, skipped on the `#/dev` route):

- **REG-01** brand header (logo mark, WORA wordmark, Enterprise pill, chevron) at 0,0,295,67
- **REG-02** sidebar: company selector (My Company / Live), 11 nav rows verbatim
  (Company Overview…Settings) with active pill #074A5F on Company Overview, upgrade card
  (crown, Upgrade to Pro / Unlock more power / for your company / Upgrade Now)
- **UI-040** search (real `<input>`, placeholder `Search across your company…`)
- **UI-050** status strip: My Company / Operational + **24 AI Employees / 08 Working / 03 Waiting /
  01 Blocked** (immutable counts, verbatim labels, per-metric colours)
- **REG-05** profile cluster (bell + red `3` badge, avatar disc — photo not reproducible, documented;
  `Momen Maaly` / `CEO`)
- **REG-06** Live Activity: 4 verbatim rows + `View All →`
- **REG-07** Executive Command (robot avatar, waveform badge, real input
  `Tell your company what to do…`, cyan send button)
- **REG-08** view switcher (`3D View` active / `Floor Plan` / `Live View`)
- Scale rule: uniform `s = innerHeight / 941` against the 1672×941 reference frame, edge-anchored
  rails, centre panels translated at 50 %.

### 1.2 Scene corrections (per-element loop, renders v1→v21)
| Finding (vs reference region) | Correction |
| --- | --- |
| Backdrop band dark/empty (upper frame) | Skyline texture on the measured city cards; tops y=65 EST. (planes unchanged, Q-ARCH-06); tower fabric full-height; tone pinned to the sampled band RGB(118,117,122) |
| Terrace read as dark hole | Terrace **decks** added (EST. extents between building edges CR-01/02 and parapet planes) + parapet constant top y=1.05 (plane-artifact documented in the data); deck material shadow-receive-exempt (ref terrace evenly sunlit) |
| Seated robots hidden behind monitors | **Anchor correction**: the M003 assumed seated head-top 0.95 m contradicted the reference (heads clearly above monitor tops); re-solved all 47 floors from the same head-px rays at **1.41 m seated / 1.45 m standing-walking**; 40 chairs reassigned to the same points; 6 robots clamped into room footprints (documented; head round-trip ≤18 px, others ≤0.5 px-class) |
| Robots not chibi; visors read as dots; eyes merged | Pronounced chibi proportions (head ≈ 0.56–0.6 m), protruding wraparound visor, separated emissive eyes, arms/hands |
| Monitors/displays dark slabs | Screen slabs proud on both faces (ref screens glow from every side); screen boost ×2.2→×4.5; per-display catalogued contents as canvas textures (bar chart / dashboard / code / artwork / charts / world map / check mark) |
| Server racks dark | Glowing blue front faces (QA banks) |
| Lounge set brown/flat | Cognac leather (ref ottoman RGB(96,62,34)), grey-lavender rug (ref RGB(116,113,125)), charcoal benches kept |
| Planter/canopy tones | Warm stone drums (ref RGB(136,112,97)), olive canopies (ref RGB(107,85,73)), lush multi-cluster canopies |
| Plaza logo/wordmark invisible | Label planes filled to their measured extents; wordmark #68646B (ref letters RGB(66,63,66) sampled, lit) |
| Exec Office cold | Warm interior point-light accent (position = DEPT-01 centre; intensity/radius EST.) |
| Building shadow swallowed the west terrace | Key light steepened [35,50,−15]→[25,75,−12] (same azimuth family) restoring the reference's short contact shadows (VAC-LGT-02) |
| Search field invented ✕ glyph | Removed (not in the reference) |
| Logo glyph wrong | Interlocked double-loop mark (two rotated rings, cyan→blue) |

## 2. Verification

- `npm run validate`: **77/77 tests** (71 prior + 6 new ui-shell), tsc, build, check-dist all green.
- New `tests/ui-shell.test.ts`: verbatim strings, measured boxes (REG-01/02/06/07/08, UI-016/031/040/050/083/085), immutable counts, DOM-not-image guard.
- Browser renders at **1920×1080** (main acceptance viewport), 2560×1440, 1366×768 — FOV rule verified live (12.0006° / 11.9885°); shell scales uniformly.
- Dev-route invariants preserved (`isDevRoute()` hash-only; overlays off `/`; flat mode byte-identical policy upheld — flat colours re-pinned for changed tokens only, `rendered-check.json` regime unchanged).

## 3. Evidence

- Full-size side-by-side: `greybox/review/reset/side-by-side-v21.png` (+ v13–v20 iteration history)
- Per-region ref-vs-impl (16 regions): `greybox/review/reset/final-region-*.png`
- UI-only region crops: `ui-region-*.png`, `ui2-*.png`, `ui3-topstrip.png`
- Diagnostics: `flat-west*.png` (flat-mode ID decode of the terrace band), `skyline-v12.png`, `westband-*.png`, `robots-marketing-v4v5.png`, `chibi*.png`
- Desktop acceptance shots: `final-1920x1080.png`, `final-2560x1440.png`, `final-1366x768.png`

## 4. Documented deviations (residual)

| Deviation | Class |
| --- | --- |
| City card extents above/below the measured band (y −40…65, x→−140) to fill the skyline; tower subdivision/window grids | EST. scenery (planes Q-ARCH-06 assumed) |
| Terrace deck extents + constant parapet top y=1.05 | EST. (parapet pt world-y documented as plane artifact) |
| Robot geometry beyond the head anchor (torso/limb radii, visor/eye dims) | EST. stylised after reference |
| Display screen contents beyond type (chart layouts, artwork shapes, map blobs) | EST. (exact layouts unresolvable at ref resolution) |
| UI font family | Roboto/Inter-like EST. (unresolvable); sizes follow measured text boxes |
| Profile avatar photo | NOT REPRODUCIBLE → neutral disc (documented; no invention) |
| 6 robots clamped to rooms; head round-trip ≤18 px for those 6 | MEASURED constraint + documented solve deviation |
| Exec Office interior detail (bookshelf contents, rug pattern) | Simplified vs reference (further pass possible) |
| DEPT-01 floor tone | UNRESOLVED (unchanged, neutral — prior report 08) |

## 5. Next (§6 review package)

Independent reviewer (non-implementer) region-by-region acceptance pass against
`docs/design/main-workspace/reference/wora-main-workspace.png` (SHA-256 verified), producing the
final verdict, residual-difference list and browser-rendered evidence. VF-8/overall acceptance
remains unclaimed until that gate passes.
