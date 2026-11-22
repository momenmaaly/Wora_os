/**
 * Point pairs for the dev inspector: a world point (projected live by the current camera) and,
 * where one exists, the measured reference px. Same data as the validation tests.
 */
import { DEPARTMENTS, MEASURED, ROBOT_POSITIONS, type Vec3 } from '../config/sceneConfig';
import { DIGITISED_CORNERS } from '../config/referencePoints';

export interface MarkerPair {
  id: string;
  group: 'corner' | 'sign' | 'robot' | 'plinth';
  world: Vec3;
  measuredPx?: [number, number];
}

function cornerWorld(dept: string, corner: string): Vec3 {
  const d = DEPARTMENTS.find((x) => x.id === dept)!;
  const f = d.footprint;
  return [corner.startsWith('x0') ? f.x0 : f.x1, 0, corner.endsWith('z0') ? f.z0 : f.z1];
}

export const MARKERS: MarkerPair[] = [
  { id: 'ENV-002 plinth top centre', group: 'plinth', world: [0, 0.12, 0], measuredPx: [MEASURED['ENV-002'].cx, MEASURED['ENV-002'].cy] },
  ...DIGITISED_CORNERS.map((c) => ({ id: c.name, group: 'corner' as const, world: cornerWorld(c.dept, c.corner), measuredPx: c.px })),
  ...DEPARTMENTS.map((d) => ({
    id: d.sign.id,
    group: 'sign' as const,
    world: d.sign.anchorWorld,
    measuredPx: [MEASURED[d.sign.id].cx, MEASURED[d.sign.id].cy] as [number, number],
  })),
  ...ROBOT_POSITIONS.map((r) => ({
    id: r.id,
    group: 'robot' as const,
    world: [r.floorXZ[0], r.assumedHeadH, r.floorXZ[1]] as Vec3,
    measuredPx: r.headPx,
  })),
];
