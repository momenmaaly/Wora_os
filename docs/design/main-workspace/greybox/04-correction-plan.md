# 04 — Correction Plan: Greybox Visual Review

> Mission **WORA-GREYBOX-REVIEW-005**, branch `arena/e6096316-wora-os`. Companion to `03-visual-review.md` (evidence and findings).
>
> **Status: no correction is implemented in this mission.** Every finding is either resolved by evidence with no geometry change, or requires owner approval before any change. Per the mission rules: no subjective design changes; only corrections directly supported by the reference and the approved measurements may be implemented, and none of the open ones meets that bar without an owner ruling.
>
> Legend — Confidence: High / Medium / Low. "Approval" = owner decision required before the change may be made. Evidence references: `review/` screenshots, `greybox/data/*.json`, report `01` sections, `analysis/*`, `architecture/*`.

## 1. Issue register

| ID | Issue | Reference evidence | Current rendered result | Proposed correction | Expected visual impact | Confidence | Approval |
|---|---|---|---|---|---|---|---|
| CR-01 | Lower-right (+X) slab edge is 3–10° steeper in the reference than the grid-aligned model edge; up to 14.2 px from the `analysis/02` line at its lower end, max 43.3 px vs the Hough segment | `review/B-lower-right-*`; fascia band with several near-parallel candidate lines (balustrade rail / fascia top / fascia bottom); M004 §4 probe (step line 7.41° steeper, crosses x ≈ 1630); back-projected means x 14.67 / 14.79 (JSON range 14.3–15.8) | Straight edge at x = 14.6, grid-aligned (M003 recommendation) | **Option A (recommended): keep.** Option B on approval: skew the edge in plan from x ≈ 15.77 @ z 3.3 to x ≈ 13.75 @ z −8.65 (schema bump, `01 §4` option b). Any change must not touch the fitting anchors | B: the edge follows the perceived fascia line (max residual vs Hough 43.3 → ≲10 px), but the lower-left edge and the line-fit grid consistency are untouched either way; risk of codifying periphery distortion as geometry | Medium (cause: image periphery distortion vs skewed slab — not decidable from one image) | **Yes** — either way (accept residual, or approve Option B) |
| CR-02 | Back building boundaries (−X / −Z): the reference shows background scenery (glazing, city, greenery, curved mass band) beyond the model edges; the building's true extents are invisible | `review/B-back-left-minusX-*`, `B-back-right-minusZ-*`; no measurable slab corner, wall or floor line above the back walls anywhere (`03 §4.1`) | Slab at minimum supported extents (x₀ = −17.18, z₀ = −15.30); nothing beyond | **Owner to rule** (Q-ARCH-06 / Q-3D-08): (a) keep minimum extents — recommended for HOME; (b) approve continuation extents if the owner has out-of-band knowledge. Never derive them from this image | (b) would fill the top band with floor plate where the reference shows scenery; would change framing background, not composition | High that (a) is correct under the no-invention rule; extents themselves unknowable | **Yes** |
| CR-03 | Plinth drum height vs measured box (M004 U-4: 107.3 px vs 100 px, aspect −0.148 if the box were top-disc-only) | New luminance probe (3 columns x = 830/903/975, y 440–560): rim top y ≈ 445–450, floor contact y ≈ 535–550 → the ENV-002 box covers the **full drum** | Plinth top 0.12 m (est.), full drum renders 107.3 px vs measured 100 ± 5 px | **None — closed.** The 0.12 m height stands | — | High | No (documented in `03 §3.3`) |
| CR-04 | "Management right corner visible at (1646.9, 495.9)" flagged under VAC-CAM-05 in M004 | Direct crop (ref ≈1480–1672 × 360–720): room continues past x = 1508; right glass wall with corner post at x ≈ 1655–1662 to the frame edge | Corner at (1646.9, 495.9), inside the visible room, ~8–15 px left of the visible post | **None — reclassified as informational.** The room genuinely reaches the frame edge; the model corner is consistent with the fitted footprint. Future docs should reword the VAC-CAM-05 note | — | High | No (doc-only, next doc revision) |
| CR-05 | SIGN-02 +3.5°, SIGN-03 −5.1° plate-angle residuals (VAC-CAM-02: 5/7 within ±3°) | `review/S-SIGN-02/03-*`; residuals sit at the upper periphery where verticals are straightened 1–3.6° (M003) and on the same side as the steepened +X edge → image-wide distortion pattern | Plates at the solved angles; residual unchanged since M003 | **None — keep.** A per-sign refit would fit model geometry to image distortion. Owner may instead approve a re-measurement with named edges | None (keeping) / small angle change if ever approved | High that keeping is right; Medium on the distortion explanation | **Yes** for any change |
| CR-06 | Sign plate heights render 1–27 px taller than the measured boxes (uniform 0.93 m estimate; per-sign heights entangled with rotation) | `review/S-SIGN-01…07-*` vertical overshoot; `architecture/05` G-12…18 estimates | Uniform 0.93 m × fitted lengths | On approval: fit per-sign plate heights to the measured boxes (schema bump + test update). Alternative: keep until the art pass replaces plates with real signage | Boxes would hug the measured silhouettes; sign visual mass slightly reduced; 7 fitted values replace 1 estimate | Medium-Low benefit; rotation coupling limits accuracy | **Yes** |
| CR-07 | Executive Office plan shape (square 7.10 × 7.10 vs possible chamfer) | `review/D-DEPT-01-*`: angled glass facets are panel curvature/reflections; no measurable chamfer; SIGN-01 anchor 0.5 px | Square plan, no chamfer (A-EXEC-SYM) | **None for the greybox.** Q-ARCH-03 stays open for the art pass; if the owner later supplies a chamfer size, implement via JSON schema bump | Chamfered far corner (art-pass visual change only) | High that the greybox is correct; chamfer itself unknowable from the image | **Yes** (any chamfer) |
| CR-08 | Building-mass backdrop silhouette is organic in the reference (curved parapet, top-right), plain block in the greybox | ENV-016 top-band region (not separately catalogued in M002); `review/B-back-*`, R02/R03 | Straight-edged mass, 11 m placeholder depth | **None for the greybox.** Record as an art-pass modelling item (mass silhouette, parapet curve) | Curved roofline/parapet in the backdrop (art pass) | n/a (scope item, not an error) | No (no change now) |

## 2. Corrections implemented in this mission

**None.** No geometry, material, camera or test change was made in Mission 005. The M004 validation suite was re-run after the review and passes unchanged:

```
npm run validate  →  tsc --noEmit OK
                     Test Files 4 passed (4) / Tests 31 passed (31)
                     vite build OK
                     check-dist: OK (3 files, no reference image, no raster assets, no dev overlay path)
```

The reference image was preserved; its checksum verified OK at review start and before commit.

## 3. Decisions requested from the owner

1. **CR-01** — accept the +X edge residual (recommended), or approve the skewed-edge Option B.
2. **CR-02** — keep the minimum back extents (recommended), or supply/approve continuation extents.
3. **CR-05** — confirm keeping the solved sign angles (recommended).
4. **CR-06** — keep the uniform 0.93 m sign height until the art pass (recommended), or approve per-sign fitted heights.
5. **CR-07** — confirm the square Executive plan for the greybox (recommended); provide a chamfer decision for the art pass.
6. **Review acceptance** — the art pass may not start until this review is accepted.

## 4. Gate

`03-visual-review.md` §5: **accepted-for-handoff, art pass blocked pending owner acceptance.** When the owner rules on §3, implement only the approved items (each via the `scene-architecture.json` schema-bump route), re-run `npm run validate`, regenerate `greybox-metrics.json`, and update this register's Decision column.
