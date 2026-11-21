/**
 * Scene materials. Mission 006-A: tones moved to the measured reference palette (analysis/05 §1.5
 * + probe samples). Mission VF-1 (owner-approved, 2026-11-20): the same palette expressed with
 * PBR appearance — polished marble, clear glass, anthracite metal, warm floors, HDR emissives,
 * per-department floor tones. No geometry changes; flat measurement mode is byte-identical.
 *
 * Provenance (per analysis/03 §7, analysis/05 §1.5, analysis/06 §9):
 *   MEASURED — base colours (catalogued samples / 2026-11-20 probes, see DEPT_FLOOR_COLORS)
 *   EST.     — roughness, metalness, clearcoat, envMapIntensity, vein/grain patterns,
 *              emissive HDR strengths, bloom response (styled after the reference; Q-VF-02/03 defaults)
 */
import { Color, DoubleSide, FrontSide, MeshBasicMaterial, MeshPhysicalMaterial, MeshStandardMaterial, type Material } from 'three';
import type { MaterialKey } from './model';
import { createMarbleTexture, createWoodTexture } from './textures';
import type { DeptId } from '../config/sceneConfig';

interface Spec {
  color: string;
  opacity?: number;
  unlit?: boolean;
  /** HDR boost for unlit emitters (>1 participates in bloom, VAC-LGT-03). */
  boost?: number; // raised to ×6.0/×5.5 so emitters clear the bloom threshold (3.0) that diffuse albedo cannot reach
  roughness?: number;
  metalness?: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
  envIntensity?: number;
  /** Procedural texture (runtime-generated; no assets). */
  map?: 'marble' | 'wood-management';
  mapRepeat?: [number, number];
}

const spec: Record<MaterialKey, Spec> = {
  // Atrium marble: base #B4A1A5 (probe) inside sampled range #ACA0AB–#D2B9B0; polished (VAC-LGT-04).
  slab: { color: '#B4A1A5', map: 'marble', mapRepeat: [4, 4], roughness: 0.16, metalness: 0, clearcoat: 0.5, clearcoatRoughness: 0.25, envIntensity: 0.35 },
  mass: { color: '#4E5260', roughness: 0.95, metalness: 0 }, // exterior facade mass (scene.facade)
  floor: { color: '#C6C2C4', roughness: 0.85, metalness: 0 }, // neutral floor; per-dept tones in DEPT_FLOOR_COLORS
  partition: { color: '#D6DADC', opacity: 0.35, roughness: 0.06, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.08, envIntensity: 0.5 }, // clear glass, white specular streaks
  balustrade: { color: '#D6DADC', opacity: 0.35, roughness: 0.06, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.08, envIntensity: 1.2 },
  // Plinth dais: same marble family (ENV-002 floor-coloured; treatment EST.)
  plinth: { color: '#C9C4C9', map: 'marble', mapRepeat: [2, 2], roughness: 0.3, metalness: 0, clearcoat: 0.3, clearcoatRoughness: 0.35, envIntensity: 0.3 },
  sign: { color: '#131B29', roughness: 0.85, metalness: 0, envIntensity: 0.3 }, // scene.sign-plate #0B1A32–#1C1C25, matte
  // Mission 006-A environment:
  fascia: { color: '#C8C2CB', roughness: 0.55, metalness: 0, envIntensity: 0.3 }, // bright fascia band (#C6C0C9–#C8C2CB)
  facade: { color: '#4E5260', roughness: 0.95, metalness: 0 }, // lower-storey facade mass
  glazing: { color: '#3A4250', opacity: 0.55, roughness: 0.1, metalness: 0, clearcoat: 0.8, clearcoatRoughness: 0.12, envIntensity: 0.5 }, // curtain-wall glass
  frame: { color: '#353A40', roughness: 0.5, metalness: 0.55, envIntensity: 0.8 }, // anthracite mullions/rails/posts (scene.frame)
  rim: { color: '#E9E6EA', unlit: true, boost: 6.0 }, // plinth glow rim — HDR emitter, blooms (VAC-LGT-03)
  strip: { color: '#F5F3F0', unlit: true, boost: 5.5 }, // linear light strips — HDR emitters
  city: { color: '#2E3A4C', unlit: true }, // backdrop city cards (scenery, CR-02) — no bloom
  parapet: { color: '#E8E5E9', roughness: 0.7, metalness: 0, envIntensity: 0.25 }, // terrace parapet band (scenery)
  foliage: { color: '#3E5A3A', roughness: 0.9, metalness: 0 }, // greenery canopy discs (scenery)
};

/**
 * Per-department floor tones (analysis/03 §7 samples; DEPT-06 from the 2026-11-20 front-band
 * probe #817880). DEPT-01 Executive is UNRESOLVED: both probe attempts were contaminated by the
 * dark desk/walnut wall (#664732 full-room median, #433E3E front band), so the neutral floor is
 * kept until the owner resolves it — no invention.
 */
export const DEPT_FLOOR_COLORS: Partial<Record<DeptId, { color: string; provenance: string }>> = {
  'DEPT-02': { color: '#927A74', provenance: 'MEASURED analysis/03 §7' },
  'DEPT-03': { color: '#8F7F80', provenance: 'MEASURED analysis/03 §7' },
  'DEPT-04': { color: '#836B5F', provenance: 'MEASURED analysis/03 §7' },
  'DEPT-05': { color: '#805E4C', provenance: 'MEASURED analysis/03 §7 (warm wood; grain EST.)' },
  'DEPT-06': { color: '#817880', provenance: 'MEASURED probe 2026-11-20 (front-band smooth-pixel median)' },
  'DEPT-07': { color: '#655B61', provenance: 'MEASURED analysis/03 §7' },
};

/** Glass and backdrop/emissive surfaces never cast or receive shadows. */
export const SHADOW_EXCLUDE_CAST = new Set<MaterialKey>(['partition', 'balustrade', 'glazing', 'city', 'rim', 'strip']);
export const SHADOW_EXCLUDE_RECEIVE = new Set<MaterialKey>(['partition', 'balustrade', 'glazing', 'city', 'rim', 'strip']);

/** Flat, unlit ID colours for the dev "flat" mode (pixel measurement of the rendered frame).
 *  VF-1 rule: byte-identical to Mission 006-A so flat-mode measurements stay comparable. */
export const FLAT_COLORS: Record<MaterialKey, string> = {
  slab: '#808080',
  mass: '#202020',
  floor: '#ffffff',
  partition: '#00ff00',
  balustrade: '#00ffff',
  plinth: '#ff0000',
  sign: '#0000ff',
  fascia: '#3c3c3c',
  facade: '#2c2c2c',
  glazing: '#585858',
  frame: '#0c0c0c',
  rim: '#00c000',
  strip: '#ffc0c0',
  city: '#020202',
  parapet: '#c0c0c0',
  foliage: '#004000',
};
export const DEPT_FLAT_COLORS: Record<string, string> = {
  'DEPT-01': '#ff8000',
  'DEPT-02': '#ffff00',
  'DEPT-03': '#ff00ff',
  'DEPT-04': '#8000ff',
  'DEPT-05': '#00ff80',
  'DEPT-06': '#0080ff',
  'DEPT-07': '#ff0080',
};

export function createFlatMaterial(color: string): Material {
  return new MeshBasicMaterial({ color: new Color(color), toneMapped: false });
}

let marbleTex: ReturnType<typeof createMarbleTexture> | null = null;
let woodTex: ReturnType<typeof createWoodTexture> | null = null;

function getMap(kind: NonNullable<Spec['map']>) {
  if (typeof document === 'undefined') return undefined; // vitest (node) has no DOM; tests audit numeric props only
  if (kind === 'marble') {
    if (!marbleTex) {
      marbleTex = createMarbleTexture();
      marbleTex.repeat.set(4, 4);
    }
    return marbleTex;
  }
  if (!woodTex) {
    woodTex = createWoodTexture();
    woodTex.repeat.set(3, 2);
  }
  return woodTex;
}

export function createMaterials(flat = false): Record<MaterialKey, Material> {
  if (flat) {
    const out = {} as Record<MaterialKey, Material>;
    for (const key of Object.keys(FLAT_COLORS) as MaterialKey[]) out[key] = createFlatMaterial(FLAT_COLORS[key]);
    return out;
  }
  const out = {} as Record<MaterialKey, Material>;
  for (const key of Object.keys(spec) as MaterialKey[]) {
    const s = spec[key];
    if (s.unlit) {
      const c = new Color(s.color);
      if (s.boost !== undefined) c.multiplyScalar(s.boost); // HDR emitter: participates in bloom (threshold 1.0)
      out[key] = new MeshBasicMaterial({ color: c, toneMapped: false, side: FrontSide });
      continue;
    }
    const map = s.map ? getMap(s.map) : undefined;
    if (map && s.mapRepeat) map.repeat.set(s.mapRepeat[0], s.mapRepeat[1]);
    const base = {
      color: new Color(map ? '#ffffff' : s.color), // map carries the sampled tones
      map,
      roughness: s.roughness ?? 0.9,
      metalness: s.metalness ?? 0,
      envMapIntensity: s.envIntensity ?? 0.3,
      transparent: s.opacity !== undefined,
      opacity: s.opacity ?? 1,
      depthWrite: s.opacity === undefined,
      side: s.opacity !== undefined ? DoubleSide : FrontSide,
    };
    if (s.clearcoat !== undefined) {
      out[key] = new MeshPhysicalMaterial({ ...base, clearcoat: s.clearcoat, clearcoatRoughness: s.clearcoatRoughness ?? 0.2 });
    } else {
      out[key] = new MeshStandardMaterial(base);
    }
  }
  return out;
}

/** Per-department material set: shared materials with the department floor tone applied. */
export function createDeptMaterials(materials: Record<MaterialKey, Material>, id: DeptId, flat = false): Record<MaterialKey, Material> {
  if (flat) return materials;
  const tone = DEPT_FLOOR_COLORS[id];
  if (!tone) return materials; // DEPT-01 unresolved: keep the neutral floor (documented)
  const wood = id === 'DEPT-05' ? getMap('wood-management') : undefined; // Management: warm-wood floor
  const floor = new MeshStandardMaterial({
    color: new Color(tone.color),
    map: wood,
    roughness: 0.8,
    metalness: 0,
    envMapIntensity: 0.4,
  });
  return { ...materials, floor };
}

export const EDGE_COLOR = '#2f3338';
export const BACKGROUND_COLOR = '#20242B'; // cool dark interior backdrop (city cards provide the scene background)
