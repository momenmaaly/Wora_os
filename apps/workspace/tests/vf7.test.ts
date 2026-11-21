/**
 * VF-7 interaction acceptance tests (plan §VF-7 A1–A3; additive).
 * The interaction layer is presentation-only: no geometry/material identity changes, HOME camera
 * untouched, counts derived from the immutable measured data.
 */
import { describe, expect, test } from 'vitest';
import { DEPARTMENTS, ROBOT_POSITIONS, INTERIORS } from '../src/config/sceneConfig';
import { buildGreyboxModel } from '../src/scene/model';
import { buildRobots } from '../src/scene/robots';

describe('VF-7 interaction data', () => {
  test('every department and every robot is resolvable with correct counts (24/47 immutable)', () => {
    expect(ROBOT_POSITIONS.length).toBe(47);
    const zoneCounts: Record<string, number> = {};
    for (const r of ROBOT_POSITIONS) zoneCounts[r.zone] = (zoneCounts[r.zone] ?? 0) + 1;
    // catalogue census (analysis/03 §5.3)
    expect(zoneCounts['Executive Office']).toBe(1);
    expect(zoneCounts['Marketing']).toBe(8);
    expect(zoneCounts['Engineering']).toBe(10);
    expect(zoneCounts['Creative Studio']).toBe(5);
    expect(zoneCounts['Management']).toBe(5);
    expect(zoneCounts['Research']).toBe(5);
    expect(zoneCounts['QA & Testing']).toBe(6);
    expect(Object.values(zoneCounts).reduce((a, b) => a + b, 0)).toBe(47);
    for (const d of DEPARTMENTS) expect(d.sign.id).toMatch(/^SIGN-0[1-7]$/);
  });

  test('pickable entities carry refId/name userData (raycast targets exist)', () => {
    const model = buildGreyboxModel();
    const withRef = [model.slab, model.mass, model.plinth, ...model.balustrades, ...model.departments.flatMap((d) => [d.floor, d.sign, ...d.walls])];
    expect(withRef.every((s) => s.refId !== undefined)).toBe(true);
    const robots = buildRobots();
    const robotRefs = new Set(robots.map((s) => s.refId));
    expect(robotRefs.size).toBe(47);
  });

  test('interaction adds no new geometry families beyond the highlight ring (no invented content)', () => {
    // the interaction highlight is a ring at runtime; the model data must not gain kinds
    const kinds = new Set(INTERIORS.map((i) => i.kind));
    for (const k of kinds) expect(k).not.toMatch(/highlight|ring|beacon/);
  });
});
