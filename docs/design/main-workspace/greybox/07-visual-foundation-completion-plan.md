# 07 — WORA Visual Foundation Completion Plan

> **Status: PROPOSAL — awaiting owner review and approval. Nothing in this plan is implemented.** Prepared 2026-11-20 on branch `arena/e6096316-wora-os`; PR #1 open and **not merged**; 006-B and 006-C **not started**.
> Product statement (owner, 2026-11-20): *the target is not a greybox that gradually becomes visually similar to the reference — it is the reconstruction of the reference as a complete, detailed, interactive 3D workspace.*
> Baseline: Mission 006-A (environment workstream, `47542bb`) — pending the owner's visual review; this plan treats it as the structural-and-environment baseline and supersedes the previously planned 006-B/006-C scopes with the larger missions VF-4 and VF-3 below (their original criteria are absorbed into the new ones).
> The locked reference (`docs/design/main-workspace/reference/wora-main-workspace.png`, checksum-verified) remains the **absolute visual authority** and is never modified.

---

## 1. Governing rules (binding for every mission below)

1. **Reference immutability.** The image is never modified; every mission verifies `sha256sum -c` before and after. It never enters a production build (P-6, `check-dist` enforced).
2. **No invention.** Every visible element must trace to the reference through the M002 catalogue (`analysis/02` ENV/DEPT/SIGN/ROBOT boxes), the M003 world solve, or a named scratch probe. Content that is occluded or not visible is **not invented** — it is either omitted or explicitly approved by the owner (decision Q-VF-01 below).
3. **Provenance separation.** Every value carries a tag — `MEASURED` (digitised/derived from the image), `FIT` (least-squares/projection fits), `EST.` (styled after the reference, documented), `ASSUMED` (unsupported plane/scale choices, owner-listed) — in `scene-architecture.json`, in tests, and in every review artifact. The tag system introduced in the 006-A review page is permanent.
4. **Test suite and gates preserved.** The current 47 tests (31 originals + 16 environment) pass unchanged at every mission boundary; additions are additive; thresholds are never weakened without owner approval; metric changes must be explained, never silently re-pinned.
5. **Specialist ownership and formal handoffs.** Each mission has one owning role, defined inputs, defined deliverables, and an explicit handoff statement. No mission starts before its dependencies are accepted through their review gate.
6. **Process per mission.** Geometry/placement data only via `scene-architecture.json` schema bumps → `npm run validate` → regenerate metrics → rendered check → committed review artifacts (`greybox/review/`, provenance-tagged, side-by-side + overlay + phone-viewport shots) → the live Vercel preview updates on every push → **owner visual review gate before the next mission starts** → PR #1 merged only by owner decision.
7. **HOME fidelity.** The approved HOME camera and the responsive FOV rule (`architecture/03 §6`) are never altered. All acceptance checks are made in the HOME reference frame; orbit views are dev-only aids.

## 2. Evidence inventory (what the image actually supports)

| Evidence | Source | Supports |
|---|---|---|
| Department footprints, partition lines, heights (provisional scale) | M003 solve + `scene-architecture.json` | Walls, glass, floors, walkway surfaces |
| ENV-001…017 screen boxes + notes | `analysis/02` §4 | Atrium, plinth, planters, seating, trees, cabinets, facade regions |
| Furniture/equipment types per room, wood tones, monitor densities | `analysis/03` §6–7 | Desks, chairs, shelves, boards, racks, rugs, plants |
| Large display content per department | `analysis/03` §4 + VAC-ENV-09 | Screen contents (bar chart, code, art, charts, world map, check mark) |
| ROBOT-01…47 boxes, positions, zone/free status, pose descriptions, shell/visor/eye colours | `analysis/02` §5, `analysis/03` §5 | Robot bodies, proportions, poses |
| Scene palette tokens (sampled HEX) | `analysis/05` §1.5 | Materials, glass, floors, plinth, facade, robots |
| Lighting: LGT-01…06 (mood, key direction, emissives+bloom, marble, robot material, wood/glass/metal) | `analysis/06` §9 | Materials & lighting mission |
| Facade bands (fascia fits), mullion bays, backdrop planes | 006-A probes (schema v2 `environment`) | Structure completion, background |
| **Not visible / ND** | — | Ceilings (roofless cutaway, VAC-GEO-08), interiors behind REG-02/04/06/07, hidden floor areas, doors (Q-3D-01) — governed by rule 2 |

## 3. Mission breakdown

### VF-1 — Materials & Lighting Foundation
**Owner:** 3D Scene Builder (materials) · **Depends on:** 006-A accepted · **Blocks:** all visual missions.

**Scope.** Replace flat tones with the reference's material system: PBR surfaces from the sampled palette (`analysis/05` §1.5 + probe samples); glass with real transparency/reflection behaviour; polished-marble atrium floor treatment (VAC-LGT-04) from sampled tones; wood/metal families; real shadow mapping with the LGT-02 key direction (contact shadows falling lower-left); tone-mapping and exposure matched to the reference mood (LGT-01); emissive rim/strips/screens + **bloom** (completes Q-3D-07: emissive now, bloom here; intensity budget = Q-VF-03).
**Not in scope:** any geometry change; furniture/robots; decorative additions.
**Acceptance criteria.**
- A1: every material's base colour is a catalogued sample (hex listed in the JSON with provenance); a palette audit test lists material → token → sample.
- A2: LGT-01…06 self-assessment against VAC rows, with side-by-side crops; marble/wood treatments flagged `EST.` (procedural from sampled tones — Q-VF-02).
- A3: all 47 tests preserved; new material-audit tests; rendered check re-run (geometry unchanged ⇒ same numbers).
- A4: phone-viewport evidence (412×915 @ DPR 2.625) committed.
**Review gate VF-1:** owner reviews the material/lighting package (side-by-side + overlay + close-ups) before any content mission starts.

### VF-2 — Architectural Fidelity Completion
**Owner:** 3D Scene Builder (structure) · **Depends on:** VF-1 accepted.

**Scope.** Complete the visible structure to reference detail: glass partition systems with frame/mullion rhythm per room (as visible); balustrade glass + rail + handrail profiles; walkway/atrium floor seams and edge trims **only where visible**; facade refinement (per-storey bands, glazing heads) within the measured fascia/mullion data; Executive Office walnut back wall (visible in HOME; sampled `#897047`) as a structural surface; rooftop/terrace structural items only as catalogued.
**Explicit no-invention boundaries:** ceilings are **not modelled** (roofless cutaway, VAC-GEO-08 — nothing above the visible ceiling plane exists in the image); no doors (Q-3D-01 stays closed until the owner reopens it); nothing behind REG-02/04/06/07.
**Acceptance criteria.**
- A1: all existing metric checks pass unchanged (footprints, edges, plinth, signs, camera).
- A2: new overlay checks: added structural lines land within ±10 px of their catalogued reference edges (each new element cites its evidence row).
- A3: provenance table in the mission report; every `EST.`/`ASSUMED` item listed.
**Review gate VF-2:** owner side-by-side review of all four elevations + atrium.

### VF-3 — Department Interiors (furniture; supersedes 006-C)
**Owner:** Furniture specialist · **Depends on:** VF-1 + VF-2 accepted · **Parallel with:** VF-4, VF-5.

**Scope.** Reconstruct all catalogued interiors: desk groups per room in the catalogued wood/white/grey families (`analysis/03` §6), task chairs, 2–3 monitors per desk with blue/cyan UI screens, the six department large displays with their catalogued content types (VAC-ENV-09), bookshelves, whiteboards/pin-boards, QA server racks, rugs, room plants (VAC-ENV-10), Executive lounge + desk, atrium lounge set ENV-005…013 (planter+tree, sofas, bench, rug, ottoman, cabinets).
**No invention.** Only catalogued items; positions inside the measured ENV boxes; density comparable to the reference (VAC-ENV-11). **Occluded zones** (behind the sidebar/Live Activity/executive command panels): default = leave sparse with uniform floor; populating them plausibly requires owner decision **Q-VF-01**.
**Acceptance criteria.**
- A1: every catalogued item lands inside its ENV box (projected ±10 px at HOME) — placement tests per item.
- A2: per-room item census vs catalogue (no extras, no missing catalogued items); walkway clearances preserved.
- A3: occluded-zone policy documented (whatever the owner decides for Q-VF-01).
- A4: markers/47-robot data untouched; guards green.
**Review gate VF-3:** per-department close-up pairs (7 rooms + atrium), phone shots.

### VF-4 — Robot Visual Reconstruction (supersedes 006-B)
**Owner:** Robots specialist · **Depends on:** VF-1 + VF-2 accepted · **Parallel with:** VF-3, VF-5.

**Scope.** Reconstruct the 47 visible robots (ROBOT-01…47): white shell / black glass visor / emissive cyan eyes (`scene.robot-*` tokens), proportions from each robot's **measured box** (W×H per robot), pose classes from the catalogue descriptions (seated at desks, standing, walking, seated on the ottoman ROBOT-042, etc.), zone/free placement preserved, orientation consistent with the described facing.
**Style decision (Q-VF-04):** stylised low-poly reconstruction (recommended; every shape supported by the image) vs higher-detail shells — owner chooses before start.
**Acceptance criteria.**
- A1: exactly 47 rendered; per-robot projected box edge distance ≤ 15 px (P-4) at HOME; per-robot table in the report.
- A2: pose class matches the catalogue (visual review per robot crop); no robot outside the measured set; U-01…03 excluded unless approved.
- A3: scale constancy VAC-CAM-04 reported against the M003 residual (1.32 vs 1.36) — not silently fitted; occlusion parity VAC-CAM-05 maintained.
- A4: materials from VF-1; no robots hidden by REG panels become visible in HOME.
**Review gate VF-4:** 47 per-robot crops + overlay + phone shots.

### VF-5 — Environmental Details & Background Completion
**Owner:** Environment specialist · **Depends on:** VF-1 accepted · **Parallel with:** VF-2/3/4.

**Scope.** Finish the outdoor setting: layered city backdrop (depth cards within the assumed planes — Q-ARCH-06), outdoor tree canopies with catalogued shapes (trunk+crown instead of discs where the image shows structure), ENV-017 right-terrace greenery (owner re-scope decision; default stays omitted), planter/grass details visible in HOME, light-strip glow halos via the VF-1 bloom pipeline, sky/backdrop gradient.
**No invention.** No unseen building extensions; scenery stays scenery (CR-02); planes stay assumptions and are tagged.
**Acceptance criteria.** A1: scenery items map to catalogue rows; A2: HOME composition unchanged (safe rect and plinth metrics identical); A3: `ASSUMED` list current.
**Review gate VF-5:** upper/lower backdrop pairs.

### VF-6 — Mobile Visual Fidelity
**Owner:** Frontend UI Architect + 3D Scene Builder · **Depends on:** VF-3, VF-4, VF-5 accepted (runs as the final fidelity pass; phone checks are already embedded in every earlier gate).

**Scope.** Make the scene *understandable on a phone*, not merely rendered (owner requirement 6). Known cause (from the 2026-11-20 investigation): at ~412 CSS px width, sub-metre elements (0.025–0.06 m posts/mullions/strips) fall below one device pixel. Mitigations, none touching HOME composition or geometry data: screen-space thickness floors for line-like elements (DPR-aware), LOD for distant geometry, DPR cap review, draw-call/poly budget with a documented target, optional viewport-adaptive quality preset. Values = **Q-VF-06**.
**Acceptance criteria.**
- A1: at 412×915 @ DPR 2.625 every catalogued fine element is ≥ 1.5 device px or intentionally hidden at that size (documented per element).
- A2: plinth, signs and department structure are legible in phone-viewport renders (owner visual confirmation).
- A3: performance budget measured (frame time in SwiftShader as proxy + owner's real-device check).
- A4: desktop renders pixel-unchanged vs the pre-VF-6 state (regression proof).
**Review gate VF-6:** phone/desktop pair package.

### VF-7 — Interaction Layer
**Owner:** Interaction & State Engineer (+ Frontend UI Architect for panel design) · **Depends on:** VF-6 accepted · **Design inputs:** owner approval of interaction scope (Q-VF-05).

**Scope.** Meaningful interaction over the reconstructed scene, per `architecture/04` (DOM overlays above the canvas; no UI redesign of the reference's panels): hover/selection highlighting per department/robot/plinth (raycast via existing `userData.refId`s), department info (name; counts consistent with the immutable 24/47 data), robot focus, camera modes (HOME restorable — existing reset; orbit; department focus), layer/labels toggles. No changes to the 24 AI Employees label or 47 count.
**Acceptance criteria.** A1: every visible catalogued entity is pickable; A2: HOME restorable exactly (existing test stays green); A3: interaction state never alters geometry/material identity (highlight only); A4: performance budget holds.
**Review gate VF-7:** interaction demo recorded as artifacts + live preview walkthrough.

### VF-8 — Final Visual Acceptance (gate to "reconstruction complete")
**Owner:** Visual QA + owner. Full VAC run (`analysis/06` §0–11), fresh review package (side-by-side, overlay, close-ups, phone), updated live preview, validation report, checksum verification. **The owner's acceptance of VF-8 is the definition of "the reference reconstructed".**

## 4. Dependency graph

```
006-A accepted
   └─ VF-1 Materials & Lighting
        ├─ VF-2 Architectural completion
        │     ├─ VF-3 Interiors ──────┐
        │     ├─ VF-4 Robots ─────────┼─► VF-6 Mobile fidelity ─► VF-7 Interaction ─► VF-8 Final acceptance
        │     └─ VF-5 Environment ────┘
        └─ (VF-5 may start in parallel with VF-2)
```

## 5. New owner decisions introduced (none resolved silently)

| ID | Decision needed | Default proposed |
|---|---|---|
| Q-VF-01 | Populate interiors behind the UI occluders (REG-02/04/06/07) or keep sparse | Keep sparse (no invention) |
| Q-VF-02 | Procedural marble/wood texture treatments from sampled tones vs flat materials | Procedural, flagged `EST.` |
| Q-VF-03 | Bloom intensity budget (LGT-03) | Subtle, matched to reference glow |
| Q-VF-04 | Robot style: stylised low-poly vs detailed shells | Stylised low-poly |
| Q-VF-05 | Interaction scope for the first release | Selection + info + camera modes |
| Q-VF-06 | Mobile thickness-floor values / quality preset | DPR-aware ≥ 1.5 device px floor |
| carried | Q-ARCH-02 (0.75 m provisional scale) | Unchanged; all VF heights derive from it — a scale change rescales interiors and robots |

## 6. What stays immutable

The reference image and its checksum; the HOME camera and responsive rule; the 24 AI Employees label and 47 robot count; the department order/adjacency and measured footprints; the existing test suite and acceptance gates; PR #1's open status (merge = owner only). Every mission's artifacts remain review artifacts — never replacements for the reference.

## 7. Approval request

Approving this plan authorises the mission sequence VF-1…VF-8, the supersession of 006-B/006-C by VF-4/VF-3, and the per-mission gates above. Implementation starts **only** with the owner's explicit go (VF-1 first) and stops at every review gate. Until then, nothing changes.
