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
    const H = r.pose === 'seated' ? 0.95 : 1.2; // M003 assumed_head_h (keeps the floor solve exact)
    const W = r.sizeM[0];
    const yaw = facingYaw(r.facing, x, z, CAMERA_POS[0], CAMERA_POS[1]);
    const shell = VEST_ROBOTS.has(r.id) ? 'sign' : 'robot-shell'; // vest: dark navy (sign-plate token)
    const group: P[] = [];

    const headR = 0.21 * H; // head ≈ 42 % of total height (§5.1)
    const headCY = H - headR;
    const torsoR = 0.16 * H;
    const base = r.pose === 'seated' ? 0.3 : 0.3; // seated on chair/ottoman base; standing legs below
    const torsoTop = headCY - headR * 0.55;

    if (r.pose !== 'seated') {
      // short legs
      const legH = 0.3 * H;
      const lx = 0.09 * W;
      group.push(cyl('robot-shell', [x + Math.cos(yaw) * lx, legH / 2, z - Math.sin(yaw) * lx], 0.055 * H, legH));
      group.push(cyl('robot-shell', [x - Math.cos(yaw) * lx, legH / 2, z + Math.sin(yaw) * lx], 0.055 * H, legH));
    }
    // torso
    const torsoH = torsoTop - base;
    if (torsoH > 0.05) group.push(cyl(shell, [x, base + torsoH / 2, z], torsoR, torsoH));
    // torso accent panel (blue) / cravat accent
    if (!VEST_ROBOTS.has(r.id)) {
      const ax = x + Math.sin(yaw) * (torsoR + 0.012);
      const az = z + Math.cos(yaw) * (torsoR + 0.012);
      group.push(box('screen', [ax, base + torsoH * 0.62, az], [torsoR * 1.1, torsoH * 0.4, 0.02], yaw));
    }
    // head (chibi, wider than tall)
    group.push(sphere('robot-shell', [x, headCY, z], headR));
    // visor: black glass plate on the front of the head
    const vx = x + Math.sin(yaw) * (headR * 0.82);
    const vz = z + Math.cos(yaw) * (headR * 0.82);
    group.push(box('robot-visor', [vx, headCY - headR * 0.05, vz], [headR * 1.5, headR * 0.95, headR * 0.35], yaw));
    // emissive eyes on the visor
    for (const side of [-1, 1] as const) {
      const ex = x + Math.sin(yaw) * (headR * 0.98) + Math.cos(yaw) * side * headR * 0.45;
      const ez = z + Math.cos(yaw) * (headR * 0.98) - Math.sin(yaw) * side * headR * 0.45;
      group.push(sphere('robot-eye', [ex, headCY + headR * 0.05, ez], 0.055 * H));
    }
    // ear discs (blue; ROBOT-046 orange-red → leather token)
    const earMat = r.id === 'ROBOT-046' ? ('leather' as const) : ('screen' as const);
    for (const side of [-1, 1] as const) {
      const ex = x + Math.cos(yaw) * side * (headR + 0.015);
      const ez = z - Math.sin(yaw) * side * (headR + 0.015);
      group.push(cyl(earMat, [ex, headCY, ez], 0.07 * H, 0.03, 12));
    }
    // antenna nub (§5.1: visible on ROBOT-046, ND on the others)
    if (r.id === 'ROBOT-046') group.push(cyl('screen', [x, H + 0.05, z], 0.02, 0.08, 8));
    // tablet with glowing screen (free-roaming robots)
    if (TABLET_ROBOTS.has(r.id)) {
      const tx = x + Math.sin(yaw) * (torsoR + 0.16);
      const tz = z + Math.cos(yaw) * (torsoR + 0.16);
      group.push(box('frame', [tx, base + torsoH * 0.55, tz], [0.02, 0.26, 0.18], yaw));
      group.push(box('screen', [tx + Math.sin(yaw) * 0.012, base + torsoH * 0.55, tz + Math.cos(yaw) * 0.012], [0.015, 0.22, 0.15], yaw));
    }
    for (const s of group) s.refId = r.id;
    out.push(...group);
  }
  return out;
}
