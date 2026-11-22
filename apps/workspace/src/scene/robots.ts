/**
 * VF-4 robot visual reconstruction (owner-approved Visual Foundation Completion Plan, 2026-11-20).
 * Stylised low-poly reconstruction (approved default Q-VF-04) of the 47 catalogued robots
 * (analysis/03 §5.1–§5.2): glossy white shell, black glass visor, emissive cyan eyes, blue ear
 * discs, blue torso accent; dark navy vest for ROBOT-041/044/045; tablets with glowing screens for
 * the free-roaming robots. Every placement/pose/facing comes from scene-architecture.json
 * `robot_visual` (pose + facing MEASURED from §5.2; width FIT-derived from the §5.2 visible box;
 * geometry height anchored to the M003 assumed_head_h so the floor solve stays exact).
 *
 * Deliberate stylisation (documented, EST.): limbs and the expressive eye shapes are reduced to
 * simple primitives; ROBOT-046's orange-red ear disc uses the leather token (no red token in the
 * catalogued palette); no antennas except ROBOT-046 (§5.1: antenna ND on the others).
 */
import { ROBOT_VISUAL, type RobotVisual } from '../config/sceneConfig';
import type { BoxSpec, CylinderSpec, PrimitiveSpec, SphereSpec } from './model';

type P = PrimitiveSpec;

let seq = 0;
function box(material: BoxSpec['material'], center: [number, number, number], size: [number, number, number], rotationY = 0, keyPrefix = 'R'): BoxSpec {
  seq += 1;
  return { key: `${keyPrefix}-${seq}`, kind: 'box', material, center, size, rotationY };
}
function cyl(material: CylinderSpec['material'], center: [number, number, number], radius: number, height: number, segments = 14): CylinderSpec {
  seq += 1;
  return { key: `R-${seq}`, kind: 'cylinder', material, center, radius, height, segments };
}
function sphere(material: SphereSpec['material'], center: [number, number, number], radius: number): SphereSpec {
  seq += 1;
  return { key: `R-${seq}`, kind: 'sphere', material, center, radius };
}

/** Yaw so the robot's local +Z (visor) points according to the catalogued facing class (EST. for side/back classes). */
function facingYaw(f: RobotVisual['facing'], x: number, z: number, camX: number, camZ: number): number {
  const toCam = Math.atan2(camX - x, camZ - z);
  switch (f) {
    case 'cam':
      return toCam;
    case 'back':
      return toCam + Math.PI;
    case 'left':
      return toCam - Math.PI / 2;
    case 'right':
      return toCam + Math.PI / 2;
  }
}

const VEST_ROBOTS = new Set(['ROBOT-041', 'ROBOT-044', 'ROBOT-045']); // §5.2: dark navy vest/jacket
const TABLET_ROBOTS = new Set(['ROBOT-041', 'ROBOT-043', 'ROBOT-044', 'ROBOT-045', 'ROBOT-046', 'ROBOT-047']); // §5.2 props
const CAMERA_POS: [number, number] = [60.675, 61.964]; // HOME camera XZ (approved solve)

export function buildRobots(): P[] {
  seq = 0;
  const out: P[] = [];
  for (const r of ROBOT_VISUAL) {
    const [x, z] = r.floorXZ;
    const yaw = facingYaw(r.facing, x, z, CAMERA_POS[0], CAMERA_POS[1]);
    const shell = VEST_ROBOTS.has(r.id) ? 'sign' : 'robot-shell'; // vest: dark navy (sign-plate token)
    const group: P[] = [];

    // Reset re-anchor (see robot_visual prov): head-top heights seated 1.41 m / standing-walking
    // 1.45 m — the reference shows seated heads clearly above desk-monitor tops, which the M003
    // 0.95 m assumption contradicted. Floors were re-solved from the same head-px rays.
    const seated = r.pose === 'seated';
    const headTop = seated ? 1.41 : 1.45;
    const headR = seated ? 0.28 : 0.3; // pronounced chibi: head ≈ 0.56–0.6 m across (ref-measured)
    const headCY = headTop - headR;
    const torsoR = seated ? 0.21 : 0.22;
    const torsoBase = seated ? 0.45 : 0.42; // seated hips on the chair seat; standing above legs
    const torsoTop = 0.85;

    if (!seated) {
      // short legs (standing/walking poses)
      const legH = 0.42;
      const lx = 0.12;
      group.push(cyl('robot-shell', [x + Math.cos(yaw) * lx, legH / 2, z - Math.sin(yaw) * lx], 0.06, legH));
      group.push(cyl('robot-shell', [x - Math.cos(yaw) * lx, legH / 2, z + Math.sin(yaw) * lx], 0.06, legH));
    }
    // torso
    const torsoH = torsoTop - torsoBase;
    if (torsoH > 0.05) group.push(cyl(shell, [x, torsoBase + torsoH / 2, z], torsoR, torsoH));
    // torso accent panel (blue) / cravat accent
    if (!VEST_ROBOTS.has(r.id)) {
      const ax = x + Math.sin(yaw) * (torsoR + 0.012);
      const az = z + Math.cos(yaw) * (torsoR + 0.012);
      group.push(box('screen', [ax, torsoBase + torsoH * 0.62, az], [torsoR * 1.1, torsoH * 0.4, 0.02], yaw));
    }
    // arms (small white cylinders at the torso sides; hands as tiny spheres) — EST. simplification
    for (const side of [-1, 1] as const) {
      const ax = x + Math.cos(yaw) * side * (torsoR + 0.05);
      const az = z - Math.sin(yaw) * side * (torsoR + 0.05);
      const armTop = torsoTop;
      const armLen = 0.28;
      group.push(cyl('robot-shell', [ax, armTop - armLen / 2, az], 0.05, armLen, 10));
      group.push(sphere('robot-shell', [ax, armTop - armLen - 0.03, az], 0.06));
    }
    // head (chibi, wider than tall)
    group.push(sphere('robot-shell', [x, headCY, z], headR));
    // visor: wraparound black glass plate protruding from the head front (ref visors span most
    // of the face; the previous recessed plate read as a dot on the enlarged head)
    // review R8: the visor front was coplanar with the head sphere (hidden → heads read as plain
    // eggs); protrude it clearly past the sphere surface like the reference's wraparound visor
    const vx = x + Math.sin(yaw) * (headR * 0.86);
    const vz = z + Math.cos(yaw) * (headR * 0.86);
    group.push(box('robot-visor', [vx, headCY - headR * 0.02, vz], [headR * 1.42, headR * 0.92, headR * 0.6], yaw));
    // emissive eyes on the visor front
    for (const side of [-1, 1] as const) {
      const ex = x + Math.sin(yaw) * (headR * 1.14) + Math.cos(yaw) * side * headR * 0.42;
      const ez = z + Math.cos(yaw) * (headR * 1.14) - Math.sin(yaw) * side * headR * 0.42;
      group.push(sphere('robot-eye', [ex, headCY + headR * 0.1, ez], 0.085));
    }
    // ear discs (blue; ROBOT-046 orange-red → leather token)
    const earMat = r.id === 'ROBOT-046' ? ('leather' as const) : ('screen' as const);
    for (const side of [-1, 1] as const) {
      const ex = x + Math.cos(yaw) * side * (headR + 0.015);
      const ez = z - Math.sin(yaw) * side * (headR + 0.015);
      group.push(cyl(earMat, [ex, headCY, ez], 0.075, 0.03, 12));
    }
    // antenna nub (§5.1: visible on ROBOT-046, ND on the others)
    if (r.id === 'ROBOT-046') group.push(cyl('screen', [x, headTop + 0.05, z], 0.02, 0.08, 8));
    // tablet with glowing screen (free-roaming robots)
    if (TABLET_ROBOTS.has(r.id)) {
      const tx = x + Math.sin(yaw) * (torsoR + 0.16);
      const tz = z + Math.cos(yaw) * (torsoR + 0.16);
      group.push(box('frame', [tx, torsoBase + torsoH * 0.55, tz], [0.02, 0.26, 0.18], yaw));
      group.push(box('screen', [tx + Math.sin(yaw) * 0.012, torsoBase + torsoH * 0.55, tz + Math.cos(yaw) * 0.012], [0.015, 0.22, 0.15], yaw));
    }
    for (const s of group) s.refId = r.id;
    out.push(...group);
  }
  return out;
}
