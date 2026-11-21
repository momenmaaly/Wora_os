/**
 * Structural greybox model (architecture/05 §1, elements G-01…G-20) as pure data.
 *
 * Every rendered mesh is generated from these descriptors, and the validation tests project the
 * same descriptors — so what is validated is exactly what is rendered.
 *
 * Rules (Mission 004):
 *  - geometry comes only from scene-architecture.json; nothing is moved to "look better";
 *  - hidden building areas are not invented: the slab stops at the minimum supported extent
 *    on the ND sides (−X: Marketing x0, −Z: Engineering z0);
 *  - no doors, no extra rooms, no furniture, no robots, no decorative materials.
 */
import {
  DEPARTMENTS,
  PLINTH,
  SCALE,
  SLAB,
  type DeptId,
  type DepartmentConfig,
  type Vec3,
} from '../config/sceneConfig';

export type MaterialKey =
  | 'slab'
  | 'mass'
  | 'floor' | 'deck'
  | 'partition'
  | 'balustrade'
  | 'plinth'
  | 'sign'
  // Mission 006-A environment keys (all catalogued in the reference; see scene-architecture.json `environment`)
  | 'fascia'
  | 'facade'
  | 'glazing'
  | 'frame'
  | 'rim'
  | 'strip'
  | 'city'
  | 'parapet'
  | 'foliage'
  // VF-2/VF-3/VF-4 keys (owner-approved Visual Foundation Completion Plan, 2026-11-20):
  // walnut slat wall (#897047 MEASURED), emissive screens, per-type furniture woods/upholstery,
  // concrete planters, and the robot shell/visor/eye tokens (analysis/05 §1.5).
  | 'walnut'
  | 'screen'
  | 'deskwood'
  | 'leather'
  | 'rug'
  | 'bench'
  | 'planter'
  | 'robot-shell'
  | 'robot-visor'
  | 'robot-eye';

export interface BoxSpec {
  key: string;
  refId?: string;
  kind: 'box';
  material: MaterialKey;
  center: Vec3;
  size: Vec3;
  /** rotation about +Y in radians */
  rotationY: number;
}
export interface CylinderSpec {
  key: string;
  refId?: string;
  kind: 'cylinder';
  material: MaterialKey;
  center: Vec3;
  radius: number;
  height: number;
  segments: number;
}
export type PrimitiveSpec = BoxSpec | CylinderSpec | SphereSpec;

/** Sphere (VF-3/VF-4: chibi robot heads, foliage canopies, emissive eyes). */
export interface SphereSpec {
  key: string;
  refId?: string;
  kind: 'sphere';
  material: MaterialKey;
  center: Vec3;
  radius: number;
}

/** Vertical ribbon in a plane parallel to one axis: runs along `axis` at fixed `at`, from yTop(u) down to yBot(u). */
export interface RibbonSpec {
  key: string;
  refId?: string;
  kind: 'ribbon';
  material: MaterialKey;
  axis: 'x' | 'z';
  /** fixed coordinate of the ribbon plane (z when axis='x', x when axis='z') */
  at: number;
  pts: { u: number; yTop: number; yBot: number }[];
}
/** Vertical circular canopy disc (backdrop scenery). */
export interface DiscSpec {
  key: string;
  refId?: string;
  kind: 'disc';
  material: MaterialKey;
  center: Vec3;
  radius: number;
  /** disc normal direction: 'z' faces ±Z, 'x' faces ±X */
  normal: 'x' | 'z';
}
/** Flat textured plane carrying canvas-drawn text (sign faces, plinth wordmark/logo). */
export interface LabelSpec {
  key: string;
  refId?: string;
  kind: 'label';
  text: string;
  /** text colour override (default near-white; plaza wordmark is dark on the bright dais) */
  color?: string;
  /** icon glyph key drawn left of the text (see Greybox sign-face painter) */
  icon?: string;
  center: Vec3;
  /** [width, height] in m */
  size: [number, number];
  rotationY: number;
  /** 'flat' lies on the ground plane (plinth labels); 'upright' faces the plate normal (sign faces) */
  orientation: 'flat' | 'upright';
}

/** Greybox placeholders that are NOT measured (architecture/02 §7, 05 §1). */
export const PLACEHOLDER = {
  slabThickness: 0.3,
  partitionThickness: 0.05,
  balustradeThickness: 0.03,
  floorPlateThickness: 0.02,
  signThickness: 0.05,
  /**
   * Height of the SIGN-01 plate measured frontally: 35 px at the local scale ≈ 0.93 m
   * (architecture/05 G-12…18). Used for all plates.
   */
  signHeight: 0.93,
  /**
   * Depth of the building volume below the slab. The reference shows ≥2 lower storeys under both
   * visible slab edges down to the frame bottom (ENV-014 / ENV-015); storey count is ND. The depth is
   * the minimum that fills those visible facade regions to the frame bottom in HOME
   * (see tests/greybox.test.ts → "building mass covers visible facade"), rounded up.
   */
  massDepth: 11,
} as const;

/**
 * Sign-plate lengths (m), fitted so the projected plate bounding-box width matches the measured
 * sign box width (analysis/02 §4) with plate height 0.93 m (est.). Fit reproduced by tests/greybox.test.ts.
 * SIGN-03 (5.26 m) exceeds the 3.3–4.5 m range estimated in architecture/05 G-12…18 because its
 * measured box is widened by the +5° angle residual at the top-right periphery (05 §3.3).
 */
export const SIGN_LENGTH_M: Record<string, number> = {
  'SIGN-01': 4.12,
  'SIGN-02': 4.06,
  'SIGN-03': 5.26,
  'SIGN-04': 4.37,
  'SIGN-05': 3.94,
  'SIGN-06': 3.17,
  'SIGN-07': 3.61,
};

/** Footprint of the slab that is supported by measurements (no invented extensions). */
export function slabFootprint() {
  const x0 = Math.min(...DEPARTMENTS.map((d) => d.footprint.x0)); // Marketing x0 — minimum supported −X extent
  const z0 = Math.min(...DEPARTMENTS.map((d) => d.footprint.z0)); // Engineering z0 — minimum supported −Z extent
  return { x0, x1: SLAB.edgePlusX, z0, z1: SLAB.edgePlusZ };
}

function box(key: string, material: MaterialKey, center: Vec3, size: Vec3, rotationY = 0, refId?: string): BoxSpec {
  return { key, refId, kind: 'box', material, center, size, rotationY };
}

export interface DepartmentModel {
  id: DeptId;
  name: string;
  config: DepartmentConfig;
  floor: BoxSpec;
  walls: BoxSpec[];
  sign: BoxSpec;
  hitVolume: BoxSpec;
}

export function departmentModel(d: DepartmentConfig): DepartmentModel {
  const { x0, x1, z0, z1 } = d.footprint;
  const h = d.partitionHeight;
  const t = PLACEHOLDER.partitionThickness;
  const cx = (x0 + x1) / 2;
  const cz = (z0 + z1) / 2;
  const sx = x1 - x0;
  const sz = z1 - z0;
  const ft = PLACEHOLDER.floorPlateThickness;
  const walls: BoxSpec[] = [
    // Wall centre lines lie on the footprint lines (02 §3: footprints are floor-level partition lines).
    box(`${d.id}-wall-z0`, 'partition', [cx, h / 2, z0], [sx + t, h, t], 0, d.id),
    box(`${d.id}-wall-z1`, 'partition', [cx, h / 2, z1], [sx + t, h, t], 0, d.id),
    box(`${d.id}-wall-x0`, 'partition', [x0, h / 2, cz], [t, h, sz + t], 0, d.id),
    box(`${d.id}-wall-x1`, 'partition', [x1, h / 2, cz], [t, h, sz + t], 0, d.id),
  ];
  // Sign plate: centre at the back-projected anchor (02 §3), orientation from the sign wall.
  const a = d.sign.anchorWorld;
  const len = SIGN_LENGTH_M[d.sign.id];
  const st = PLACEHOLDER.signThickness;
  let rotationY: number;
  if (d.sign.wall === 'x0') rotationY = Math.PI / 2; // plate parallel to Z, facing +X
  else if (d.sign.wall === 'z0') rotationY = 0; // plate parallel to X, facing +Z
  else rotationY = Math.PI / 4; // SIGN-01: long axis along (+X −Z) (screen-horizontal), normal ≈ (+X +Z) towards the camera
  const sign = box(`${d.sign.id}-plate`, 'sign', [a[0], a[1], a[2]], [len, PLACEHOLDER.signHeight, st], rotationY, d.sign.id);
  return {
    id: d.id,
    name: d.name,
    config: d,
    floor: box(`${d.id}-floor`, 'floor', [cx, ft / 2, cz], [sx, ft, sz], 0, d.id),
    walls,
    sign,
    hitVolume: box(`${d.id}-hit`, 'floor', [cx, h / 2, cz], [sx, h, sz], 0, d.id),
  };
}

export interface GreyboxModel {
  slab: BoxSpec;
  mass: BoxSpec;
  balustrades: BoxSpec[];
  plinth: CylinderSpec;
  departments: DepartmentModel[];
}

export function buildGreyboxModel(): GreyboxModel {
  const f = slabFootprint();
  const sx = f.x1 - f.x0;
  const sz = f.z1 - f.z0;
  const cx = (f.x0 + f.x1) / 2;
  const cz = (f.z0 + f.z1) / 2;
  const T = PLACEHOLDER.slabThickness;
  const bh = SCALE.balustradeHeight;
  const bt = PLACEHOLDER.balustradeThickness;
  return {
    slab: box('slab-main', 'slab', [cx, -T / 2, cz], [sx, T, sz], 0, 'G-01'),
    mass: box('building-mass', 'mass', [cx, -T - PLACEHOLDER.massDepth / 2, cz], [sx, PLACEHOLDER.massDepth, sz], 0, 'ENV-014/015'),
    balustrades: [
      // Only along the two visible slab edges (02 §6–7). None on the ND −X / −Z sides.
      box('balustrade-plusZ', 'balustrade', [cx, bh / 2, f.z1], [sx, bh, bt], 0, 'G-02'),
      box('balustrade-plusX', 'balustrade', [f.x1, bh / 2, cz], [bt, bh, sz], 0, 'G-03'),
    ],
    plinth: {
      key: 'plinth',
      refId: 'ENV-002',
      kind: 'cylinder',
      material: 'plinth',
      center: [PLINTH.centre[0], PLINTH.topY / 2, PLINTH.centre[2]],
      radius: PLINTH.radius,
      height: PLINTH.topY,
      segments: 128,
    },
    departments: DEPARTMENTS.map(departmentModel),
  };
}

/** World-space corners of a box spec (8 points). */
export function boxCorners(b: BoxSpec): Vec3[] {
  const [hx, hy, hz] = b.size.map((s) => s / 2) as Vec3;
  const c = Math.cos(b.rotationY);
  const s = Math.sin(b.rotationY);
  const out: Vec3[] = [];
  for (const dx of [-hx, hx])
    for (const dy of [-hy, hy])
      for (const dz of [-hz, hz]) {
        // three.js rotation about Y: x' = x cos + z sin, z' = −x sin + z cos
        out.push([b.center[0] + dx * c + dz * s, b.center[1] + dy, b.center[2] - dx * s + dz * c]);
      }
  return out;
}

/** Floor corners of a footprint in the order (x0,z0) (x1,z0) (x1,z1) (x0,z1) used by architecture/02 §3. */
export function footprintCorners(d: DepartmentConfig, y = 0): Vec3[] {
  const { x0, x1, z0, z1 } = d.footprint;
  return [
    [x0, y, z0],
    [x1, y, z0],
    [x1, y, z1],
    [x0, y, z1],
  ];
}
