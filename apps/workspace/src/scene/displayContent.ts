/**
 * Fidelity reset: the six department large displays carry their catalogued content types
 * (analysis/03 §4, VAC-ENV-09) — blue rising bar chart (Marketing), wall dashboard/line charts
 * (Marketing), code text (Engineering), colourful artwork (Creative Studio), bar/line charts
 * (Management), blue world map (Research), blue circular check mark (QA & Testing). Previously
 * deferred as "art pass"; the contents are visible in the reference and documented, so they are
 * now implemented as runtime canvas textures (no assets, check-dist safe). Style EST. — the
 * exact chart layouts are not measurable at reference resolution; colours from the sampled
 * screen-blue family (#134AB0–#1A55C0) plus catalogued accents.
 */
import { CanvasTexture, SRGBColorSpace, MeshBasicMaterial, type Material } from 'three';

const painters: Record<string, (ctx: CanvasRenderingContext2D, w: number, h: number) => void> = {
  // Marketing: standing display — blue rising bar chart
  'INT-02-DISP-BAR': (ctx, w, h) => {
    const bars = 5;
    for (let i = 0; i < bars; i++) {
      const bh = h * (0.18 + (i / (bars - 1)) * 0.55);
      const bw = w * 0.11;
      const x = w * (0.12 + i * 0.16);
      const g = ctx.createLinearGradient(0, h - bh - h * 0.12, 0, h - h * 0.12);
      g.addColorStop(0, '#3FA9F5');
      g.addColorStop(1, '#134AB0');
      ctx.fillStyle = g;
      ctx.fillRect(x, h - h * 0.12 - bh, bw, bh);
    }
    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.lineWidth = w * 0.012;
    ctx.beginPath();
    ctx.moveTo(w * 0.08, h * 0.9);
    ctx.lineTo(w * 0.94, h * 0.9);
    ctx.stroke();
  },
  // Marketing: wall dashboard — line charts
  'INT-02-DISP-DASH': (ctx, w, h) => {
    for (let r = 0; r < 2; r++) {
      ctx.strokeStyle = r === 0 ? '#3FA9F5' : '#19C6FF';
      ctx.lineWidth = w * 0.014;
      ctx.beginPath();
      for (let i = 0; i <= 8; i++) {
        const x = w * (0.1 + i * 0.1);
        const y = h * (r === 0 ? 0.35 : 0.72) - Math.sin(i * 1.1 + r) * h * 0.14;
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.stroke();
    }
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.fillRect(w * 0.1, h * 0.12, w * 0.34, h * 0.07);
  },
  // Engineering: dark wall display — code lines (blue/white)
  'INT-03-DISP-CODE': (ctx, w, h) => {
    const rows = 9;
    for (let i = 0; i < rows; i++) {
      const y = h * (0.1 + i * 0.09);
      const indent = (i % 3) * w * 0.05;
      const len = w * (0.18 + ((i * 37) % 50) / 100 * 0.5);
      ctx.fillStyle = i % 4 === 2 ? '#8FC7FF' : i % 4 === 0 ? '#4FA3E8' : '#2E6FBF';
      ctx.fillRect(w * 0.08 + indent, y, len, h * 0.045);
    }
  },
  // Creative Studio: standing monitor — colourful artwork (orange/red/blue shapes)
  'INT-04-DISP-ART': (ctx, w, h) => {
    ctx.fillStyle = '#E8734A';
    ctx.beginPath();
    ctx.arc(w * 0.34, h * 0.36, w * 0.16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#D8433B';
    ctx.fillRect(w * 0.5, h * 0.42, w * 0.3, h * 0.28);
    ctx.fillStyle = '#2E7FD8';
    ctx.beginPath();
    ctx.moveTo(w * 0.16, h * 0.82);
    ctx.lineTo(w * 0.44, h * 0.58);
    ctx.lineTo(w * 0.62, h * 0.82);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#F2C14E';
    ctx.fillRect(w * 0.68, h * 0.14, w * 0.16, h * 0.18);
  },
  // Management: wall screen — bar/line charts
  'INT-05-DISP-CHART': (ctx, w, h) => {
    for (let i = 0; i < 4; i++) {
      const bh = h * (0.14 + ((i * 29) % 40) / 100);
      ctx.fillStyle = i % 2 ? '#19C6FF' : '#134AB0';
      ctx.fillRect(w * (0.12 + i * 0.14), h * 0.88 - bh, w * 0.09, bh);
    }
    ctx.strokeStyle = '#3FA9F5';
    ctx.lineWidth = w * 0.013;
    ctx.beginPath();
    for (let i = 0; i <= 6; i++) {
      const x = w * (0.5 + i * 0.075);
      const y = h * 0.5 - Math.cos(i * 1.3) * h * 0.2;
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.stroke();
  },
  // Research: large display — blue world map (dots + continents blobs)
  'INT-06-DISP-MAP': (ctx, w, h) => {
    ctx.fillStyle = 'rgba(90,169,245,0.28)';
    for (const [cx, cy, rx, ry] of [[0.22, 0.34, 0.1, 0.14], [0.46, 0.28, 0.07, 0.1], [0.55, 0.55, 0.12, 0.16], [0.78, 0.38, 0.09, 0.12], [0.8, 0.72, 0.05, 0.08]] as const) {
      ctx.beginPath();
      ctx.ellipse(w * cx, h * cy, w * rx, h * ry, 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#19C6FF';
    for (let i = 0; i < 40; i++) {
      ctx.fillRect(w * (0.08 + ((i * 61) % 84) / 100), h * (0.12 + ((i * 37) % 76) / 100), w * 0.012, w * 0.012);
    }
  },
  // QA & Testing: large screen — blue circular check mark
  'INT-07-DISP-CHECK': (ctx, w, h) => {
    ctx.strokeStyle = '#2E7FD8';
    ctx.lineWidth = w * 0.045;
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.5, w * 0.3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = '#19C6FF';
    ctx.lineWidth = w * 0.07;
    ctx.beginPath();
    ctx.moveTo(w * 0.36, h * 0.52);
    ctx.lineTo(w * 0.47, h * 0.64);
    ctx.lineTo(w * 0.68, h * 0.36);
    ctx.stroke();
  },
};

// Backdrop city cards (CR-02 scenery, ENV-016 extents measured): the reference upper band is a
// blurred tower skyline averaging RGB(118,117,122). Tower subdivision and window grids are EST.
// (out-of-focus in the reference); tone family and coverage follow the sampled band.
function paintSkyline(ctx: CanvasRenderingContext2D, w: number, h: number, seed: number): void {
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, '#8C98A2');
  sky.addColorStop(1, '#707C86');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);
  const rnd = (n: number) => {
    const x = Math.sin(seed * 127.1 + n * 311.7) * 43758.5453;
    return x - Math.floor(x);
  };
  let x = -w * 0.02;
  let i = 0;
  while (x < w) {
    const tw = w * (0.14 + rnd(i) * 0.18);
    // towers reach (or nearly reach) the canvas top: the card extends well above the measured
    // band, and every visible slice of it must read as tower fabric, not empty sky
    const th = h * (0.82 + rnd(i + 9) * 0.18);
    const shade = 78 + Math.floor(rnd(i + 3) * 44); // #4E…#92 grey family (ref band RGB(72,80,89))
    ctx.fillStyle = `rgb(${shade},${shade + 2},${shade + 8})`;
    ctx.fillRect(x, h - th, tw, th);
    // faint window grid (blurred in reference → low contrast)
    ctx.fillStyle = `rgba(210,225,235,0.10)`;
    for (let wy = h - th + h * 0.03; wy < h - h * 0.03; wy += h * 0.055) {
      for (let wx = x + tw * 0.12; wx < x + tw - tw * 0.12; wx += tw * 0.24) ctx.fillRect(wx, wy, tw * 0.14, h * 0.028);
    }
    // occasional warm lit windows
    ctx.fillStyle = 'rgba(226,186,130,0.5)';
    for (let k = 0; k < 4; k++) if (rnd(i * 7 + k) > 0.6) ctx.fillRect(x + tw * (0.15 + rnd(i + k) * 0.6), h - th + h * (0.08 + rnd(i + k + 4) * 0.7), tw * 0.13, h * 0.026);
    x += tw * 1.06;
    i++;
  }
}

// Lower-storey facade glazing (ENV-014/015, review R13): the reference shows the facades below
// the terrace as warm-lit window grids. Per-pane treatment: warm dark glass, brighter toward the
// head (interior light), occasional brighter panes. EST. scenery (layout unresolvable at ref res).
function paintFacadePane(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  // review R22: ref facade = pale precast grid with a DENSE regular raster of warm-lit windows
  // (~4 visible rows x ~5 cols per pane, window ≈55% pitch, thin dark mullions). Rhythm EST.
  ctx.fillStyle = '#CBC8CC';
  ctx.fillRect(0, 0, w, h);
  const rows = 4;
  const cols = 5;
  const rowH = h / rows;
  const colW = w / cols;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const k = 0.55 + ((r * 7 + c * 13) % 5) * 0.1125; // varied brightness 0.55..1.0
      const x = c * colW + colW * 0.14;
      const y = r * rowH + rowH * 0.2;
      const ww = colW * 0.72;
      const wh = rowH * 0.6;
      const g = ctx.createLinearGradient(0, y, 0, y + wh);
      g.addColorStop(0, `rgba(${238 * k | 0},${206 * k | 0},${162 * k | 0},1)`);
      g.addColorStop(1, `rgba(${152 * k | 0},${116 * k | 0},${82 * k | 0},1)`);
      ctx.fillStyle = g;
      ctx.fillRect(x, y, ww, wh);
      ctx.fillStyle = `rgba(70,58,50,${0.32 * k})`; // ceiling shadow
      ctx.fillRect(x, y, ww, wh * 0.16);
      ctx.strokeStyle = 'rgba(64,62,66,0.95)';
      ctx.lineWidth = Math.max(1.2, w * 0.012);
      ctx.strokeRect(x, y, ww, wh);
    }
  }
  // vertical shade: brighter at head, darker toward base (ref facade falls into shadow low)
  const sh = ctx.createLinearGradient(0, 0, 0, h);
  sh.addColorStop(0, 'rgba(255,255,255,0.08)');
  sh.addColorStop(0.45, 'rgba(0,0,0,0)');
  sh.addColorStop(1, 'rgba(20,18,26,0.42)');
  ctx.fillStyle = sh;
  ctx.fillRect(0, 0, w, h);
}

const cache = new Map<string, Material>();

/** Material for a catalogued display content, or null when the refId is not a display. */
export function displayMaterialFor(refId: string | undefined, key?: string): Material | null {
  if (key && key.startsWith('city-back')) {
    const hit0 = cache.get(key);
    if (hit0) return hit0;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    paintSkyline(ctx, 512, 256, key.endsWith('right') ? 3 : 11);
    const tex = new CanvasTexture(canvas);
    tex.colorSpace = SRGBColorSpace;
    tex.anisotropy = 4;
    const mat = new MeshBasicMaterial({ map: tex, toneMapped: false });
    cache.set(key, mat);
    return mat;
  }
  if (refId === 'ENV-014' || refId === 'ENV-015') {
    const hitF = cache.get(refId);
    if (hitF) return hitF;
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    paintFacadePane(ctx, 128, 256);
    const tex = new CanvasTexture(canvas);
    tex.colorSpace = SRGBColorSpace;
    const mat = new MeshBasicMaterial({ map: tex, toneMapped: false }); // interior-lit: unlit
    cache.set(refId, mat);
    return mat;
  }
  if (!refId) return null;
  const painter = painters[refId];
  if (!painter) return null;
  const hit = cache.get(refId);
  if (hit) return hit;
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 160;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#0B1E3C'; // dark screen background (emissive blue family)
  ctx.fillRect(0, 0, 256, 160);
  painter(ctx, 256, 160);
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 4;
  const mat = new MeshBasicMaterial({ map: tex, toneMapped: false });
  mat.color.setScalar(1.25); // subtle HDR push so the display still reads emissive under ACES
  cache.set(refId, mat);
  return mat;
}
