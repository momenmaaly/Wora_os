/**
 * Neutral greybox palette (architecture/04 §4: greybox uses untextured neutral materials).
 * No textures, no emissive strips, no decorative finishes — tones only separate element types.
 */
import { Color, DoubleSide, FrontSide, MeshBasicMaterial, MeshStandardMaterial, type Material } from 'three';
import type { MaterialKey } from './model';

const spec: Record<MaterialKey, { color: string; opacity?: number }> = {
  slab: { color: '#b9bcc0' },
  mass: { color: '#8e9297' },
  floor: { color: '#cfd2d5' },
  partition: { color: '#dfe3e6', opacity: 0.35 },
  balustrade: { color: '#dfe3e6', opacity: 0.35 },
  plinth: { color: '#a7abb0' },
  sign: { color: '#55595e' },
};

/**
 * Flat, unlit ID colours for the dev "flat" mode (pixel measurement of the rendered frame).
 * Department floors get one colour each (see DEPT_FLAT_COLORS).
 */
export const FLAT_COLORS: Record<MaterialKey, string> = {
  slab: '#808080',
  mass: '#202020',
  floor: '#ffffff',
  partition: '#00ff00',
  balustrade: '#00ffff',
  plinth: '#ff0000',
  sign: '#0000ff',
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
export const BACKGROUND_COLOR = '#3a3e44';
