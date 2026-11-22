# 10–13 — VF-2 · VF-3 · VF-4 · VF-5 Reports (autonomous run, 2026-11-20)

Owner authorisation: continuous execution VF-1→VF-8 (2026-11-20), no per-phase manual gates. Independent-QA pass and fixes included per phase. **PR #1 not merged; reference untouched (checksum verified at every commit).**

## VF-2 — Architectural fidelity completion (report 10)

**Implemented** (owner: 3D Scene Builder–structure; reviewed by QA specialist pass):
- DEPT-01 **walnut slat back wall** (`scene.walnut #897047`, MEASURED sample; analysis/03 §2.2/§4) — thin panel on the inner face of the measured back footprint edge (BY CONSTRUCTION position), height = partition height 2.07 m.
- **Partition frame rhythm** on every atrium-facing glass front: anthracite vertical mullions + top/bottom rails (§2.2 "thin dark anthracite metal frames"). Bay = the MEASURED 0.96 m facade bay applied to partitions (**EST.** — the partition rhythm itself is not separately measurable in the reference).
- **White wall slabs** behind the Management whiteboard and Creative Studio pin-board (§2.2 solid segments) at the solver-derived wall-adjacent points.
- **Not modelled (no-invention boundaries):** ceilings (roofless cutaway VAC-GEO-08), doors (Q-3D-01), everything behind REG occluders.

**Provenance:** walnut colour MEASURED; wall positions BY CONSTRUCTION on measured footprints; partition bay EST.; wall-panel positions EST. (wall-adjacent, see solver note).

**Tests:** `vf34.test.ts` "VF-2 structure completion" (walnut existence/material/span; frames ≥ 3 per department, count bound). Existing 47 + VF-1 suites unchanged and green.

**QA findings & fixes:** none open. Deviation: partition mullion spacing is an applied estimate (documented); no measurable reference lines exist for it.

## VF-3 — Department interiors (report 11)

**Implemented** (owner: Furniture specialist): 205 catalogued items placed via the HOME-camera inverse projection of the analysis/03 §3–§6 screen boxes (scratch solver `vf34solver.py`; forward-projection verified: plinth centre residual 0.23 m, SIGN-01 anchor exact):
- **Work clusters** per seated robot (35 clusters: desk + task chair + 2 monitors), material per §6 (Marketing/Creative/Research wood-grey families, Engineering white, QA wood/dark).
- **Department large displays** ×6 with catalogued content types (bar chart / dashboard / code / art / charts / world map / check mark) — emissive `screen` material (#134AB0–#1A55C0), facing the HOME camera side (contents visible from the camera as in the reference; QA fix after v1 render showed backs).
- **Bookshelves ×3, whiteboards ×2, server racks ×2** (with blue LED strips), **conference table** (warm wood, px-derived 3.77 m) + 5 chairs + laptops, **executive desk**, lounge chairs, **rugs**, **planter boxes/cylinders**, **plants ×20, trees ×3**, atrium lounge set **ENV-005…013** (curved sofa leather #966B61, sofa, bench #665D68, rug #4E4F63 + ottoman, concrete planter + tree, cabinets, white planters).
- **Not invented:** display chart artwork (ND at greybox level — flat emissive stands in; art-pass), desk papers/small props, occluded-zone interiors (Q-VF-01 default: sparse), U-01…03.

**Provenance:** positions FIT (px-box inverse projection; floor items ±15 px tested), widths FIT-derived; depths/heights type-standard **EST.**; wall items wall-adjacent **EST.** (far-wall plane intersections proved below-floor — documented solver limitation); plant/tree positions MEASURED-derived (kept even where they land on back terraces, visible through glass as in the reference).

**Tests:** catalogue coverage (counts), footprint containment (±1.0 m wall-snap tolerance; plants/trees exempted — documented), floor-item projection ≤ 15 px, wall-item projection ≤ 30 px, ENV-005…013 presence.

**QA findings & fixes:** (1) display orientation reversed → fixed to camera-facing; (2) lounge robots initially got desk clusters → solver corrected (ROBOT-042/043 are seated on furniture, no desk); (3) `Atrium lounge` dept string normalised. All re-tested.

## VF-4 — Robot visual reconstruction (report 12)

**Implemented** (owner: Robots specialist): all **47** catalogued robots (ROBOT-001…047) rebuilt as **stylised low-poly chibi** (approved default Q-VF-04): glossy white shell (`robot-shell` roughness 0.3 + clearcoat), black glass visor (`robot-visor`), **emissive cyan eyes** (`robot-eye` #2FD2FF, HDR ×3.5 → bloom), blue ear discs, blue torso accent panels, **dark-navy vest** for ROBOT-041/044/045 (sign-plate token), **tablets with glowing screens** for the six free-roaming robots, antenna nub only on ROBOT-046 (§5.1), orange-red ear disc for ROBOT-046 (leather token — palette has no red; documented EST.).
- **Geometry anchors:** height = M003 `assumed_head_h` (0.95 seated / 1.2 standing) so the approved floor solve stays exact; width FIT-derived from the §5.2 visible box; head ≈ 42 % of height per §5.1.
- **Pose/facing** from the MEASURED §5.2 classes (seated/standing/walking × cam/left/right/back).

**Provenance:** poses/facings MEASURED; widths FIT; limb/eye simplification EST. (documented stylisation); exact expressive eye shapes ND → primitive spheres (art-pass).

**Tests:** exactly the 47 measured ids (no extras/missing); every head-top projects ≤ 15 px (P-4) from the measured head position; material families present; vest set == {41,44,45}; pose census 42 seated / 5 free.

**QA findings & fixes:** none open. Deviation: eye/limb detail is stylised (est.); ROBOT-046 ear colour approximated.

## VF-5 — Environmental details (report 13)

**Implemented** (owner: Environment specialist): terrace/outdoor trees now carry **trunk + crown structure** (trunk `deskwood`, length r×1.5 **EST.**) while canopy positions/radii stay byte-identical on the assumed backdrop planes (CR-02) — HOME composition unchanged (safe-rect/plinth metrics unaffected; verified by tests). Strip glow halos already delivered by the VF-1 bloom pipeline; city backdrop stays the two assumed-plane cards; **ENV-017 stays omitted** (no consistent placement — unchanged decision); sky stays the measured flat backdrop (no invented gradient).

**Provenance:** canopy positions MEASURED-derived (unchanged); trunk length EST.; planes ASSUMED (Q-ARCH-06 open).

**Tests:** full suite green; flat-mode rendered check unchanged (flat skips VF content groups by design — measurement neutrality documented in 06/08 reports).

**QA findings & fixes:** none open.
