/**
 * VF-1 (Materials & Lighting) audit tests — additive; the existing 47 tests are untouched.
 * Provenance tags in every assertion match the VF-1 report
 * (docs/design/main-workspace/greybox/08-vf1-materials-lighting-report.md).
 */
import { describe, expect, test } from 'vitest';
import { Color, MeshBasicMaterial, MeshPhysicalMaterial, MeshStandardMaterial } from 'three';
import {
  createDeptMaterials,
  createFlatMaterial,
  createMaterials,
  DEPT_FLOOR_COLORS,
  FLAT_COLORS,
  SHADOW_EXCLUDE_CAST,
  SHADOW_EXCLUDE_RECEIVE,
} from '../src/scene/materials';
import { DEPT_IDS, type DeptId } from '../src/config/sceneConfig';

describe('VF-1 material audit', () => {
  const m = createMaterials();

  test('base colours remain the catalogued palette (MEASURED; analysis/05 §1.5 + probes)', () => {
    const expected: Record<string, string> = {
      slab: 'b4a1a5', // probe 2026-11-20, inside sampled range #ACA0AB–#D2B9B0
      mass: '4e5260', // scene.facade #38373C–#3B4259 (shadow-side sample)
      floor: 'c6c2c4', // neutral (DEPT-01 unresolved — kept, see DEPT_FLOOR_COLORS)
      partition: 'd6dadc', // clear glass tint
      balustrade: 'd6dadc',
      plinth: 'c9c4c9', // ENV-002 floor-coloured dais
      sign: '131b29', // scene.sign-plate #0B1A32–#1C1C25
      fascia: 'c8c2cb', // bright fascia sample #C6C0C9–#C8C2CB
      facade: '4e5260',
      glazing: '3a4250',
      frame: '353a40', // scene.frame #2A2E33–#433D3E
      rim: 'e9e6ea', // scene.plinth-rim #E5E2E6 peak — HDR-boosted ×6.0, asserted in the emitter test
      strip: 'f5f3f0', // HDR-boosted ×5.5, asserted in the emitter test
      city: '2e3a4c',
      parapet: 'e8e5e9',
      foliage: '3e5a3a',
    };
    for (const [key, hex] of Object.entries(expected)) {
      const mat = m[key as keyof typeof m] as MeshStandardMaterial;
      // boosted emitters (rim/strip) clamp to white in hex; their base×boost is asserted below
      if (key === 'rim' || key === 'strip') continue;
      expect(mat.color.getHexString(), key).toBe(hex);
    }
  });

  test('atrium marble is polished (VAC-LGT-04): low roughness + clearcoat', () => {
    const slab = m.slab as MeshStandardMaterial;
    expect(slab.roughness).toBeLessThan(0.2);
    expect(m.slab).toBeInstanceOf(MeshPhysicalMaterial);
    expect((m.slab as MeshPhysicalMaterial).clearcoat).toBeGreaterThan(0.3);
  });

  test('glass is clear/reflective, not opaque (VAC-LGT-06): transparency preserved', () => {
    for (const key of ['partition', 'balustrade', 'glazing'] as const) {
      const g = m[key] as MeshPhysicalMaterial;
      expect(g.transparent, key).toBe(true);
      expect(g.depthWrite, key).toBe(false);
      expect(g.roughness, key).toBeLessThan(0.2);
      expect(g, key).toBeInstanceOf(MeshPhysicalMaterial);
    }
    // opacity values unchanged from 006-A
    expect(m.partition.opacity).toBe(0.35);
    expect(m.glazing.opacity).toBe(0.55);
  });

  test('frames are anthracite metal (VAC-LGT-06)', () => {
    const frame = m.frame as MeshStandardMaterial;
    expect(frame.metalness).toBeGreaterThanOrEqual(0.5);
    expect(frame.roughness).toBeLessThan(0.6);
  });

  test('rim and strips are HDR emitters (VAC-LGT-03, bloom threshold 1.0); city is not', () => {
    const rim = m.rim as MeshBasicMaterial;
    const strip = m.strip as MeshBasicMaterial;
    const city = m.city as MeshBasicMaterial;
    // base × boost computed in the same (linear) colour space three uses internally
    const rimBase = new Color('#E9E6EA').multiplyScalar(6.0);
    const stripBase = new Color('#F5F3F0').multiplyScalar(5.5);
    expect(rim.color.r).toBeCloseTo(rimBase.r, 5);
    expect(rim.color.b).toBeCloseTo(rimBase.b, 5);
    expect(strip.color.g).toBeCloseTo(stripBase.g, 5);
    expect(city.color.r).toBeLessThanOrEqual(1.0);
    expect(rim).toBeInstanceOf(MeshBasicMaterial);
  });

  test('glass, backdrop and emissive surfaces never cast or receive shadows (VAC-LGT-02)', () => {
    for (const key of ['partition', 'balustrade', 'glazing', 'city', 'rim', 'strip'] as const) {
      expect(SHADOW_EXCLUDE_CAST.has(key), `cast ${key}`).toBe(true);
      expect(SHADOW_EXCLUDE_RECEIVE.has(key), `receive ${key}`).toBe(true);
    }
    for (const key of ['slab', 'floor', 'frame', 'sign', 'mass'] as const) {
      expect(SHADOW_EXCLUDE_CAST.has(key), `cast ${key}`).toBe(false);
      expect(SHADOW_EXCLUDE_RECEIVE.has(key), `receive ${key}`).toBe(false);
    }
  });
});

describe('VF-1 per-department floor tones', () => {
  test('resolved departments use the catalogued samples; DEPT-01 stays unresolved (no invention)', () => {
    const expected: Partial<Record<DeptId, string>> = {
      'DEPT-02': '927a74', // Marketing (analysis/03 §7)
      'DEPT-03': '8f7f80', // Engineering
      'DEPT-04': '836b5f', // Creative Studio
      'DEPT-05': '805e4c', // Management (warm wood)
      'DEPT-06': '817880', // Research (probe 2026-11-20)
      'DEPT-07': '655b61', // QA & Testing
    };
    expect(Object.keys(DEPT_FLOOR_COLORS).sort()).toEqual(Object.keys(expected).sort());
    expect(DEPT_FLOOR_COLORS['DEPT-01']).toBeUndefined();
    const m = createMaterials();
    for (const id of DEPT_IDS) {
      const dept = createDeptMaterials(m, id);
      const hex = (dept.floor as MeshStandardMaterial).color.getHexString();
      if (id === 'DEPT-01') expect(hex).toBe('c6c2c4'); // neutral floor kept
      else expect(hex, id).toBe(expected[id]);
    }
  });

  test('every resolved floor tone carries a provenance string', () => {
    for (const [id, tone] of Object.entries(DEPT_FLOOR_COLORS)) {
      expect(tone!.provenance.length, id).toBeGreaterThan(8);
      expect(tone!.provenance).toMatch(/MEASURED/);
    }
  });
});

describe('VF-1 flat measurement mode: 006-A IDs byte-identical (subset)', () => {
  const expectedFlat: Record<string, string> = {
    slab: '#808080', mass: '#202020', floor: '#ffffff', partition: '#00ff00', balustrade: '#00ffff',
    plinth: '#ff0000', sign: '#0000ff', fascia: '#3c3c3c', facade: '#2c2c2c', glazing: '#585858',
    frame: '#0c0c0c', rim: '#00c000', strip: '#ffc0c0', city: '#020202', parapet: '#c0c0c0', foliage: '#004000',
  };
  test('006-A flat IDs unchanged (VF-2/3/4 keys may only be added)', () => {
    for (const [k, v] of Object.entries(expectedFlat)) expect(FLAT_COLORS[k as keyof typeof FLAT_COLORS], k).toBe(v);
    expect(Object.keys(FLAT_COLORS).length).toBeGreaterThanOrEqual(Object.keys(expectedFlat).length);
    const flat = createMaterials(true);
    expect(flat.slab).toBeInstanceOf(MeshBasicMaterial);
    expect(flat.slab.toneMapped).toBe(false);
    expect(createFlatMaterial('#123456').toneMapped).toBe(false);
  });
  test('every VF-added flat ID is >40 Manhattan from every scanned colour (measurement uniqueness)', () => {
    // Original 006-A rule: *new* colours are chosen >40 Manhattan from every scanned colour.
    // Legacy 006-A↔006-A pairs are frozen (byte-identical flat mode) and exempt: facade|mass (36),
    // city|frame (30) — they never appear in the same scan region (documented in report 12).
    const hex = (c: string) => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
    const legacy = new Set(['slab', 'mass', 'floor', 'partition', 'balustrade', 'plinth', 'sign', 'fascia', 'facade', 'glazing', 'frame', 'rim', 'strip', 'city', 'parapet', 'foliage']);
    const entries = Object.entries(FLAT_COLORS);
    for (const [k, v] of entries) {
      if (legacy.has(k)) continue; // VF-added keys are checked below against EVERYTHING
      const a = hex(v);
      for (const [k2, v2] of entries) {
        if (k2 === k) continue;
        const b = hex(v2);
        const dist = Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
        expect(dist, `${k} vs ${k2}`).toBeGreaterThan(40);
      }
    }
  });
});
