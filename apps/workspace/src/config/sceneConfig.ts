/**
 * Typed access to the Mission 003 architecture data.
 *
 * Single source of truth: docs/design/main-workspace/architecture/data/scene-architecture.json
 * (schema wora-main-workspace-architecture/v1). Nothing in this file adds, moves or resizes
 * geometry; it only types and checks the approved values.
 */
import architecture from '@architecture/scene-architecture.json';
import measurements from '@analysis/measurements.json';

export type Vec3 = [number, number, number];
export type DeptId = 'DEPT-01' | 'DEPT-02' | 'DEPT-03' | 'DEPT-04' | 'DEPT-05' | 'DEPT-06' | 'DEPT-07';
export const DEPT_IDS: DeptId[] = ['DEPT-01', 'DEPT-02', 'DEPT-03', 'DEPT-04', 'DEPT-05', 'DEPT-06', 'DEPT-07'];

export interface Footprint { x0: number; x1: number; z0: number; z1: number }

export interface DepartmentConfig {
  id: DeptId;
  name: string;
  footprint: Footprint;
  partitionHeight: number;
  sign: { id: string; wall: string; anchorWorld: Vec3; screenPx: [number, number] };
  occludedSides: string[];
  projectedFloorCornersPx: [number, number][];
  measuredEnvelopePx: [number, number, number, number];
  notes?: string;
}

export interface CameraConfig {
  position: Vec3;
  target: Vec3;
  up: Vec3;
  fovVerticalDeg: number;
  near: number;
  far: number;
  focalPxAt941: number;
  principalPointPx: [number, number];
}

/** Reference frame of the locked image (1672 × 941). */
export const REFERENCE = { width: 1672, height: 941, sha256: architecture.reference.sha256 } as const;

const EXPECTED_SCHEMA = 'wora-main-workspace-architecture/v3';
if (architecture.schema !== EXPECTED_SCHEMA) {
  throw new Error(`scene-architecture.json schema mismatch: ${architecture.schema} (expected ${EXPECTED_SCHEMA})`);
}

const cam = architecture.camera;
export const CAMERA: CameraConfig = {
  position: cam.position as Vec3,
  target: cam.target as Vec3,
  up: cam.up as Vec3,
  fovVerticalDeg: cam.fov_vertical_deg,
  near: cam.near,
  far: cam.far,
  focalPxAt941: cam.focal_px_at_941,
  principalPointPx: cam.principal_point_px as [number, number],
};

type RawDept = (typeof architecture.departments)['DEPT-01'];
const rawDepts = architecture.departments as Record<DeptId, RawDept & { notes?: string }>;

export const DEPARTMENTS: DepartmentConfig[] = DEPT_IDS.map((id) => {
  const d = rawDepts[id];
  return {
    id,
    name: d.name,
    footprint: d.footprint,
    partitionHeight: d.partition_height,
    sign: {
      id: d.sign.id,
      wall: d.sign.wall,
      anchorWorld: d.sign.anchor_world as Vec3,
      screenPx: d.sign.screen_px as [number, number],
    },
    occludedSides: d.occluded_sides,
    projectedFloorCornersPx: d.projected_floor_corners_px as [number, number][],
    measuredEnvelopePx: d.measured_envelope_px as [number, number, number, number],
    notes: d.notes,
  };
});

const plinth = architecture.atrium.plinth;
export const PLINTH = {
  centre: plinth.centre as Vec3,
  radius: plinth.radius,
  topY: plinth.top_y,
  measuredPx: plinth.measured_px as [number, number, number, number],
};

/** Visible slab edges (02 §6). The −X / −Z edges are ND and are NOT invented (see model.ts). */
export const SLAB = {
  edgePlusZ: architecture.building.slab_edges['+Z (lower-left on screen)'].z,
  edgePlusZVisibleX: architecture.building.slab_edges['+Z (lower-left on screen)'].visible_x as [number, number],
  /** 02 §6 / 05 G-01: grid-aligned +X edge adopted at x = 14.6 (measured range 14.3–15.8, Q-ARCH-05). */
  edgePlusX: 14.6,
  edgePlusXRange: architecture.building.slab_edges['+X (lower-right on screen)'].x_range as [number, number],
  edgePlusXVisibleZ: architecture.building.slab_edges['+X (lower-right on screen)'].visible_z as [number, number],
  floorY: architecture.building.floor_level_y,
};

export const SCALE = {
  partitionHeight: architecture.scale.derived.partition_height_m,
  balustradeHeight: architecture.scale.derived.balustrade_height_m,
  plinthHeight: architecture.scale.derived.plinth_height_m,
  assumption: architecture.scale.assumption,
};

export interface RobotPosition { id: string; zone: string; headPx: [number, number]; assumedHeadH: number; floorXZ: [number, number] }
export const ROBOT_POSITIONS: RobotPosition[] = architecture.robots_floor_positions.map((r) => ({
  id: r.id,
  zone: r.zone,
  headPx: r.head_px as [number, number],
  assumedHeadH: r.assumed_head_h,
  floorXZ: r.floor_xz as [number, number],
}));

export interface MeasuredElement { id: string; name: string; x: number; y: number; w: number; h: number; cx: number; cy: number; conf: string }
export const MEASURED: Record<string, MeasuredElement> = Object.fromEntries(
  (measurements.elements as MeasuredElement[]).map((e) => [e.id, e]),
);

/** UI regions that occlude the 3D canvas in the reference (02 §2). Used for occlusion-parity checks only. */
export const UI_OCCLUDERS = ['REG-01', 'REG-02', 'REG-04', 'REG-05', 'REG-06', 'REG-07', 'REG-08'].map((id) => MEASURED[id]);

export const ARCHITECTURE = architecture;

/* ── Mission 006-A environment (schema v2 `environment` section) ─────────────── */

export const ENV = architecture.environment;

/**
 * Fascia-bottom profiles (scene-architecture.json `environment.fascia`, least-squares fits of the
 * 2026-11-20 probe). Each edge: 0 before the vanish point, the fitted line over the measured range,
 * then a linear blend to the shared corner depth −2.3 m (occluded by REG-07; mean of the two
 * edge-fit extrapolations to the corner).
 */
export function fasciaPlusXBot(z: number): number {
  if (z <= -6.114) return 0;
  if (z <= 3.4) return -0.8983 - 0.1469 * z;
  const t = (z - 3.4) / (13.91 - 3.4);
  return -1.3978 + t * (-2.3 + 1.3978);
}
export function fasciaPlusZBot(x: number): number {
  if (x <= -11.589) return 0;
  if (x <= 4.4) return -0.7492 - 0.0646 * x;
  const t = (x - 4.4) / (14.6 - 4.4);
  return -1.0334 + t * (-2.3 + 1.0334);
}

/* ── VF-2/VF-3 interiors (schema v3 `interiors` section, 2026-11-20) ──────────── */

export interface InteriorItem {
  id: string;
  kind: string;
  dept: string | null;
  px_box: [number, number, number, number] | null;
  floor_xz: [number, number] | null;
  size: [number, number, number] | null;
  rot_y?: number;
  centre_y?: number;
  wall?: string;
  prov: { pos?: string; size?: string; catalog: string };
}

/** Furniture/large-display placements (analysis/03 §3–§6 via the HOME inverse projection). */
export const INTERIORS: InteriorItem[] = (architecture.interiors as unknown as { items: InteriorItem[] }).items;

/* ── VF-4 robot visual reconstruction (schema v3 `robot_visual` section) ─────── */

export type RobotPose = 'seated' | 'standing' | 'walking';
export type RobotFacing = 'cam' | 'left' | 'right' | 'back';

export interface RobotVisual {
  id: string;
  zone: string;
  headPx: [number, number];
  floorXZ: [number, number];
  pose: RobotPose;
  facing: RobotFacing;
  pxBox: [number, number, number, number];
  /** [width, height] derived from the §5.2 visible box (height reference only; geometry anchors to assumedHeadH) */
  sizeM: [number, number];
}

export const ROBOT_VISUAL: RobotVisual[] = (architecture.robot_visual as unknown as {
  rows: { id: string; zone: string; head_px: [number, number]; floor_xz: [number, number]; pose: RobotPose; facing: RobotFacing; px_box: [number, number, number, number]; size_m: [number, number] }[];
}).rows.map((r) => ({
  id: r.id,
  zone: r.zone,
  headPx: r.head_px,
  floorXZ: r.floor_xz,
  pose: r.pose,
  facing: r.facing,
  pxBox: r.px_box,
  sizeM: r.size_m,
}));
