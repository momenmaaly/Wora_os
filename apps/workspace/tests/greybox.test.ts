/**
 * Structural validation of the greybox (Mission 004). Every check projects the SAME model that the
 * app renders (src/scene/model.ts) with a real three.js PerspectiveCamera configured by the same
 * code path as the app (src/scene/camera.ts). Thresholds are the analysis/06 VAC tolerances; where
 * a check is known to fail in the reference itself (non-pinhole periphery), the test pins the
 * documented value so any regression or silent "fix" of the geometry is caught.
 */
import { describe, expect, test } from 'vitest';
import { DEPARTMENTS, DEPT_IDS, MEASURED, PLINTH, ROBOT_POSITIONS } from '../src/config/sceneConfig';
import { buildGreyboxModel, slabFootprint, SIGN_LENGTH_M } from '../src/scene/model';
import {
  cameraPose,
  clearance,
  digitisedCornerMetrics,
  fitSignLength,
  homeCamera,
  occlusionMetrics,
  plinthMetrics,
  ringMetrics,
  ringOrder,
  robotMetrics,
  roomCornerConsistency,
  signMetrics,
  slabEdgeMetrics,
  backProject,
} from '../src/validation/metrics';
import { ARCHITECTURE } from '../src/config/sceneConfig';

const cam = homeCamera();

describe('camera (G-19, architecture/03 §2)', () => {
  test('three.js camera reproduces the approved HOME pose', () => {
    const p = cameraPose(cam);
    expect(p.yawDeg).toBeCloseTo(225.37, 1);
    expect(p.pitchDeg).toBeCloseTo(27.78, 1);
    expect(Math.abs(p.rollDeg)).toBeLessThan(0.01);
    expect(p.vfovDeg).toBeCloseTo(12.0006, 2);
    expect(p.hfovDeg).toBeCloseTo(21.158, 2);
    expect(Math.abs(p.focalPx - 4476)).toBeLessThan(1);
  });
});

describe('layout preservation', () => {
  test('exactly 7 departments in the approved order, footprints unchanged from the JSON', () => {
    expect(DEPARTMENTS.map((d) => d.id)).toEqual(DEPT_IDS);
    const raw = ARCHITECTURE.departments as Record<string, { footprint: object; name: string }>;
    for (const d of buildGreyboxModel().departments) {
      expect(d.config.footprint).toEqual(raw[d.id].footprint);
      expect(d.name).toBe(raw[d.id].name);
    }
  });

  test('ring order around the plinth (clockwise from top) is preserved', () => {
    // Executive Office → Engineering → Management → QA & Testing → Research → Creative Studio → Marketing
    const order = ringOrder(cam);
    const start = order.indexOf('DEPT-01');
    const rotated = [...order.slice(start), ...order.slice(0, start)];
    expect(rotated).toEqual(['DEPT-01', 'DEPT-03', 'DEPT-05', 'DEPT-07', 'DEPT-06', 'DEPT-04', 'DEPT-02']);
  });

  test('walkway clearances equal architecture ring_clearances_m', () => {
    for (const [pair, expected] of Object.entries(ARCHITECTURE.ring_clearances_m)) {
      const [a, b] = [pair.slice(0, 7), pair.slice(8)] as [never, never];
      expect(Math.abs(clearance(a, b) - expected)).toBeLessThan(0.02);
    }
  });

  test('room floor corners match the M003 solver projection (implementation consistency, < 0.5 px)', () => {
    for (const r of roomCornerConsistency(cam)) expect(r.maxErrVsSolverPx).toBeLessThan(0.5);
  });

  test('slab stops at the minimum supported extents (no invented −X / −Z area)', () => {
    const f = slabFootprint();
    expect(f.x0).toBe(-17.18);
    expect(f.z0).toBe(-15.3);
    expect(f.x1).toBe(14.6);
    expect(f.z1).toBe(13.91);
  });
});

describe('plinth (G-04; VAC-CAM-01 / VAC-CAM-03)', () => {
  const m = plinthMetrics(cam);
  test('centre within ±5 px of ENV-002', () => expect(m.centreErrorPx).toBeLessThanOrEqual(5));
  test('width equals the measured 217 px (by construction: sets the radius)', () => expect(Math.abs(m.widthDeltaPx)).toBeLessThan(1));
  test('top-ellipse aspect within 2.17 ± 0.08 (independent)', () => expect(Math.abs(m.topEllipse.aspect - 2.17)).toBeLessThanOrEqual(0.08));
  test('full drum silhouette height is +7.3 px vs the measured box (documented deviation)', () => {
    expect(m.heightDeltaPx).toBeCloseTo(7.3, 0);
    expect(PLINTH.radius).toBe(2.383);
    expect(PLINTH.topY).toBe(0.12);
  });
});

describe('department boundaries', () => {
  test('digitised floor corners: in-sample residuals stay at the M003 values (≤ 6.5 px)', () => {
    for (const c of digitisedCornerMetrics(cam)) expect(c.errorPx).toBeLessThanOrEqual(6.5);
  });
  test('ring layout VAC-GEO-04: 6/7 envelope centres within ±20 px; Engineering is the known 43 px outlier', () => {
    const r = ringMetrics(cam);
    expect(r.filter((x) => x.withinGeo04).length).toBe(6);
    expect(r.find((x) => !x.withinGeo04)!.id).toBe('DEPT-03');
  });
  test('occlusion parity VAC-CAM-05: 4/5 occluded extremes hidden, Management right corner visible (known)', () => {
    const o = occlusionMetrics(cam);
    expect(o.filter((x) => x.hiddenBy).length).toBe(4);
    expect(o.find((x) => !x.hiddenBy)!.id).toBe('DEPT-05');
  });
});

describe('sign plates (G-12…18)', () => {
  const s = signMetrics(cam);
  test('anchors round-trip to the measured sign centres (< 0.5 px)', () => {
    for (const x of s) expect(x.anchorRoundTripPx).toBeLessThan(0.5);
  });
  test('plate lengths are the documented bbox-width fit (height 0.93 m)', () => {
    for (const d of buildGreyboxModel().departments) {
      const fit = fitSignLength(cam, d.sign, MEASURED[d.sign.refId!].w);
      expect(Math.abs(fit - SIGN_LENGTH_M[d.sign.refId!])).toBeLessThan(0.01);
    }
  });
  test('VAC-CAM-02: 5/7 screen angles within ±3° (SIGN-02 / SIGN-03 fail, documented)', () => {
    expect(s.filter((x) => x.withinCam02).length).toBe(5);
    expect(s.filter((x) => !x.withinCam02).map((x) => x.id).sort()).toEqual(['SIGN-02', 'SIGN-03']);
  });
});

describe('robots (markers only)', () => {
  test('47 positions; zone 40/40 inside, free-roaming 7/7 outside; head round trip < 0.5 px', () => {
    expect(ROBOT_POSITIONS.length).toBe(47);
    const r = robotMetrics(cam);
    expect(r.zoneInside).toBe(40);
    expect(r.zoneTotal).toBe(40);
    expect(r.freeOutside).toBe(7);
    expect(r.freeTotal).toBe(7);
    expect(r.maxHeadRoundTripPx).toBeLessThan(0.5);
  });
});

describe('slab edges (G-01…03; VAC-GEO-02 / 03; Q-ARCH-05)', () => {
  const e = slabEdgeMetrics(cam);
  const line = (id: string) => e.lines.find((l) => l.id === id)!;
  test('+Z edge vs the M003 re-measured lower-left edge: ≤ 10 px everywhere', () => {
    expect(line('LL_crop_est').maxDistancePx).toBeLessThanOrEqual(10);
  });
  test('+X edge vs the analysis/02 line: within ±10 px except the lower end (14.2 px)', () => {
    const d = line('LR_02_spec').distanceAtFractionsPx;
    expect(d.slice(1).every((v) => v <= 10)).toBe(true);
    expect(d[0]).toBeCloseTo(14.2, 0);
  });
  test('+X skew is independent of the edge height (floor, slab underside, balustrade top)', () => {
    const skews = line('LR_measured_hough').backProjection.map((b) => b.skewFromAxisDeg);
    expect(Math.max(...skews) - Math.min(...skews)).toBeLessThan(0.5);
  });
  test('no camera inside the M003 bootstrap interval reaches the measured +X angle', () => {
    const inInterval = e.cameraSweep.filter((s) => s.yawDelta >= -1.47 && s.yawDelta <= 1.74 && s.pitchDelta >= -0.22 && s.pitchDelta <= 0.23);
    expect(Math.max(...inInterval.map((s) => s.plusXAngleDeg))).toBeLessThan(33.5);
  });
});

describe('building mass (ENV-014 / ENV-015 lower storeys)', () => {
  test('mass depth covers the visible facade down to the frame bottom in HOME', () => {
    const f = slabFootprint();
    const model = buildGreyboxModel();
    const bottom = model.mass.center[1] - model.mass.size[1] / 2;
    let needed = 0;
    // intersect frame-bottom rays with the two visible facade planes
    for (let u = 236; u <= 1672; u += 4) {
      for (const plane of ['z', 'x'] as const) {
        // sample along the ray by stepping heights: find y where the ray hits the facade plane
        for (let h = 0; h >= -20; h -= 0.05) {
          const q = backProject(cam, [u, 941], h);
          const onFace = plane === 'z' ? Math.abs(q[2] - f.z1) < 0.05 && q[0] <= f.x1 : Math.abs(q[0] - f.x1) < 0.05 && q[2] <= f.z1;
          if (onFace) needed = Math.min(needed, h);
        }
      }
    }
    expect(bottom).toBeLessThanOrEqual(needed);
  });
});
