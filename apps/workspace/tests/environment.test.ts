/**
 * Mission 006-A environment tests (additive; the 31 Mission 004 tests are untouched).
 * Pins the measured fascia profile, the catalogued sign text, the plinth details, the light-strip
 * set and the 006-A scope boundary (no robots, no furniture). Thresholds from the 2026-11-20 probe.
 */
import { describe, expect, test } from 'vitest';
import { ENV, fasciaPlusXBot, fasciaPlusZBot } from '../src/config/sceneConfig';
import { FASCIA_STEP_PX } from '../src/config/referencePoints';
import { buildGreyboxModel } from '../src/scene/model';
import { buildEnvironmentModel, SIGN_ICONS } from '../src/scene/environment';
import { environmentMetrics, homeCamera } from '../src/validation/metrics';

const cam = homeCamera();
const env = buildEnvironmentModel();
const core = buildGreyboxModel();

describe('fascia (ENV-014/015 band, measured 2026-11-20)', () => {
  test('bottom profile projects within ±6 px of the measured step at all 23 samples', () => {
    const m = environmentMetrics(cam);
    expect(m.fasciaMaxPx['+Z']).toBeLessThanOrEqual(6);
    expect(m.fasciaMaxPx['+X']).toBeLessThanOrEqual(6);
    expect(m.fasciaSamples.length).toBe(FASCIA_STEP_PX.length);
  });
  test('the two fitted profiles meet at the near corner (x=14.6, z=13.91)', () => {
    expect(Math.abs(fasciaPlusXBot(13.91) - fasciaPlusZBot(14.6))).toBeLessThan(0.01);
  });
  test('the +X band vanishes for z ≤ −6.114 (documented M004 finding) and is deepest near z ≈ 2', () => {
    expect(fasciaPlusXBot(-9.4)).toBe(0);
    expect(fasciaPlusXBot(-6.2)).toBe(0);
    expect(fasciaPlusXBot(-6.0)).toBeLessThan(0);
    expect(fasciaPlusXBot(2)).toBeCloseTo(-1.19, 1);
  });
  test('all four slab edges carry a fascia ribbon at the approved extents', () => {
    expect(env.fascia.map((f) => f.key).sort()).toEqual(['fascia-minusX', 'fascia-minusZ', 'fascia-plusX', 'fascia-plusZ']);
    for (const f of env.fascia) expect(f.pts.length).toBeGreaterThanOrEqual(8);
  });
});

describe('facade glazing and back walls (ENV-014/015/016)', () => {
  test('curtain-wall bay is the measured 0.96 m (mullion spacing on both visible edges)', () => {
    expect(ENV.facade_glazing.mullion_bay_m).toBe(0.96);
    for (const edge of ['plusZ', 'plusX']) {
      const ms = env.facadeMullions.filter((m) => m.key.startsWith(`facade-${edge}`)).map((m) => (edge === 'plusZ' ? m.center[0] : m.center[2])).sort((a, b) => a - b);
      expect(ms.length).toBeGreaterThan(25);
      for (let i = 1; i < ms.length; i++) expect(ms[i] - ms[i - 1]).toBeCloseTo(0.96, 5);
    }
  });
  test('transoms every 2.0 m down to the mass bottom (−11.3 m)', () => {
    expect(env.facadeTransoms.filter((t) => t.key.includes('plusZ')).length).toBe(5);
  });
  test('back exterior walls exist on −X and −Z at the partition height (est.), no door gaps', () => {
    expect(env.backGlazingPanes.length).toBe(2);
    expect(env.backGlazingMullions.length).toBeGreaterThan(40);
    expect(env.backGlazingPanes.every((p) => p.center[1] > 0)).toBe(true);
  });
});

describe('balustrade frames (G-02/G-03 styling)', () => {
  test('top rail + posts every 1.2 m on the two visible edges only', () => {
    expect(env.balustradeFrames.filter((f) => f.key.includes('rail')).length).toBe(2);
    for (const edge of ['plusZ', 'plusX']) {
      const posts = env.balustradeFrames.filter((f) => f.key.includes(`balframe-${edge}-post`)).map((f) => (edge === 'plusZ' ? f.center[0] : f.center[2])).sort((a, b) => a - b);
      expect(posts.length).toBeGreaterThan(10);
      for (let i = 1; i < posts.length; i++) expect(posts[i] - posts[i - 1]).toBeCloseTo(ENV.balustrade_frame.post_bay_m, 5);
    }
  });
});

describe('atrium plinth details (ENV-002/003/004)', () => {
  test('glow rim ring is present around the drum (slightly larger radius, emissive)', () => {
    expect(env.plinthRim.radius).toBeCloseTo(2.393, 3);
    expect(env.plinthRim.material).toBe('rim');
    expect(core.plinth.radius).toBeLessThan(env.plinthRim.radius);
  });
  test('logo mark and WORA wordmark land at their ENV-003/004 back-projections', () => {
    const logo = env.plinthLabels.find((l) => l.refId === 'ENV-003');
    const word = env.plinthLabels.find((l) => l.refId === 'ENV-004');
    expect(logo).toBeDefined();
    expect(word?.text).toBe('WORA');
    expect(logo!.center[0]).toBeCloseTo(-0.608, 2);
    expect(logo!.center[2]).toBeCloseTo(-0.553, 2);
    expect(word!.center[0]).toBeCloseTo(0.359, 2);
    expect(word!.center[2]).toBeCloseTo(0.395, 2);
    expect(logo!.size).toEqual([ENV.plinth_details.logo.size_m[0], ENV.plinth_details.logo.size_m[1]]);
    expect(word!.size[0]).toBeCloseTo(2.609, 2);
  });
});

describe('sign faces (catalogued text + icon, angles untouched per CR-05)', () => {
  test('all 7 signs carry the exact department name and the catalogued icon', () => {
    expect(env.signFaces.length).toBe(7);
    const expected: Record<string, [string, string]> = {
      'SIGN-01': ['Executive Office', 'crown'],
      'SIGN-02': ['Marketing', 'megaphone'],
      'SIGN-03': ['Engineering', 'code'],
      'SIGN-04': ['Creative Studio', 'palette'],
      'SIGN-05': ['Management', 'chart'],
      'SIGN-06': ['Research', 'flask'],
      'SIGN-07': ['QA & Testing', 'shield'],
    };
    for (const f of env.signFaces) {
      const [text, icon] = expected[f.refId!];
      expect(f.text).toBe(text);
      expect(f.icon).toBe(icon);
      expect(Object.values(SIGN_ICONS)).toContain(icon);
    }
  });
});

describe('light strips (analysis/03 §9 emissive sources; Q-3D-07 = emissive, no bloom)', () => {
  test('28 partition-top strips (4 per room) + 2 slab-edge base strips', () => {
    expect(env.partitionStrips.length).toBe(28);
    expect(env.edgeStrips.length).toBe(2);
    expect(env.partitionStrips.every((s) => s.material === 'strip')).toBe(true);
  });
});

describe('backdrop scenery (CR-02 environmental background, by construction)', () => {
  test('two city cards, two parapet bands + strips, 7 canopy discs', () => {
    expect(env.backdropCity.length).toBe(2);
    expect(env.backdropParapet.length).toBe(2);
    expect(env.backdropParapetStrips.length).toBe(2);
    expect(env.backdropTrees.length).toBe(7);
  });
  test('no scenery extends the building floor plate beyond the approved extents', () => {
    const fp = { x0: -17.18, x1: 14.6, z0: -15.3, z1: 13.91 };
    // scenery sits strictly outside the slab footprint (or below y=0 for the far planes)
    for (const t of env.backdropTrees) {
      const outside = t.center[0] < fp.x0 || t.center[0] > fp.x1 || t.center[2] < fp.z0 || t.center[2] > fp.z1;
      expect(outside).toBe(true);
    }
  });
});

describe('Mission 006-A scope boundary', () => {
  test('environment materials are exactly the approved set; no robot/furniture material exists', () => {
    const allowed = new Set(['fascia', 'facade', 'glazing', 'frame', 'rim', 'strip', 'city', 'parapet', 'foliage', 'partition']); // back exterior walls use the approved partition glass
    const all = [...env.fascia, ...env.facadePanes, ...env.facadeMullions, ...env.facadeTransoms, ...env.backGlazingPanes, ...env.backGlazingMullions, ...env.balustradeFrames, env.plinthRim, ...env.partitionStrips, ...env.edgeStrips, ...env.backdropCity, ...env.backdropParapet, ...env.backdropParapetStrips, ...env.backdropTrees];
    for (const s of all) expect(allowed.has(s.material)).toBe(true);
    for (const s of all) expect(s.material).not.toMatch(/robot|furniture|decor/);
  });
  test('the core structural model is byte-identical in shape to Mission 004 (no geometry moved)', () => {
    expect(core.departments.length).toBe(7);
    expect(core.departments.every((d) => d.walls.length === 4)).toBe(true);
    expect(core.balustrades.length).toBe(2);
  });
});
