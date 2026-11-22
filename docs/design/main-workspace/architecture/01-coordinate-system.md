# 01 — Coordinate System: WORA Main Workspace 3D Environment

> Mission: WORA-3D-ARCH-003 (3D Environment Architect)
> Reference: `reference/wora-main-workspace.png`, 1672×941, SHA-256 `6f91ff3d27f1d69d7189b6d1a599088086bb50048d1c0b492e3ebcdb718036a1` (verified with `sha256sum -c` before and after this work).
> Inputs: `DESIGN-SOURCE.md`, `analysis/01`–`07`, `analysis/ANALYSIS-REPORT.md`, `analysis/data/measurements.json`.
> Machine-readable values: [`data/scene-architecture.json`](data/scene-architecture.json). **If this document and the JSON disagree, the JSON is authoritative.**
> Convention: **(est.)** = estimate, **ND** = not determinable from the reference, **A-xxx** = an explicit assumption (listed in §7).

---

## 1. World frame

| Property | Definition |
|---|---|
| Handedness | Right-handed |
| Up axis | **+Y** (matches Three.js / glTF) |
| Units | **Metres**. The scale comes from assumption **A-SCALE-01** (desk working height = 0.75 m), see §3 |
| Origin | Floor level (**Y = 0**), directly below the centre of the WORA plinth top. The plinth top centre is the screen anchor (903, 500) and sits at world (0, 0.12, 0) |
| Horizontal axes | **X and Z run along the building / partition grid**: the two families of floor and wall lines that appear at roughly ±24° on screen |
| +X | Projects **right-down** on screen (+32.6, +15.4 px per m at the origin). Points towards the Management / QA & Testing side |
| +Z | Projects **left-down** on screen (−32.2, +15.2 px per m at the origin). Points towards the Creative Studio / Research side |
| −X −Z diagonal | Towards the **far corner** (Executive Office, top-centre on screen) |
| +X +Z diagonal | Towards the **camera** and the near corner (bottom-centre, behind the Executive Command panel) |
| +Y | Projects straight **up** on screen (−40.3 px per m at the origin) |
| Main floor | One level at Y = 0. No level change was measured (Q-3D-02 remains open) |

Why the origin is at the plinth:
- The plinth is the highest-confidence 3D anchor in the reference: a sharp ellipse with measured centre (903, 500) and box 795,450,217,100.
- It is also the compositional centre: the Executive Command panel centre is x≈907 and the scene axis is x≈876–912 (`02 §2.1`, `03 §9.1`).
- The origin is **not** the building centre. The building centre is ND because the −X and −Z edges are hidden.

Why the axes follow the building grid:
- Every partition, desk row and balustrade in the reference follows one of the two line families.
- With grid-aligned axes, every room is an axis-aligned box. That is simple for the Scene Builder and lossless for this reference.

```
Plan view (looking down −Y). The camera sits at the bottom-right (+X +Z) and looks towards the top-left (−X −Z).

            −Z
             ^
             |   ENG
     EXEC    |
  -----------+-----------> +X
     MKT     |   MGT
             |      QA
     CRE   RES
             v
            +Z                      CAMERA ↘ (≈ +60.7, +46.5, +62.0)
```
The full-scale plan is in `02 §2`.

## 2. Image (screen) frame

| Property | Definition |
|---|---|
| Canvas | 1672 × 941 px (16:9). This is the full reference frame |
| 3D canvas | **The whole frame.** The 3D viewport is full-bleed (REG-03) and every UI panel floats above it (`02 §2.2`). The camera is defined for the full 1672×941 canvas, **not** for the 1437 px region right of the sidebar |
| Pixel origin | Top-left corner. u grows to the right, v grows downwards |
| Principal point | (836, 470.5), the canvas centre (**A-PP-01**) |
| Normalised coordinates | nu = u / 1672, nv = v / 941. These match `measurements.json` (`nx`, `ny`) |

## 3. Scale

The reference has no absolute dimension, so the scale needs one assumption. Furniture is the only class of objects with a standard real-world size.

| Item | Value | Notes |
|---|---|---|
| **A-SCALE-01** | Desk working height = **0.75 m** | Measured on 4 desks (Research ×2, QA ×2): 35, 32, 31 and 32 px from floor to desktop. Each desk on its own implies 0.80, 0.74, 0.72 and 0.74 m, a spread of about ±5% |
| Derived: partition (glass wall) height | **2.07 m** (2.00–2.14) | Management corner post and mullion (85–88 px). Stylised and lower than a real office (≈2.7 m). Kept as measured |
| Derived: glass balustrade height | ≈1.27 m (est.) | Lower-left balustrade post (54 px) |
| Derived: plinth radius / height | 2.383 m / ≈0.12 m (est.) | The radius matches the measured ellipse width of 217 px. The visible side face is ≈6 px, about 0.15 m. 0.12 m is used |
| Derived: scale on screen | 39.6 px/m (top of frame, y 150) → 45.8 (centre) → 52.2 (bottom, y 800) | A ratio of 1.32. This matches the measured robot-head range of 22→30 px (ratio 1.36, `03 §9.1`) |

**Scale invariance.** Perspective projection does not depend on scale. If the owner chooses another scale, multiply every length **and** the camera position by the same factor and the composition is unchanged. So A-SCALE-01 affects metric dimensions only, never the match to the reference (Q-ARCH-02).

## 4. Camera parameters used by the mappings

These are the solved values from `03-camera-architecture.md` (perspective, A-ROLL-01: roll = 0).

```
f   = 4476.289 px  (at 941 px image height)   → vertical FOV 12.0006°
K   = [[4476.289, 0, 836.0], [0, 4476.289, 470.5], [0, 0, 1]]
C   = (60.675165, 46.538034, 61.964406)        camera position, world metres
R   (world → camera; rows = camera right, camera down, camera forward)
    [[ 0.702522,  0.000000, -0.711662],
     [ 0.331726, -0.884717,  0.327465],
     [-0.629620, -0.466128, -0.621533]]
```
In this convention the camera looks along +forward, with x to the right and y downwards. This is the OpenCV convention. Three.js uses −Z forward, but `PerspectiveCamera.lookAt` with the values in `03 §2` produces exactly the same projection. This was verified to ≤0.3 px (`05 §3.10`).

## 5. Mapping between image and world

### 5.1 World → image (always valid)
```
p_cam = R · (P_world − C)
u = 836.0 + f · p_cam.x / p_cam.z
v = 470.5 + f · p_cam.y / p_cam.z
```

### 5.2 Image → world (requires a known height)
A single pixel defines a ray. A world point is fixed only when its **height Y = h** is known:
```
d = Rᵀ · K⁻¹ · [u, v, 1]ᵀ          (ray direction in world)
t = (h − C.y) / d.y
P = C + t · d
```

### 5.3 Shortcut warning
The linear (affine) approximation `u ≈ 903 + 32.59x + 0.32y − 32.15z`, `v ≈ 505 + 15.41x − 40.27y + 15.21z` is accurate only near the plinth. Over the full floor its error has a median of 23 px and a maximum of 97 px, so **always use the full projection** in §5.1 and §5.2.

### 5.4 Error propagation (at the scene centre)
| Source | Effect in world |
|---|---|
| ±5 px measurement error, horizontal on screen | ≈ ±0.11 m along the screen-horizontal ground direction (X−Z diagonal) |
| ±5 px measurement error, vertical on screen | ≈ ±0.23 m along the view-depth ground direction (X+Z diagonal) |
| Error Δh in the assumed height of a back-projected point | Shifts it ≈ 1.9 · Δh horizontally along the view direction (cot 27.8°) |

The Y direction is the weak one: assumed heights (signs, robot heads) matter more than pixel accuracy.

## 6. Transform strategy for measured elements

Each Mission 002 element (IDs from `measurements.json`) is converted according to its type. **IDs are preserved verbatim** in the scene (`04 §2`).

| Class | Elements | Strategy | Output |
|---|---|---|---|
| T1: floor-contact points | Plinth centre, digitised partition floor corners, slab edges, atrium object bases (ENV-005…013) | Back-project at h = 0, or at h = 0.12 for the plinth top (§5.2) | World point. Accuracy per §5.4 |
| T2: elevated points with an assumed height | Sign-plate centres (h = 2.07 m, **A-SIGN-01**), robot head centres (0.95 m seated / 1.20 m standing, **A-HEAD-01**) | Back-project at the assumed height | World point. These are used as **constraints and checks**, not as final placement (signs) or not placed at all (robots) |
| T3: screen-space envelopes | DEPT-01…07 boxes (`02 §4`) | **Not invertible on their own.** For a 45°-azimuth box the four box edges constrain only three combinations (x₀−z₁, x₁−z₀, x₀+z₀, x₁+z₁ with a+d=b+c). Solved together with the sign walls, robot containment and digitised corners (`02 §3`) | Axis-aligned footprint [x₀,x₁]×[z₀,z₁] with residuals |
| T4: directions | Line families, sign rotations, slab edges | Compared with vanishing directions | Camera orientation; per-element deviation from the grid in degrees |
| T5: UI elements | REG-01…08 and all UI-0xx elements | **Never transformed.** These are screen-space overlays owned by the Frontend UI Architect. They matter for 3D only as occluders (`05 §3.7`) | — |
| T6: hidden or ND content | Anything behind UI panels or outside the frame (Q-3D-08) | Not placed. Continuity geometry is allowed only if it stays hidden from the reference camera (`02 §6`) | — |

## 7. Assumptions used (complete list)

| ID | Assumption | Effect if wrong |
|---|---|---|
| A-SCALE-01 | Desk height 0.75 m | Uniform rescale only. The composition does not change |
| A-PP-01 | Principal point at the canvas centre | The off-centre scene axis (x≈876–912) is reproduced by the camera yaw and target, not by lens shift. If the original render used lens shift, this cannot be recovered from one image |
| A-ROLL-01 | Roll = 0 | Bootstrap interval −1.08…+1.46° includes 0 |
| A-HEAD-01 | Robot head heights 0.95 / 1.20 m | Used only for validation (containment) |
| A-SIGN-01 | Sign centres at partition-top height | Each +0.3 m moves the solved sign walls by 0.35–0.6 m |
| A-EXEC-SYM | Executive Office plan is square | Its aspect is otherwise unconstrained (Q-ARCH-03) |
| A-DIG-01 | Five digitised floor corners, ±5 px | See `05 §3.5` |
