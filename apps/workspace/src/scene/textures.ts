/**
 * VF-1 procedural textures. No image assets are shipped (check-dist P-6); every texture is
 * generated at runtime from the catalogued sampled palette, deterministically seeded so renders
 * are reproducible. Provenance of every tone is listed in materials.ts and the VF-1 report.
 *
 * VAC-LGT-04 (polished marble, #ACA0AB – #D2B9B0): base tones MEASURED (analysis/05 §1.5,
 * 2026-11-20 probes #B0A2AE/#B5A6AD/#CDB3AD on bare atrium floor); vein pattern and vein tone
 * are EST. (the pattern itself is not recoverable from the reference at greybox resolution).
 */
import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three';

/** Deterministic PRNG (mulberry32-style); fixed seed keeps renders reproducible. */
function prng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createMarbleTexture(size = 512, seed = 20261120): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  // Base: sampled marble range (#ACA0AB – #D2B9B0, MEASURED) render-calibrated ×0.82 — review
  // R7: marble carries the atrium/plaza brightness; at the sampled tones the lit render read
  // +24 vs the reference patch (probe: flat ID shows the patch is slab, not the floor token).
  const base = ctx.createLinearGradient(0, 0, size * 0.7, size);
  base.addColorStop(0, '#98888D');
  base.addColorStop(0.45, '#938487');
  base.addColorStop(1, '#8D838C');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);
  const rnd = prng(seed);
  // Soft warm blotches (the reference floor shows large warm/pinkish zones, e.g. #CDB3AD patch).
  for (let i = 0; i < 12; i++) {
    const x = rnd() * size;
    const y = rnd() * size;
    const r = size * (0.08 + rnd() * 0.22);
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    const warm = rnd() < 0.55;
    g.addColorStop(0, warm ? 'rgba(205,179,173,0.12)' : 'rgba(150,140,152,0.10)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  // Thin veins: mostly pale streaks with a few darker #8E8390-family lines (EST.).
  ctx.lineCap = 'round';
  for (let i = 0; i < 30; i++) {
    const x = rnd() * size;
    const y = rnd() * size;
    const ang = rnd() * Math.PI * 2;
    const len = size * (0.22 + rnd() * 0.5);
    const dark = rnd() < 0.35;
    ctx.strokeStyle = dark ? 'rgba(142,131,144,0.13)' : 'rgba(228,217,216,0.15)';
    ctx.lineWidth = 1 + rnd() * 2.4;
    ctx.beginPath();
    ctx.moveTo(x, y);
    const c1x = x + Math.cos(ang) * len * 0.35 + (rnd() * 36 - 18);
    const c1y = y + Math.sin(ang) * len * 0.35 + (rnd() * 36 - 18);
    const c2x = x + Math.cos(ang) * len * 0.7;
    const c2y = y + Math.sin(ang) * len * 0.7;
    ctx.bezierCurveTo(c1x, c1y, c2x, c2y, x + Math.cos(ang) * len, y + Math.sin(ang) * len);
    ctx.stroke();
  }
  const tex = new CanvasTexture(canvas);
  tex.wrapS = RepeatWrapping;
  tex.wrapT = RepeatWrapping;
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/**
 * Warm-wood floor planks (DEPT-05 Management, sampled #805E4C — analysis/03 §7).
 * Grain pattern EST. (approved default Q-VF-02: procedural treatments from sampled tones).
 */
export function createWoodTexture(base = '#805E4C', size = 512, seed = 20261121): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);
  const rnd = prng(seed);
  // long horizontal grain streaks, slightly darker/lighter than the base
  for (let i = 0; i < 90; i++) {
    const y = rnd() * size;
    const len = size * (0.3 + rnd() * 0.7);
    const x = rnd() * size - len * 0.2;
    const dark = rnd() < 0.5;
    ctx.strokeStyle = dark ? 'rgba(52,36,26,0.16)' : 'rgba(190,140,102,0.12)';
    ctx.lineWidth = 0.8 + rnd() * 2.2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x + len * 0.4, y + (rnd() * 6 - 3), x + len * 0.7, y + (rnd() * 6 - 3), x + len, y);
    ctx.stroke();
  }
  // plank seams every ~1/5 height
  ctx.strokeStyle = 'rgba(46,32,24,0.28)';
  ctx.lineWidth = 1.6;
  for (let i = 1; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(0, (size / 5) * i);
    ctx.lineTo(size, (size / 5) * i);
    ctx.stroke();
  }
  const tex = new CanvasTexture(canvas);
  tex.wrapS = RepeatWrapping;
  tex.wrapT = RepeatWrapping;
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}
