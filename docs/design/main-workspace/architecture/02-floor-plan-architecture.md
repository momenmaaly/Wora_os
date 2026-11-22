# 02 — Floor Plan Architecture: WORA Main Workspace

> Coordinate system and conventions: `01-coordinate-system.md`. All values are world metres. Authoritative numbers: `data/scene-architecture.json`.
> **No room, door, wall or structure was invented.** Everything below is either derived from the reference (with residuals) or marked ND. The layout follows `analysis/03 §2.3`: seven rooms in a ring around a central atrium.

---

## 1. How the plan was derived

1. **Camera first** (`03-camera-architecture.md`). The camera is solved from about 270 straight-line segments, independently of any layout guess.
2. **Back-project floor-level evidence** (T1 in `01 §6`): the plinth, slab edges, five digitised partition floor corners and the atrium object bases.
3. **Solve each room as an axis-aligned box** [x₀,x₁]×[z₀,z₁] with partition height 2.07 m. The constraints are:
   - the visible edges of the `02 §4` screen envelope;
   - the **sign wall**: each sign plate is parallel to one partition family, and its back-projected centre fixes that wall's coordinate (**A-SIGN-01**);
   - **robot containment**: every zone robot from `measurements.json` must lie inside its room, with a 0.35 m margin;
   - **digitised floor corners** where one was clearly visible (**A-DIG-01**);
   - for the Executive Office only, **A-EXEC-SYM** (square plan), because nothing else fixes its aspect.
4. **Validate** with evidence that was not fitted: the free-roaming robots must fall outside every room, leave-one-out corner errors, sign angles and the overlay (`05`).

**Correction to `analysis/03 §4`.** The sign plates are **not** above the atrium-facing glass. Placing them there puts all 39 robots of the six signed rooms outside their rooms. The data puts every side sign on the room's **far, camera-facing wall** (the −X wall for the left and lower-left rooms, the −Z wall for the right and lower-right rooms). Crops confirm this: for example, the Marketing sign hangs above the back-wall displays with the desks in front of it. This is recorded as an erratum (`05 §6`); the analysis files were not edited.

## 2. Plan (top-down, axis-aligned)

Legend:
- `+--+` room footprint (partition floor line)
- `o` plinth rim, `@` origin
- `*` atrium object bases (furniture, **not** greybox geometry)
- `=` visible +Z slab edge, `#` visible +X slab edge (approximate)

The camera is beyond the bottom-right corner and looks towards the top-left.

```
     X ->  (1 char = 0.5 m)   Z down (1 row = 1 m)
z= -15                             +--------------------+
                                   |                    |
                 +-------------+   |        ENG         |
                 |             |   |                    |
                 |             |   |                    |
z= -10           |             |   +--------------------+                 #
                 |    EXEC     |                          +-------------+ #
                 |             |                          |             | #
                 |             |                          |             | #
                 +-------------+                          |     MGT     | #
z=  -5                                                *   |             | #
                                      *   *               +-------------+ #
           +----------+                                                   #
           |          |                  oooooooo                         #
           |          |             *   oo       oo                       #
z=   0     |          |         *       o    @    o                       #
           |   MKT    |                 oo       oo       +------------+  #
           |          |             *    oooooooo         |            |  #
           |          |                                   |     QA     |  #
           |          |                                   |            |  #
z=   5     |          |                                   +------------+
           +----------+
                                +---------+    +---------+
                                |         |    |         |        *
                                |         |    |         |     *
z=  10                          |   CRE   |    |   RES   |
                                |         |    |         |
                                |         |    +---------+
                                |         |
                                +======================
z=  15
               |         |         |         |         |         |         |
               -15       -10       -5        0         5         10        15
```
On screen this plan is rotated by about 45° (the −X −Z corner is at the top) and foreshortened vertically by sin 27.8° ≈ 0.47.

## 3. Departments

Partition height for all rooms is **2.07 m** (derived, `01 §3`). Footprints are floor-level partition lines.

| ID | Room | x₀ | x₁ | z₀ | z₁ | Size X × Z (m) | Centre (x, z) | Sign wall | Occluded side(s) | Conf. |
|---|---|---:|---:|---:|---:|---|---|---|---|---|
| DEPT-01 | Executive Office | −13.90 | −6.80 | −12.69 | −5.59 | 7.10 × 7.10 (A-EXEC-SYM) | (−10.35, −9.14) | see §3.1 | back (−X −Z) corner behind the status strip | Low |
| DEPT-02 | Marketing | −17.18 | −11.40 | −3.15 | 5.71 | 5.77 × 8.86 | (−14.29, 1.28) | x₀ (−X wall) | left behind the sidebar; true x₀ extent ND | Medium |
| DEPT-03 | Engineering | −5.04 | 5.26 | −15.30 | −10.44 | 10.31 × 4.86 | (0.11, −12.87) | z₀ (−Z wall) | right behind Live Activity | Medium–Low |
| DEPT-04 | Creative Studio | −6.55 | −1.50 | 6.57 | 14.03 | 5.04 × 7.46 | (−4.02, 10.30) | x₀ (−X wall) | left behind the sidebar | Medium–Low |
| DEPT-05 | Management | 6.56 | 13.44 | −8.69 | −4.24 | 6.89 × 4.45 | (10.00, −6.46) | z₀ (−Z wall) | right corner close to the image edge (x≈1647 px; a post is visible at ≈1660) | Medium |
| DEPT-06 | Research | 0.90 | 6.07 | 6.84 | 12.45 | 5.17 × 5.61 | (3.48, 9.65) | x₀ (−X wall) | none | Medium |
| DEPT-07 | QA & Testing | 6.55 | 13.20 | 1.44 | 5.01 | 6.65 × 3.56 | (9.88, 3.22) | z₀ (−Z wall) | none | Medium |

Projected floor corners (px, order (x₀,z₀) (x₁,z₀) (x₁,z₁) (x₀,z₁)). The Scene Builder uses these to check placement:

| ID | (x₀,z₀) | (x₁,z₀) | (x₁,z₁) | (x₀,z₁) |
|---|---|---|---|---|
| DEPT-01 | 864.8, 158.7 | 1068.0, 241.5 | 864.5, 330.0 | 661.5, 240.4 |
| DEPT-02 | 499.8, 229.9 | 657.3, 301.5 | 370.9, 419.7 | 215.0, 340.3 |
| DEPT-03 | 1191.4, 231.6 | 1523.3, 363.1 | 1391.3, 430.0 | 1058.1, 290.8 |
| DEPT-04 | 481.3, 503.8 | 636.0, 583.6 | 363.5, 710.0 | 210.4, 622.0 |
| DEPT-05 | 1386.5, 474.3 | 1638.7, 581.7 | 1509.7, 655.4 | 1256.1, 541.7 |
| DEPT-06 | 703.8, 628.0 | 878.9, 718.6 | 675.0, 823.3 | 500.4, 725.3 |
| DEPT-07 | 1077.9, 633.5 | 1323.7, 751.8 | 1205.7, 819.0 | 959.3, 694.7 |

Sign anchors: back-projected sign-plate centres at a height of 2.07 m. Rotations are those measured in `02 §4`.

| Sign | Room | World (x, y, z) | Plate orientation | Measured screen rotation |
|---|---|---|---|---|
| SIGN-01 | Executive Office | (−10.40, 2.07, −9.58) | Perpendicular to the camera diagonal (normal ≈ +X+Z) | 0° |
| SIGN-02 | Marketing | (−17.13, 2.07, 1.26) | Parallel to Z (on the x₀ wall, facing +X) | −24° |
| SIGN-03 | Engineering | (−0.56, 2.07, −15.24) | Parallel to X (on the z₀ wall, facing +Z) | +26° |
| SIGN-04 | Creative Studio | (−6.55, 2.07, 10.67) | Parallel to Z (on the x₀ wall, facing +X) | −24° |
| SIGN-05 | Management | (9.83, 2.07, −8.51) | Parallel to X (on the z₀ wall, facing +Z) | +22° |
| SIGN-06 | Research | (1.08, 2.07, 10.25) | Parallel to Z (on the x₀ wall, facing +X) | −27° |
| SIGN-07 | QA & Testing | (9.25, 2.07, 1.91) | Parallel to X (on the z₀ wall, facing +Z) | +26° |

Mounting height above the partition top is ND. Raising a sign by Δh moves its anchor ≈1.9·Δh towards the camera along the view direction, so keep the **screen position** fixed rather than the world anchor when adjusting height.

### 3.1 Executive Office specifics
- The reference shows a dark walnut slat back wall, glass side and front walls, and **angled (chamfered) front corners** (`analysis/03 §4`). The chamfer size is **ND**.
- SIGN-01 is at 0° on screen, which means its plate is perpendicular to the camera diagonal.
- Back-projected at partition-top height, its anchor falls near the **room centre**, not on the front facet. A front-facet sign would have to sit below the floor, which is impossible, so the sign is mounted further back and/or higher (e.g. above the walnut back wall). The mounting is **ND (Q-ARCH-03)**. Keep the plate at its measured screen position (792,141,168,35).
- The plan aspect is fixed by **A-EXEC-SYM**. Only its envelope's left, right and bottom edges are measurable; the top is hidden behind the status strip.

### 3.2 Robot containment (independent check, details in `05 §3.4`)
- Variant D (adopted): **47 / 47 consistent.** All 40 room robots (Executive 1 + 39 in the other six rooms) lie inside their rooms, and all 7 free-roaming robots lie outside every room.
- Per room: Executive 1/1, Marketing 8/8, Engineering 10/10, Creative 5/5, Management 5/5, Research 5/5, QA & Testing 6/6.
- The per-robot floor positions are in the JSON (`robots_floor_positions`), for future placement work. **No robots are part of the greybox.**

## 4. Central atrium

| Element | Value | Source |
|---|---|---|
| Atrium | The open floor inside the ring of rooms. **No explicit atrium boundary is visible** (ENV-001, Low): the plaza blends into the walkway ring | `analysis/02 §4` |
| WORA plinth (ENV-002) | Circular dais, centre (0, 0, 0), radius **2.383 m**, top at Y = **0.12 m** (est.) | Projects to 794.5, 449.9, 217.0 × 102.4 px (measured 795, 450, 217 × 100) |
| Logo / wordmark (ENV-003/004) | Lie flat on the plinth top | Not greybox |
| Clearance from the plinth rim to each room | QA 4.32 m · Creative 4.36 m · Research 4.52 m · Management 5.43 m · Executive (front corner) 6.42 m · Engineering 8.06 m · Marketing 9.02 m | Derived. **The plinth is not at the centre of the ring**: it is offset towards the camera (+X +Z). That is what the reference shows, so do not "centre" it |

Atrium object bases, for positional continuity only. They are furniture and **not** greybox geometry:

| ID | Object | Floor point (x, z) (est.) |
|---|---|---|
| ENV-005 | Round planter + tree | (−4.30, −1.11) |
| ENV-006 | Curved brown sofa | (−6.50, 0.41) |
| ENV-008 | Rug + ottoman | (−4.38, 1.55) |
| ENV-009 | Brown sofa | (−3.57, −3.64) |
| ENV-010 | Curved bench | (−1.37, −3.72) |
| ENV-011 | Tree planter group | (4.75, −5.13) |
| ENV-012 | Near-corner tree | (9.06, 8.99) |
| ENV-013 | Low cabinets | (10.43, 7.61) |

## 5. Walkways and connections

The walkway ring is the floor between the rooms and the atrium. Its width is ND in the reference (`analysis/03 §2.2`, ≈40–80 px). The derived clearances are:

| Connection (adjacency from `analysis/03 §2.3`) | Min. clearance between footprints | Notes |
|---|---:|---|
| Marketing ↔ Executive Office | 2.44 m | |
| Executive Office ↔ Engineering | 1.76 m | |
| Marketing ↔ Creative Studio | 4.93 m | Left-side walkway. (ROBOT-041, free-roaming, stands on the walkway in front of Marketing at (−8.42, 0.82)) |
| Engineering ↔ Management | 2.18 m | |
| Creative Studio ↔ Research | 2.40 m | |
| Research ↔ QA & Testing | 1.90 m | **Near-corner corridor.** The Research and QA signs face each other across it, and ENV-012 (tree) stands at its mouth (9.06, 8.99) |
| QA & Testing ↔ Management | 5.68 m | Right-side walkway with the ENV-011 planters. ROBOT-047 stands in it at (12.22, −1.41) |
| Rooms ↔ +X slab edge | 0.9–2.6 m | Management x₁ 13.44 and QA x₁ 13.20 vs edge x≈14.3–15.8 |
| Creative Studio ↔ +Z slab edge | ≈0 m | Creative z₁ 14.03 vs edge z≈13.91: the room meets the building edge |
| Research ↔ +Z slab edge | ≈1.5 m | |

**Doors and openings: ND (Q-3D-01).** No door leaf, frame or opening is identifiable. The greybox has **no openings**. Openings needed later for navigation must stay invisible from the reference camera and need owner approval.

## 6. Building footprint, slab edges and hidden extents

| Edge | Status | Value |
|---|---|---|
| +Z edge (lower-left on screen, ENV-014 above) | Visible from about x −5.9 to 4.4 | **z ≈ 13.91**. Deviates from the X axis by only 0.5° (crop estimate) to 3.7° (Hough segment): consistent with the grid. Balustrade ≈1.27 m on top |
| +X edge (lower-right on screen, ENV-015 above) | Visible from about z −9.4 to 3.4 | **x ≈ 14.3–15.8**. On screen it runs 3–9° steeper than the grid predicts: an **unresolved residual** (Q-3D-04 / Q-ARCH-05). The greybox uses a grid-aligned edge at x = 14.6 |
| −X edge (behind the sidebar) | **ND** | Must be ≤ −17.18 (Marketing x₀) |
| −Z edge (behind the status strip / Live Activity) | **ND** | Must be ≤ −15.30 (Engineering z₀) |
| Near (+X +Z) corner | **ND**: behind the Executive Command panel | Lies beyond (13.2, 12.5) |
| Lower storeys | Visible below both slab edges (≥2 per side, count ND) | Facade bands only (`analysis/03 §2.1`) |
| Roof | None (cutaway) | — |

**Hidden content rule (Q-3D-08).** You may extend the floor slab, rooms and facade into hidden regions for continuity. In the reference camera state, every such extension must project behind a UI panel or outside the frame. Check this with the occlusion test in `05 §3.7`.

## 7. Walls, glass partitions and balustrades (architecture level)

| Element | Where | Greybox representation | Final-look notes (owner: 3D Artist) |
|---|---|---|---|
| Room partitions | All four sides of every room footprint, height 2.07 m | Thin vertical planes or boxes. **Thickness ND** (reads as thin glass + slim frames); use a 0.05 m placeholder | Clear glass with dark anthracite frames; white solid segments where visible; walnut slats on the Executive back wall (`analysis/03 §2.2`) |
| Glass balustrades | Along the visible +Z and +X slab edges, ≈1.27 m | Thin planes | `analysis/03 §2.2` also mentions balustrades between the atrium and Research / QA and in front of the Executive Office / Engineering; their exact lines are ND (Q-3D-02) |
| Light strips (Q-3D-07) | Partition tops and floor edges | Not in the greybox | Emissive vs specular is undecided |
| Floor slab | One level, Y = 0 | Box from the slab top down to −0.3 m (est. thickness ND), bounded by the edges in §6 | Polished terrazzo |

## 8. Elevation changes

| Element | Elevation | Confidence |
|---|---|---|
| Main floor, rooms, walkways, atrium | Y = 0 | Medium. No level change measured (Q-3D-02) |
| WORA plinth top | Y = 0.12 (est.) | Medium |
| Partition tops | Y = 2.07 | Medium |
| Balustrade tops | Y ≈ 1.27 | Low–Medium |
| Lower storeys | Below Y = 0, storey height ND | — |
