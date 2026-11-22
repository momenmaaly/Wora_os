# 07 — Uncertainties and Open Questions: WORA Main Workspace

> Reference: `reference/wora-main-workspace.png` (SHA-256 `6f91ff3d…718036a1`). The image is the authority.
> This file lists everything that **cannot be determined confidently from the image**. Implementers must not resolve these by guessing or by redesigning. Each item has a **safe interim rule** that stays faithful to what is visible, until the project owner decides.

Severity: **S1** = blocks exact fidelity of a visible element; **S2** = affects detail/QA tolerance; **S3** = informational.

## 1. UI

| ID | Question | What is visible | Why uncertain | Safe interim rule | Sev. | Owner decision needed |
|---|---|---|---|---|---|---|
| Q-UI-01 | Are the trailing ellipses in `Search across your company…` and `Tell your company what to do…` one "…" (U+2026) or three periods? | Three tight dots | Indistinguishable at this resolution | Use whichever renders with identical dot spacing in the chosen font; record the choice | S3 | Yes |
| Q-UI-02 | `Live` label: is the leading "L" a letter fused with a green dot, a dot followed by "ive", or a dot + "Live" overlapping? | A filled green half-disc shape merges into the "L" stem | Rendering artefact or intentional glyph | Render visually identical (green dot + `Live`), compare by overlay; do not change the wording | S2 | Yes |
| Q-UI-03 | What is the faint glyph at the right end of the search field (1093,31)? | A tiny "◇"/"<>"-like mark, very low contrast | Too small and faint | Reproduce the same faint glyph shape/opacity; give it no new function | S2 | Yes |
| Q-UI-04 | What is the faint teal mark inside the upgrade card's top-left (≈34–44, 740–752)? | A barely visible teal shape | Very low contrast | Reproduce at the same faintness, or omit only with owner approval | S3 | Yes |
| Q-UI-05 | What is the chevron-like glyph at the brand header's right (270,31), and what does it do? | `›`-like glyph with an extra stroke | Shape ambiguous; function not visible | Reproduce the glyph; any behaviour needs the Interaction Engineer + owner | S2 | Yes |
| Q-UI-06 | Exact font family/weights | Neo-grotesque sans similar to Roboto/Inter | Cannot identify from raster with certainty | Shortlist Roboto and Inter; pick by overlay of `Company Overview`, `Executive Command`, `WORA` | S1 | Yes |
| Q-UI-07 | Icon library | Simple rounded solid/duotone glyphs | No identifiable library | Match glyph silhouettes by overlay; do not substitute "similar" icons without checking | S2 | Yes |
| Q-UI-08 | Executive Command panel bottom: does it continue below the frame or end with rounded corners just at the edge? | Dark panel down to y = 941 | Edge coincides with the image border | Panel extends to the viewport bottom; bottom corners not visible | S3 | No (default OK) |
| Q-UI-09 | Exact translucency/blur of panels | Mostly opaque; view switcher slightly translucent | Cannot separate translucency from colour | Opaque surfaces with the sampled colours; switcher at sampled appearance | S2 | Yes |
| Q-UI-10 | Exact corner radii and shadow parameters | Rounded panels with dark edges | Anti-aliasing at 1× limits precision | Use the `05 §3` estimates; tune by overlay | S2 | No |

## 2. Assets

| ID | Question | Safe interim rule | Sev. |
|---|---|---|---|
| Q-ASSET-01 | Source vector for the WORA logo mark (UI-001, ENV-003) and wordmark | **Do not crop the reference.** Request the original logo files from the owner. A temporary vector must be traced and approved before use | S1 |
| Q-ASSET-02 | Source photo for the user avatar (UI-063, "Momen Maaly") | **Do not crop the reference.** Request the original photo from the owner | S1 |
| Q-ASSET-03 | Source art for UI robot avatars (Live Activity ×4, Executive Command ×1) | Request from the owner, or render from the approved 3D robot model at matching angles. The Video Producer avatar is turned three-quarter right | S2 |
| Q-ASSET-04 | Content of in-scene screens (charts, code, world map, artwork, check mark) | Reproduce the visible composition (colour, layout, motif) as real textures/UI; exact pixel content is ND | S2 |

## 3. 3D environment

| ID | Question | What is visible | Safe interim rule | Sev. |
|---|---|---|---|---|
| Q-3D-01 | Where are the room doors/entrances? | No door leaf or frame clearly identifiable | Do not add visible doors. If navigation requires openings, get owner approval for placements that are invisible from the reference camera | S2 |
| Q-3D-02 | Is there a level change between the atrium and the rooms (the balustrades suggest an edge)? | Glass balustrades along walkway edges; floors look level | Keep one level; balustrades as visible | S2 |
| Q-3D-03 | Perspective vs orthographic; do vertical edges converge? | Scale nearly constant; verticals not measured conclusively | Narrow-FOV perspective solved against anchors (`03 §9.3`) | S2 |
| Q-3D-04 | The camera cues conflict: plinth ellipse ⇒ ≈27° elevation, slab edges ⇒ ≈41–68° | Generated-image geometry may be inconsistent | Solve numerically against the anchors. Report residuals; **do not change the layout** to hide them | S1 |
| Q-3D-05 | Are U-01 (desk figurine ≈(827,235)), U-02 (white object among the Management plants ≈(1400,447)) and U-03 (white/blue object behind a Creative Studio monitor ≈(436,528)) robots? | Small robot-like white shapes, partly hidden | Reproduce each as the visible object (figurine / small white object / rounded white-blue object) without counting it as an AI employee | S2 |
| Q-3D-06 | Is there depth of field / tilt-shift blur? | The top band looks slightly softer | Optional subtle DOF only if the overlay shows the same softness; otherwise none | S3 |
| Q-3D-07 | Are the white lines along the partition tops/floor edges emissive LED strips or specular highlights? | Bright thin white lines | Treat as thin emissive strips matched to the reference brightness | S2 |
| Q-3D-08 | Content hidden behind UI panels (left of x 235, behind Live Activity, behind the status strip/search, behind the command panel) | Not visible | **ND.** Model only what is needed for continuity. Hidden parts must not become visible in the reference camera state | S2 |
| Q-3D-09 | Number of storeys, full exterior, wider site | Lower storeys partly visible; trees outside | Model enough facade to match the visible regions; no new visible landmarks | S3 |
| Q-3D-10 | Exact room floor plans and wall lengths | Envelopes only (glass, occlusion) | Derive from the camera solve; adjust until projections match `02 §4` | S2 |
| Q-3D-11 | Robot ear-disc colours on robots where the side is not visible | Mostly blue; ROBOT-046 orange-red | Blue default where not visible; ROBOT-046 orange-red | S3 |
| Q-3D-12 | The exact objects on desks (papers, devices) | Small blurred items | Approximate small props at matching density; no new hero props | S3 |

## 4. Design system

| ID | Question | Facts | Safe interim rule | Sev. |
|---|---|---|---|---|
| Q-DS-01 | Are there source design tokens (colours, type scale, radii)? | None exist in the repository; all `05` values are sampled/estimated from the raster | Use the `05` values as provisional tokens; replace only with owner-provided tokens that reproduce the reference | S3 |
| Q-DS-02 | Do the floating panels use backdrop blur (frosted glass)? | No clear blur evidence; most panels look opaque | No blur, unless an overlay comparison shows a closer match with it | S2 |

## 5. Data and behaviour

| ID | Question | Facts | Safe interim rule | Sev. |
|---|---|---|---|---|
| Q-DATA-01 | The status strip shows `24` AI Employees, but **47** robots are visible in the scene | Both are visible facts | Reproduce **both** exactly as shown. Do not reconcile without the owner | S1 |
| Q-DATA-02 | Do the Live Activity agents (`Marketing Agent`, `Dev Agent`, `Reviewer Agent`, `Video Producer`) map to specific scene robots? | No visible link | No mapping implied | S3 |
| Q-DATA-03 | Do the `08` Working / `03` Waiting / `01` Blocked counts correspond to specific robots? | No robot shows a status indicator | No per-robot status visuals may be added without approval | S2 |
| Q-INT-01 | Hover/focus/pressed/open states, menus, transitions, camera controls, Floor Plan / Live View appearance | Not visible | Out of scope for this spec. The Interaction & State Engineer must propose them and the owner approve them. The reference state must stay pixel-faithful | S2 |
| Q-RESP-01 | Behaviour at other aspect ratios (e.g. 4:3, ultrawide) | Only a 16:9 reference exists | Use the normalised coordinates for 16:9 scaling. Other ratios need owner direction | S2 |

## 6. Non-uncertainties (explicitly confirmed)

- All visible strings in `01 §3` were read at ≥3× zoom and are confirmed, except the glyph-level items Q-UI-01/02/03/05.
- The 7 department labels and the count of 47 robots were confirmed by zoomed inspection and an overlay cross-check.
- Reference integrity: SHA-256 verified `OK`; the image was read-only throughout the analysis.
