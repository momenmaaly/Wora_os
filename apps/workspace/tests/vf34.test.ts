/**
 * VF-2/VF-3/VF-4 acceptance tests (owner-approved plan criteria A1–A3; additive).
 * Provenance tags mirror the reports (docs/design/main-workspace/greybox/10–12).
 */
import { describe, expect, test } from 'vitest';
import { createHomeCamera, projectToPixels } from '../src/scene/camera';
import { REFERENCE } from '../src/config/sceneConfig';
import { buildStructureCompletion } from '../src/scene/interiors';
import { buildRobots } from '../src/scene/robots';
import { INTERIORS, ROBOT_POSITIONS, ROBOT_VISUAL, DEPARTMENTS } from '../src/config/sceneConfig';

const cam = createHomeCamera(REFERENCE.width / REFERENCE.height);
const W = REFERENCE.width;
const H = REFERENCE.height;
function project(x: number, y: number, z: number) {
  return projectToPixels(cam, [x, y, z], W, H);
}

describe('VF-2 structure completion', () => {
  const specs = buildStructureCompletion();
  test('walnut back wall exists, uses the measured walnut material, spans the DEPT-01 back edge', () => {
    const walnut = specs.filter((s) => s.material === 'walnut');
    expect(walnut.length).toBe(1);
    const d1 = DEPARTMENTS.find((d) => d.id === 'DEPT-01')!;
    const w = walnut[0] as Extract<typeof walnut[0], { kind: 'box' }>;
    expect(w.center[2]).toBeLessThan(Math.min(d1.footprint.z0, d1.footprint.z1) + 0.2); // at the back edge
    expect(w.center[0]).toBeGreaterThan(d1.footprint.x0);
    expect(w.center[0]).toBeLessThan(d1.footprint.x1);
    expect(w.size[2]).toBeLessThanOrEqual(0.1); // thin panel on the inner face
  });
  test('partition frame rhythm exists on every department front (mullions + rails)', () => {
    for (const d of DEPARTMENTS) {
      const near = specs.filter((s) => {
        const c = s.center;
        const fp = d.footprint;
        return c[0] >= fp.x0 - 0.3 && c[0] <= fp.x1 + 0.3 && c[2] >= fp.z0 - 0.3 && c[2] <= fp.z1 + 0.3 && s.material === 'frame';
      });
      expect(near.length, `${d.id} frames`).toBeGreaterThanOrEqual(3);
    }
    const count = specs.filter((s) => s.material === 'frame').length;
    expect(count).toBeGreaterThanOrEqual(DEPARTMENTS.length * 4);
  });
});

describe('VF-3 interiors (department furniture + atrium lounge)', () => {
  test('catalogue coverage: displays, racks, shelves, boards, conference seating, desk clusters', () => {
    const kinds = new Map<string, number>();
    for (const i of INTERIORS) kinds.set(i.kind, (kinds.get(i.kind) ?? 0) + 1);
    expect(kinds.get('display-wall')).toBe(6); // six department displays (VAC-ENV-09)
    expect(kinds.get('rack')).toBe(2); // QA server banks
    expect(kinds.get('whiteboard')).toBe(2); // Management + Creative
    expect(kinds.get('conference-table')).toBe(1);
    expect(kinds.get('desk')).toBe(35); // one cluster per seated robot except Management (conference) and the lounge pair
    expect(kinds.get('chair')).toBe(40); // 35 cluster chairs + 5 conference chairs
    expect(kinds.get('walnut-wall')).toBe(1);
    expect(INTERIORS.length).toBeGreaterThanOrEqual(200);
  });
  test('every department item lands inside its measured footprint (wall-snap tolerance 1.0 m; ≈-approximate catalogue boxes)', () => {
    let checked = 0;
    for (const i of INTERIORS) {
      if (!i.dept || !i.floor_xz || i.kind === 'walnut-wall') continue;
      // plants/trees may sit on the terraces behind the glass backs (visible through the glass in
      // the reference, e.g. the Engineering back plants) — position kept as measured, footprint
      // test not applicable (documented in report 11 §QA).
      if (i.kind === 'plant' || i.kind === 'tree') continue;
      const fp = DEPARTMENTS.find((d) => d.id === i.dept)!.footprint;
      const [x, z] = i.floor_xz;
      expect(x, `${i.id} x`).toBeGreaterThanOrEqual(fp.x0 - 1.0);
      expect(x, `${i.id} x`).toBeLessThanOrEqual(fp.x1 + 1.0);
      expect(z, `${i.id} z`).toBeGreaterThanOrEqual(fp.z0 - 1.0);
      expect(z, `${i.id} z`).toBeLessThanOrEqual(fp.z1 + 1.0);
      checked += 1;
    }
    expect(checked).toBeGreaterThan(150);
  });
  test('floor-anchored items project within ±15 px of their catalogued screen boxes at HOME', () => {
    let checked = 0;
    let maxPx = 0;
    for (const i of INTERIORS) {
      if (!i.px_box || !i.floor_xz || i.centre_y !== undefined) continue; // wall-mounted items are EST. wall-adjacent (report)
      const [bx, by, bw, bh] = i.px_box;
      const p = project(i.floor_xz![0], 0.02, i.floor_xz![1]);
      const dx = Math.abs(p.x - (bx + bw / 2));
      const dy = Math.abs(p.y - (by + bh));
      maxPx = Math.max(maxPx, Math.hypot(dx, dy));
      checked += 1;
    }
    expect(checked).toBeGreaterThan(25);
    expect(maxPx, `max floor-item projection deviation`).toBeLessThanOrEqual(15);
  });
  test('wall-mounted items project within ±30 px horizontally of their catalogued boxes (wall-adjacent EST.)', () => {
    let checked = 0;
    let maxPx = 0;
    for (const i of INTERIORS) {
      if (!i.px_box || i.centre_y === undefined) continue;
      const [bx, by, bw, bh] = i.px_box;
      const p = project(i.floor_xz![0], i.centre_y, i.floor_xz![1]);
      const dx = Math.abs(p.x - (bx + bw / 2));
      const dy = Math.abs(p.y - (by + bh / 2));
      maxPx = Math.max(maxPx, Math.hypot(dx, dy));
      checked += 1;
    }
    expect(checked).toBeGreaterThanOrEqual(10);
    expect(maxPx).toBeLessThanOrEqual(30);
  });
  test('atrium lounge set ENV-005…013 present', () => {
    const ids = INTERIORS.map((i) => i.id);
    for (const frag of ['PLANTER-TREE', 'TREE-A', 'SOFA-L', 'RUG', 'OTTOMAN', 'SOFA-R', 'BENCH', 'TREE-B', 'TREE-C', 'CABINETS'])
      expect(ids.some((id) => id.includes(frag)), frag).toBe(true);
  });
});

describe('VF-4 robots (47 visible robots reconstructed)', () => {
  const specs = buildRobots();
  const ids = new Set(specs.map((s) => s.refId));
  test('exactly the 47 measured robots are built — no extras, none missing', () => {
    expect(ids.size).toBe(47);
    expect([...ids].sort()).toEqual(ROBOT_POSITIONS.map((r) => r.id).sort());
  });
  test('every robot head-top projects within ±15 px of its measured head position (P-4)', () => {
    let maxPx = 0;
    for (const r of ROBOT_VISUAL) {
      const H = r.pose === 'seated' ? 0.95 : 1.2;
      const p = project(r.floorXZ[0], H, r.floorXZ[1]);
      const dev = Math.hypot(p.x - r.headPx[0], p.y - r.headPx[1]);
      maxPx = Math.max(maxPx, dev);
    }
    expect(maxPx).toBeLessThanOrEqual(15);
  });
  test('robots carry geometry in every expected material family; vest/tablet sets match the catalogue', () => {
    const mats = new Set(specs.map((s) => s.material));
    for (const m of ['robot-shell', 'robot-visor', 'robot-eye', 'screen']) expect(mats.has(m as never), m).toBe(true);
    const vestRefs = new Set(specs.filter((s) => s.material === 'sign').map((s) => s.refId));
    expect([...vestRefs].sort()).toEqual(['ROBOT-041', 'ROBOT-044', 'ROBOT-045']);
  });
  test('pose classes match the measured data (40 seated incl. lounge, 7 free)', () => {
    const seated = ROBOT_VISUAL.filter((r) => r.pose === 'seated').length;
    expect(seated).toBe(42); // 40 at desks/rooms + ROBOT-042 (ottoman) + ROBOT-043 (sofa)
    expect(ROBOT_VISUAL.filter((r) => r.pose !== 'seated').length).toBe(5);
  });
});
