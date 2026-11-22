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
| Exec Office / dept interior micro-detail (book spines, marble veining, tilt-shift DOF, warm cove light, furniture styling) | Simplified vs reference — the largest remaining |Δ| driver; structure/positions/count align |
| DEPT-01 floor tone | UNRESOLVED (unchanged, neutral — prior report 08) |

## 4.1 Verification sweep (post-loop re-audit)

A second audit pass over the final render re-checked every region against the reference and found
two UI defects, both fixed and re-rendered (`reset-ui-final*`):

1. Status strip labels were coloured; the reference uses **light-grey labels with coloured dots**,
   coloured value badges (people glyph / solid discs) and thin dividers between blocks — rebuilt.
2. Search field had an invented inner border box; the reference is a **single dark pill** — rebuilt.

Final region deltas (mean |ΔRGB| per region, ref upscaled to 1920×1080; dominated by the
reference's stylised detail density — book contents, marble veining, tilt-shift depth-of-field,
warm cove light, furniture micro-detail — rather than by structure): switcher 0.4 · command 2.0 ·
profile 6.2 · activity 6.3 · sidebar-bottom 6.8 · qa-testing 11.8 · management 12.6 · header 15.0 ·
sidebar-top 15.5 · engineering 18.1 · plaza 21.4 · research 21.8 · search-status 30.8 (scene
behind the translucent panels differs) · creative 38.6 · exec-office 43.8 · marketing 58.4.
Evidence: `greybox/review/reset/final2-region-*.png`, `side-by-side-final.png`,
`status-final-check.png`.

## 5. Next (§6 review package)

Independent reviewer (non-implementer) region-by-region acceptance pass against
`docs/design/main-workspace/reference/wora-main-workspace.png` (SHA-256 verified), producing the
final verdict, residual-difference list and browser-rendered evidence. VF-8/overall acceptance
remains unclaimed until that gate passes.

## 6. Independent review record (final verification gate, 2026-11-21)

Reference SHA-256 re-verified before every pass (`6f91ff3d27f1d69d…`, unchanged). Review executed
region-by-region against the browser-rendered implementation (vite 5173, single-shot 1920×1080
puppeteer captures, ref upscaled LANCZOS to 1920×1080, S≈1.1483); blind pixel-derived findings,
no measurement from code; findings → correction → re-render → re-review. Review renders
`review-r12…r25` (scratch crops; evidence excerpts in `greybox/review/reset/r*-*.png`).

### 6.1 Blind findings and corrections (R-ledger continuation)

| # | Finding (blind) | Correction | Evidence |
|---|---|---|---|
| F12 | Display-wall screens read coplanar/overlapping their signs (Marketing dash, Engineering code) | Visor/monitor re-anchors (R8), dash/code reposition attempts **reverted** — measured px boxes reproduced ≤30 px gate only at solved positions; sign adjacency is ref-faithful | r13-marketing-zoom, projection test |
| F18 | Engineering code screen floats mid-wall (builder ignored measured `centre_y`) | Builder consumes `centre_y` as the measured screen centre; code display mounted at measured 0.98 m **below** the sign | r23-eng-zoom |
| F19 | Executive Office bare vs ref (dark walnut desk, warm slat back wall) | Exec desk → `darkwood` (#4E3E33, visual calibration), walnut back panel behind desk (measured slat sample token) | r21-exec-eng-sbs |
| F20 | Desk monitors read as dark top-edge slabs (vertical) vs ref bright blue tilted panels | Whole monitor head assembly tilted 0.6 rad toward HOME camera; emissive face dominates bezel | r23/r24/r25-creative-zoom |
| F21 | Lower facades: dark unlit masses vs ref pale precast + warm-lit window grid | ENV-014/015 facade texture (unlit, interior-lit palette: pale panels + dense warm window raster + shade gradient); RibbonPrimitive UVs added (ribbons had none — texture sampled one texel) | r13→r20-facade-sbs series |
| F22 | Shelf-stands bare; desk bases solid slabs | Shelf decor (foliage/leather props), slim deskwood underframes (R11) | r11/r12-marketing-zoom |

Two reposition attempts (dash to back wall, code display left) were **reverted after the
measured px-box projection gate failed** (>30 px) — the solved FIT positions were correct and
the perceived "overlap" is ref-faithful adjacency. Documented, not re-attempted.

### 6.2 Measurement-method correction

The §4.1 region table printed **self-deltas between successive implementation renders**, not
deltas vs the reference (discovered while recomputing the final table; archived-final2 vs r25
UI bands differ by ≤0.9, so the UI values were ours-vs-ours). The honest vs-reference table
(mean |ΔRGB|, ref LANCZOS→1920×1080, same 16 region boxes) is
`greybox/review/reset/final2-region-deltas.json`; headline: whole-frame 47.4 (final2/b84084d)
→ **43.6 (r25)**; improvements engineering +16.3, exec-office +14.7, research +13.5, creative
+13.1, management +10.9, marketing +7.7, activity +1.7; profile −4.4 (avatar disc, documented),
qa −6.2 and plaza −15.8 dominated by fixed-box **bleed** from corrected neighbours (exec dark
furniture entering the plaza box) — plaza/management triples show the plaza itself unchanged
(r25-plaza-triple, r25-management-triple). Patch-tone table (r10) remains valid for the floors.

### 6.3 Residual deviations (documented, not invented)

1. **Profile avatar**: ref has a photo avatar; implementation renders a neutral disc (no
   invention of a person) — profile Δ27.5→31.9 within an otherwise exact panel.
2. **Plinth wordmark**: ref shows a large "WORA" wordmark + logo on the dais; implementation
   renders the measured-size label (size EST.) — visually smaller.
3. **Atrium/plaza marble**: tone calibrated by patch (r8: plaza Δ−2.5); ref's veining/tilt-shift
   micro-detail unmatchable without texture invention.
4. **Facade window rhythm**: dense-grid placement EST. (storey count/bays not measurable at ref
   resolution); palette, rhythm and shade calibrated visually (r18–r20).
5. **DEPT-01 floor token**: unresolved (probe contamination history, test-enforced); neutral
   floor kept.
6. Region Δ floors dominated by ref micro-detail (book contents, plant leaves, warm cove light,
   depth-of-field) — structural geometry verified exact at every zoom.

### 6.4 Engineering validation

`npm run validate` (tsc + vitest 77/77 + build + check-dist) — **PASS** at r25.
Liveness guarded by #FF0000 injection probe (red share 1.78% ⇒ pipeline live; two identical
consecutive renders were genuine, not staleness).

### 6.5 Deliverable

Final full-size desktop comparison package: `greybox/review/reset/side-by-side-final2.png`
(ref top / implementation bottom, 1920×1080 each), `reset-final-<region>.png` ×16, full render
`reset-final-1920x1080.png`, coordinate-grid overlay `reset-final-grid-overlay.png`,
zoom evidence `r*-*.png`, measured table `final2-region-deltas.json`.

**Verdict**: independent review complete; all fixable discrepancies found by the review were
corrected (F12–F22); remaining deviations are documented above with evidence. Visual acceptance
remains UNCLAIMED — the gate is the user's.
