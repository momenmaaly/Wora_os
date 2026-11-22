# 04 — Scene Hierarchy and Technical Architecture: WORA Main Workspace

> Builds on `01` (coordinates), `02` (floor plan) and `03` (camera). Data contract: `data/scene-architecture.json`.
> Scope: architecture and boundaries only. Final materials, furniture, robots, effects and UI are **out of scope** here and owned by later roles (`06 §5`).
> Engine assumption: a WebGL scene graph such as Three.js. **No stack is installed in this repository**; see `06 §2` for the justification and the decision request.

---

## 1. Design principles

1. **Reference first.** The HOME camera and the measured layout are data, not code constants scattered across components. They load from one versioned JSON file (`scene-architecture.json`). Changes go through the validation in `05`.
2. **Stable IDs.** Every scene node that corresponds to a Mission 002 element carries its ID: `DEPT-0x`, `SIGN-0x`, `ENV-0xx` or `ROBOT-0xx`. QA can then trace pixels back to the specification.
3. **Layered build.** Greybox (this mission), then the art pass, then dynamic actors, then interaction. Each layer can be toggled off for validation.
4. **3D vs UI separation.** The 3D canvas renders the world, including the department **sign plates**, which are 3D per `analysis/02 §2.2`. All panels (REG-01…08) are DOM overlays above a full-bleed canvas. The scene never draws UI panels, and the UI never draws scene geometry.
5. **Nothing invisible becomes visible.** Hidden-region geometry must stay hidden in HOME (Q-3D-08).

## 2. Scene graph

```
Scene "WORA_MainWorkspace"                         (world = 01 coordinate system, metres, +Y up)
├── Rig_Camera
│   └── Camera_HOME                                 (PerspectiveCamera, 03 §2; mode controller in §6)
├── Rig_Lighting                                    (§4)
│   ├── Light_Key            (directional, warm, from world −Z side ±45°, elevation ND)
│   ├── Light_Fill / Env     (hemisphere or IBL environment, cool exterior / warm interior)
│   └── Light_Practicals     (emissives: plinth rim, light strips*, screens*  — *later layers)
├── Building                                        (static, merged per material in the art pass)
│   ├── Slab_Main            (floor Y=0; edges z≈13.91, x≈14.6; −X/−Z extents hidden, 02 §6)
│   ├── Balustrades          (Balustrade_EdgePlusZ, Balustrade_EdgePlusX; h≈1.27)
│   ├── Facade_Lower         (ENV-014, ENV-015: storeys below the slab edges; art pass)
│   └── Exterior             (ENV-016, ENV-017: trees/greenery outside; art pass)
├── Atrium  "ENV-001"
│   ├── Plinth "ENV-002"     (cylinder r=2.383, h=0.12 at origin)
│   │   ├── LogoMark "ENV-003"       (art pass)
│   │   └── Wordmark "ENV-004"       (art pass)
│   └── Props                (ENV-005…013 at 02 §4 floor points; art pass — NOT greybox)
├── Departments
│   ├── Dept "DEPT-01" Executive Office
│   │   ├── Floor            (footprint plane, Y=0 + 0.001 to avoid z-fighting)
│   │   ├── Partitions       (Wall_X0, Wall_X1, Wall_Z0, Wall_Z1; h=2.07; chamfer ND)
│   │   ├── Sign "SIGN-01"   (plate at its measured screen position; mounting ND)
│   │   ├── Interior         (furniture; art pass)
│   │   └── HitVolume        (invisible box = footprint × 2.07 m, raycast target, §7)
│   ├── Dept "DEPT-02" Marketing        (sign on Wall_X0)
│   ├── Dept "DEPT-03" Engineering      (sign on Wall_Z0)
│   ├── Dept "DEPT-04" Creative Studio  (sign on Wall_X0)
│   ├── Dept "DEPT-05" Management       (sign on Wall_Z0)
│   ├── Dept "DEPT-06" Research         (sign on Wall_X0)
│   └── Dept "DEPT-07" QA & Testing     (sign on Wall_Z0)
├── Actors                                          (dynamic layer; NOT part of this mission)
│   └── Robots               (ROBOT-001…047; InstancedMesh / shared skinned rig; positions in JSON)
└── Debug                                           (dev only; excluded from production builds — P-6)
    ├── ReferenceOverlay     (reference PNG as a screen-space quad at 1672×941, opacity slider)
    ├── AnchorMarkers        (plinth, sign centres, digitised corners, 05 §3)
    └── Grid_2m              (floor grid aligned to X/Z)
```

Node naming: `<Type>_<Qualifier>`, with the Mission 002 ID in `userData.refId`, e.g. `{ refId: "DEPT-06", name: "Research" }`.

## 3. Component boundaries

| Component | Owns | Inputs | Outputs / API | Must not |
|---|---|---|---|---|
| `SceneConfig` (data) | `scene-architecture.json` (camera, footprints, heights, anchors) | Versioned file | Typed, read-only object | Be edited without re-running `05` |
| `CameraRig` | HOME camera, resize rule (`03 §6`), mode transitions | `SceneConfig.camera`, canvas size | `getHome()`, `resetToHome()`, `project(world) → px` | Allow user orbit/zoom by default |
| `BuildingGeometry` | Slab, balustrades, facade, exterior | `SceneConfig.building` | Static meshes | Expose hidden regions in HOME |
| `AtriumGeometry` | Plinth + logo + props | `SceneConfig.atrium` | Static meshes | Move the plinth (it is the origin) |
| `DepartmentGeometry` ×7 | Floor, partitions, sign plate, interior, hit volume per room | `SceneConfig.departments[id]` | Meshes and `HitVolume` per ID | Add doors or openings (Q-3D-01) |
| `LightingRig` | Key, fill/environment, emissive registry | Art direction (`analysis/03 §8`, `05`) | — | Change camera or geometry |
| `ActorSystem` (later) | Robots, animation, instancing | Agent state from the app, JSON positions | Robot transforms; `robot:select` events | Alter room footprints |
| `InteractionLayer` (later) | Raycasting, hover/select | Pointer events, hit volumes | `department:hover/select`, `robot:hover/select` | Own UI state |
| `OverlayBridge` (later) | World→screen anchoring for DOM labels/tooltips | `CameraRig.project` | Screen positions per refId per frame | Render inside the canvas |
| `RenderLoop` | Renderer, tone mapping, post FX, frame scheduling | Everything above | Frames | Run continuously when nothing changes (§5) |

## 4. Lighting architecture (structure only; values come in the art pass)

| Layer | Implementation | Reference evidence |
|---|---|---|
| Key | One `DirectionalLight`, warm. Contact shadows fall to the screen left/lower-left of robot feet, so the light comes from screen right/upper-right. In world terms it arrives from the **−Z side (azimuth ±45°)**; elevation ND (short soft shadows suggest a high sun or a large soft source) | `analysis/03 §8` (Medium–Low) |
| Shadows | Single shadow map (2048²). Fit the shadow camera tightly to the footprint bounds (x −20…16, z −17…15, y 0…3) for crisp contact shadows; soft PCF | Soft, short contact shadows |
| Fill / environment | Hemisphere light or HDR environment map: warm interior, cool blue-grey exterior | Mood (High) |
| Emissives | Plinth rim (bloom), screens, robot eyes, light strips (Q-3D-07 open) | High |
| Reflections | Floor and glass reflections via environment map; planar reflection on the atrium floor is optional (performance budget §5) | High |
| Post | Tone mapping (ACES or AgX), sRGB output, selective bloom. Depth of field off by default (Q-3D-06) | — |

The greybox uses neutral lighting only: a hemisphere light plus one directional key, no post.

## 5. Performance architecture

| Topic | Budget / strategy |
|---|---|
| Target | 60 fps at 1920×1080, device pixel ratio clamped to ≤2, on a mid-range laptop GPU (owner to confirm the target hardware) |
| Draw calls | ≤ 300 in HOME. Merge static geometry per material per department; share materials |
| Robots (47) | One `InstancedMesh` per robot sub-mesh, or a shared skinned rig with GPU skinning. ≤ 15 draw calls total for robots |
| Transparency | Glass partitions sorted per department group; `depthWrite=false`. Keep glass to single planes (no double-sided thick glass) |
| Geometry | Greybox ≈ 200 triangles per room. Art-pass budget ≈ 300k triangles for the whole scene (est.) |
| Textures | KTX2 / Basis compression; ≤ 64 MB GPU texture memory |
| Frame scheduling | HOME is static. Render on demand and only animate when actors move or the UI requests transitions |
| Loading | Greybox first (instant), then the art pass streamed as glTF (Draco/Meshopt) per layer: Building → Departments → Atrium → Actors |
| Precision | Narrow FOV with near 1 m and far 400 m gives ample depth precision. No logarithmic depth buffer needed |

## 6. Camera mode controller

```
state: HOME (default) ─┬─► FOCUS(deptId)  [optional, needs approval]
                       └─► (Floor Plan / Live View tabs: ND, separate design)
any state ──resetToHome()──► HOME  (exact values from SceneConfig.camera; tween ≤ 600 ms est.)
```
HOME is the only state validated against the reference. Visual QA always runs in HOME.

## 7. Frontend ↔ scene interaction contract (proposal for the Interaction & State Engineer)

```ts
interface WorkspaceScene {
  // lifecycle
  mount(canvas: HTMLCanvasElement, config: SceneConfig): void;
  resize(widthCss: number, heightCss: number, dpr: number): void;   // applies 03 §6 rule
  dispose(): void;
  // camera
  resetToHome(): void;
  project(world: [number, number, number]): { x: number; y: number; visible: boolean }; // CSS px
  // departments
  setDepartmentHighlight(ids: DeptId[]): void;     // visual state only
  onDepartmentHover(cb: (id: DeptId | null) => void): Unsubscribe;
  onDepartmentSelect(cb: (id: DeptId) => void): Unsubscribe;
  // actors (later)
  setRobotState(id: RobotId, state: { activity?: string; status?: 'working'|'waiting'|'blocked' }): void;
}
type DeptId = 'DEPT-01'|'DEPT-02'|'DEPT-03'|'DEPT-04'|'DEPT-05'|'DEPT-06'|'DEPT-07';
```
- Picking uses the per-department `HitVolume` boxes, which are the footprints from `02 §3`, not the visual meshes. Hits are then stable and cheap.
- Pointer events reach the canvas only where no DOM panel covers it. Panels stop propagation.
- The scene emits events. The app store (e.g. a small state container) owns selection and UI state; the scene never reads UI state directly.
- Mapping agents to robots is a data question (**Q-DATA-01**: the UI shows "24 AI Employees", the scene shows 47 robots). It is not solved here.

## 8. Geometry organisation and asset pipeline

| Asset | Source | Format | Pivot / units |
|---|---|---|---|
| Greybox | Generated procedurally from `scene-architecture.json` | Runtime meshes | World metres, origin at the plinth |
| Department interiors | 3D Artist (DCC) | glTF 2.0 per department: `dept-0x.glb` | Exported in **world coordinates** (no per-file offset), so a file drops into place |
| Building / facade / exterior | 3D Artist | `building.glb`, `exterior.glb` | World coordinates |
| Atrium props | 3D Artist | `atrium.glb` | World coordinates; placed at the `02 §4` floor points |
| Robots | Character pipeline (later) | `robot.glb` (one rig) + instance table | Local origin at the feet; placed from `robots_floor_positions` |
| Reference overlay | `reference/wora-main-workspace.png` (read-only, never modified) | Loaded as-is in the Debug layer | Screen space 1672×941 |
