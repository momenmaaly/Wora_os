/**
 * Greybox palette. Mission 004: neutral tones separating element types.
 * Mission 006-A: tones moved to the measured reference palette (analysis/05 §1.5 + probe samples),
 * plus environment keys (fascia, facade, glazing, frame, rim, strip, city, parapet, foliage).
 * `rim` and `strip` are unlit (emissive look, no bloom — post-processing is art-pass scope, Q-3D-07).
 */
import { Color, DoubleSide, FrontSide, MeshBasicMaterial, MeshStandardMaterial, type Material } from 'three';
import type { MaterialKey } from './model';

const spec: Record<MaterialKey, { color: string; opacity?: number; unlit?: boolean }> = {
  slab: { color: '#B4A1A5' }, // atrium marble sample (probe 2026-11-20; palette #ACA0AB–#D2B9B0)
  mass: { color: '#4E5260' }, // exterior facade (scene.facade family)
  floor: { color: '#C6C2C4' }, // room floor plates (neutral; per-room tones are art-pass scope)
  partition: { color: '#D6DADC', opacity: 0.35 }, // glazed partitions
  balustrade: { color: '#D6DADC', opacity: 0.35 }, // glass balustrade panels
  plinth: { color: '#C9C4C9' }, // dais top (floor-coloured per ENV-002)
  sign: { color: '#131B29' }, // scene.sign-plate #0B1A32–#1C1C25
  // Mission 006-A environment:
  fascia: { color: '#C8C2CB' }, // bright fascia band sample (#C6C0C9–#C8C2CB)
  facade: { color: '#4E5260' }, // lower-storey facade mass
  glazing: { color: '#3A4250', opacity: 0.55 }, // curtain-wall glass
  frame: { color: '#353A40' }, // mullions / rails / posts (scene.frame #2A2E33–#433D3E)
  rim: { color: '#E9E6EA', unlit: true }, // plinth glow rim (scene.plinth-rim #E5E2E6 peak)
  strip: { color: '#F5F3F0', unlit: true }, // linear light strips (analysis/03 §9)
  city: { color: '#2E3A4C', unlit: true }, // backdrop city cards (scenery, CR-02)
  parapet: { color: '#E8E5E9' }, // terrace parapet band (scenery)
  foliage: { color: '#3E5A3A' }, // greenery canopy discs (scenery)
};

/**
 * Flat, unlit ID colours for the dev "flat" mode (pixel measurement of the rendered frame).
 * Department floors get one colour each (see DEPT_FLAT_COLORS). New environment colours are chosen
 * distinct from every scanned colour (Manhattan distance > 40).
 */
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
      out[key] = new MeshBasicMaterial({ color: new Color(s.color), toneMapped: false, side: FrontSide });
      continue;
    }
    out[key] = new MeshStandardMaterial({
      color: new Color(s.color),
      roughness: 0.9,
      metalness: 0,
      transparent: s.opacity !== undefined,
      opacity: s.opacity ?? 1,
      depthWrite: s.opacity === undefined,
      side: s.opacity !== undefined ? DoubleSide : FrontSide,
    });
  }
  return out;
}

export const EDGE_COLOR = '#2f3338';
export const BACKGROUND_COLOR = '#20242B'; // cool dark interior backdrop (city cards provide the scene background)
