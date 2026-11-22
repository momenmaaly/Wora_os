/**
 * Renders the structural greybox (model.ts) and the Mission 006-A environment (environment.ts).
 * One mesh per descriptor, plus outline edges so partition lines remain readable.
 * Labels (sign text, plinth wordmark/logo) are canvas textures and are skipped in flat mode.
 */
import { useMemo } from 'react';
import { LifeActors } from '../life/LifeActors';
import type { EmployeeLife } from '../life/employeeLife';
import {
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CircleGeometry,
  CylinderGeometry,
  SphereGeometry,
  EdgesGeometry,
  PlaneGeometry,
  CanvasTexture,
  DoubleSide,
  type Material,
} from 'three';
import { buildGreyboxModel, type BoxSpec, type CylinderSpec, type DiscSpec, type LabelSpec, type PrimitiveSpec, type RibbonSpec, type SphereSpec } from './model';
import { buildEnvironmentModel, type EnvironmentModel } from './environment';
import { buildInteriors, buildStructureCompletion } from './interiors';
import { buildRobots } from './robots';
import { displayMaterialFor } from './displayContent';
import { createDeptMaterials, createFlatMaterial, createMaterials, DEPT_FLAT_COLORS, EDGE_COLOR, SHADOW_EXCLUDE_CAST, SHADOW_EXCLUDE_RECEIVE } from './materials';
import type { DeptId } from '../config/sceneConfig';

const unitBox = new BoxGeometry(1, 1, 1);
const unitBoxEdges = new EdgesGeometry(unitBox);

/**
 * VF-6 (mobile fidelity, approved default Q-VF-06): presentation-only thickness floor. On narrow
 * viewports (< 900 CSS px) sub-metre line-like elements (mullions 0.04–0.06 m, posts 0.025 m,
 * strips 0.03 m) fall below ~1 device pixel and visually vanish. Thin dimensions are multiplied
 * by a fixed factor at render time — geometry data, HOME composition and desktop rendering
 * (width >= 900 CSS px: factor 1) are unchanged; flat measurement mode always uses factor 1.
 * Applied only to the environment line-like groups; furniture/robots/signs are unaffected.
 */
const MOBILE_BOOST = 2.2;
function boostThin<T extends { center: [number, number, number]; size?: [number, number, number]; radius?: number; height?: number }>(specs: readonly T[], k: number): T[] {
  if (k === 1) return specs as T[];
  return specs.map((sp) => {
    const out: T = { ...sp } as T;
    if (Array.isArray(out.size)) {
      const s2 = [...out.size] as [number, number, number];
      for (let i = 0; i < 3; i++) if (s2[i] < 0.08) s2[i] = Math.min(s2[i] * k, 0.09);
      out.size = s2;
    }
    if (typeof out.radius === 'number' && out.radius < 0.04) out.radius = Math.min(out.radius * k, 0.05);
    return out;
  });
}

/** VF-1 shadow participation per material key (glass/backdrop/emissives excluded, VAC-LGT-02). */
function shadowProps(material: string) {
  return { castShadow: !SHADOW_EXCLUDE_CAST.has(material as never), receiveShadow: !SHADOW_EXCLUDE_RECEIVE.has(material as never) };
}

function BoxPrimitive({ spec, materials, edges, materialOverride }: { spec: BoxSpec; materials: Record<string, Material>; edges: boolean; materialOverride?: Material }) {
  return (
    <group position={spec.center} rotation={[spec.tilt ?? 0, spec.rotationY, 0]} scale={spec.size} name={spec.key} userData={{ refId: spec.refId }}>
      <mesh geometry={unitBox} material={materialOverride ?? materials[spec.material]} renderOrder={spec.material === 'partition' || spec.material === 'balustrade' ? 2 : 0} {...shadowProps(spec.material)} />
      {edges && (
        <lineSegments geometry={unitBoxEdges}>
          <lineBasicMaterial color={EDGE_COLOR} />
        </lineSegments>
      )}
    </group>
  );
}

function CylinderPrimitive({ spec, materials, edges }: { spec: CylinderSpec; materials: Record<string, Material>; edges: boolean }) {
  const geometry = useMemo(() => new CylinderGeometry(spec.radius, spec.radius, spec.height, spec.segments), [spec]);
  const edgeGeometry = useMemo(() => new EdgesGeometry(geometry, 30), [geometry]);
  return (
    <group position={spec.center} name={spec.key} userData={{ refId: spec.refId }}>
      <mesh geometry={geometry} material={materials[spec.material]} {...shadowProps(spec.material)} />
      {edges && (
        <lineSegments geometry={edgeGeometry}>
          <lineBasicMaterial color={EDGE_COLOR} />
        </lineSegments>
      )}
    </group>
  );
}

function SpherePrimitive({ spec, materials }: { spec: SphereSpec; materials: Record<string, Material> }) {
  const geometry = useMemo(() => new SphereGeometry(spec.radius, 18, 14), [spec]);
  return (
    <mesh geometry={geometry} material={materials[spec.material]} position={spec.center} name={spec.key} userData={{ refId: spec.refId }} {...shadowProps(spec.material)} />
  );
}

function RibbonPrimitive({ spec, materials, materialOverride }: { spec: RibbonSpec; materials: Record<string, Material>; materialOverride?: Material }) {
  const geometry = useMemo(() => {
    const n = spec.pts.length;
    const pos = new Float32Array(n * 2 * 3);
    for (let i = 0; i < n; i++) {
      const { u, yTop, yBot } = spec.pts[i];
      const a = spec.axis === 'x' ? [u, yTop, spec.at] : [spec.at, yTop, u];
      const b = spec.axis === 'x' ? [u, yBot, spec.at] : [spec.at, yBot, u];
      pos.set(a, i * 6);
      pos.set(b, i * 6 + 3);
    }
    const idx: number[] = [];
    for (let i = 0; i < n - 1; i++) {
      const a = i * 2, b = i * 2 + 1, c = i * 2 + 2, d = i * 2 + 3;
      idx.push(a, b, c, b, d, c);
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(pos, 3));
    g.setIndex(idx);
    // review R16: UVs so textured overrides (facade glazing) map along the ribbon
    const uv = new Float32Array(n * 2 * 2);
    let uSpan = 0;
    const us: number[] = [];
    for (let i = 0; i < n; i++) {
      const u = spec.pts[i].u;
      if (i) uSpan += Math.abs(u - spec.pts[i - 1].u);
      us.push(uSpan);
    }
    const yTop = spec.pts[0].yTop;
    const yBot = spec.pts[0].yBot;
    for (let i = 0; i < n; i++) {
      const u = uSpan ? us[i] / uSpan : 0;
      uv.set([u, 1], i * 4);
      uv.set([u, 0], i * 4 + 2);
    }
    g.setAttribute('uv', new BufferAttribute(uv, 2));
    g.computeVertexNormals();
    void yTop; void yBot;
    return g;
  }, [spec]);
  return (
    <mesh geometry={geometry} material={materialOverride ?? materials[spec.material]} name={spec.key} userData={{ refId: spec.refId }} {...shadowProps(spec.material)} />
  );
}

function DiscPrimitive({ spec, materials }: { spec: DiscSpec; materials: Record<string, Material> }) {
  const geometry = useMemo(() => {
    const g = new CircleGeometry(spec.radius, 32);
    if (spec.normal === 'x') g.rotateY(Math.PI / 2);
    return g;
  }, [spec]);
  return (
    <mesh geometry={geometry} material={materials[spec.material]} position={spec.center} name={spec.key} userData={{ refId: spec.refId }} {...shadowProps(spec.material)} />
  );
}

/* ── Canvas label painters (greybox level: catalogued text + crude glyphs, no typography match) ── */

function drawIcon(ctx: CanvasRenderingContext2D, icon: string, x: number, y: number, s: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = '#F2F4FA';
  ctx.strokeStyle = '#F2F4FA';
  ctx.lineWidth = Math.max(2, s * 0.09);
  switch (icon) {
    case 'crown':
      ctx.beginPath();
      ctx.moveTo(-s * 0.5, s * 0.35);
      ctx.lineTo(-s * 0.5, -s * 0.25);
      ctx.lineTo(-s * 0.17, 0);
      ctx.lineTo(0, -s * 0.42);
      ctx.lineTo(s * 0.17, 0);
      ctx.lineTo(s * 0.5, -s * 0.25);
      ctx.lineTo(s * 0.5, s * 0.35);
      ctx.closePath();
      ctx.fill();
      break;
    case 'megaphone':
      ctx.beginPath();
      ctx.moveTo(-s * 0.45, -s * 0.1);
      ctx.lineTo(s * 0.3, -s * 0.42);
      ctx.lineTo(s * 0.3, s * 0.42);
      ctx.lineTo(-s * 0.45, s * 0.1);
      ctx.closePath();
      ctx.fill();
      ctx.fillRect(-s * 0.5, -s * 0.05, s * 0.22, s * 0.35);
      break;
    case 'code':
      ctx.font = `bold ${Math.round(s * 0.95)}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('</>', 0, 0);
      break;
    case 'palette': {
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#131B29';
      for (const [dx, dy] of [[-0.15, -0.12], [0.12, -0.15], [0.16, 0.1], [-0.05, 0.16]])
        { ctx.beginPath(); ctx.arc(dx * s, dy * s, s * 0.07, 0, Math.PI * 2); ctx.fill(); }
      break;
    }
    case 'chart':
      for (const [dx, h] of [[-0.28, 0.3], [0, 0.5], [0.28, 0.7]] as const) ctx.fillRect(dx * s - s * 0.1, s * 0.4 - h * s, s * 0.2, h * s);
      break;
    case 'flask':
      ctx.beginPath();
      ctx.moveTo(-s * 0.12, -s * 0.42);
      ctx.lineTo(s * 0.12, -s * 0.42);
      ctx.lineTo(s * 0.12, -s * 0.1);
      ctx.lineTo(s * 0.4, s * 0.4);
      ctx.lineTo(-s * 0.4, s * 0.4);
      ctx.lineTo(-s * 0.12, -s * 0.1);
      ctx.closePath();
      ctx.fill();
      break;
    case 'shield':
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.45);
      ctx.lineTo(s * 0.38, -s * 0.28);
      ctx.lineTo(s * 0.3, s * 0.2);
      ctx.lineTo(0, s * 0.45);
      ctx.lineTo(-s * 0.3, s * 0.2);
      ctx.lineTo(-s * 0.38, -s * 0.28);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#131B29';
      ctx.lineWidth = s * 0.12;
      ctx.beginPath();
      ctx.moveTo(-s * 0.15, 0);
      ctx.lineTo(-s * 0.02, s * 0.14);
      ctx.lineTo(s * 0.2, -s * 0.14);
      ctx.stroke();
      break;
    case 'wora-mark': {
      // Stylised interlocking-W ribbon mark, cyan→blue gradient (ENV-003, colours est.)
      const g = ctx.createLinearGradient(-s * 0.6, -s * 0.4, s * 0.6, s * 0.4);
      g.addColorStop(0, '#29C5DA');
      g.addColorStop(1, '#1E7FB0');
      ctx.fillStyle = g;
      ctx.strokeStyle = g;
      ctx.lineWidth = s * 0.22;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(-s * 0.55, -s * 0.3);
      ctx.lineTo(-s * 0.28, s * 0.32);
      ctx.lineTo(0, -s * 0.05);
      ctx.lineTo(s * 0.28, s * 0.32);
      ctx.lineTo(s * 0.55, -s * 0.3);
      ctx.stroke();
      break;
    }
  }
  ctx.restore();
}

function makeLabelTexture(spec: LabelSpec): CanvasTexture {
  const PX = 220; // canvas px per metre (reset: crisper at 46 px/m reference scale)
  const w = Math.max(64, Math.round(spec.size[0] * PX));
  const h = Math.max(24, Math.round(spec.size[1] * PX));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  if (spec.icon === 'wora-mark') {
    // fill the measured plane (the mark's size_m IS its measured extent)
    // mark plane is wide (measured 1.478 × 0.674) — size the glyph by width, capped by height
    drawIcon(ctx, 'wora-mark', w / 2, h / 2, Math.min(w * 0.52, h * 0.98));
  } else {
    let iconS = h * 0.62;
    const text = spec.text;
    let fontPx = Math.round(h * 0.52);
    ctx.font = `bold ${fontPx}px 'Segoe UI', system-ui, sans-serif`;
    let tw = ctx.measureText(text).width;
    const hasIcon = !!spec.icon;
    let total = (hasIcon ? iconS * 1.3 : 0) + tw;
    // fit inside the plate with margins (reference signs keep text within the plate)
    const maxW = w * 0.9;
    if (total > maxW) {
      const k = maxW / total;
      iconS *= k;
      fontPx = Math.round(fontPx * k);
      ctx.font = `bold ${fontPx}px 'Segoe UI', system-ui, sans-serif`;
      tw = ctx.measureText(text).width;
      total = (hasIcon ? iconS * 1.3 : 0) + tw;
    }
    if (!hasIcon) {
      // text-only label (plaza wordmark): fill the measured plane — grow to width, then stretch
      // horizontally if the height cap binds (the ref letters fill both extents)
      const byWidth = fontPx * (w * 0.9) / tw;
      const grown = Math.round(Math.min(byWidth, h * 0.9));
      ctx.font = `bold ${grown}px 'Segoe UI', system-ui, sans-serif`;
      tw = ctx.measureText(text).width;
      if (tw < w * 0.9) {
        ctx.save();
        ctx.translate(w / 2, h / 2);
        ctx.scale((w * 0.9) / tw, 1);
        ctx.fillStyle = spec.color ?? '#F2F4FA';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 0, 0);
        ctx.restore();
        const tex2 = new CanvasTexture(canvas);
        tex2.anisotropy = 4;
        tex2.colorSpace = 'color';
        return tex2;
      }
    }
    let x = (w - total) / 2;
    if (hasIcon) {
      drawIcon(ctx, spec.icon!, x + iconS / 2, h / 2, iconS);
      x += iconS * 1.3;
    }
    ctx.fillStyle = spec.color ?? '#F2F4FA';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.font = `bold ${fontPx}px 'Segoe UI', system-ui, sans-serif`;
    ctx.fillText(text, x, h * 0.54);
  }
  const tex = new CanvasTexture(canvas);
  tex.anisotropy = 4;
  tex.colorSpace = 'color';
  return tex;
}

function LabelPrimitive({ spec }: { spec: LabelSpec }) {
  const texture = useMemo(() => makeLabelTexture(spec), [spec]);
  const geometry = useMemo(() => new PlaneGeometry(spec.size[0], spec.size[1]), [spec]);
  const flat = spec.orientation === 'flat';
  return (
    <group position={spec.center} rotation={[0, spec.rotationY, 0]} name={spec.key} userData={{ refId: spec.refId }}>
      <mesh geometry={geometry} rotation={flat ? [-Math.PI / 2, 0, 0] : [0, 0, 0]} position={[0, 0, flat ? 0 : 0]}>
        <meshBasicMaterial map={texture} transparent toneMapped={false} side={DoubleSide} />
      </mesh>
    </group>
  );
}

function Primitive({ spec, materials, edges = true, materialOverride }: { spec: PrimitiveSpec; materials: Record<string, Material>; edges?: boolean; materialOverride?: Material }) {
  if (spec.kind === 'box') return <BoxPrimitive spec={spec} materials={materials} edges={edges} materialOverride={materialOverride} />;
  if (spec.kind === 'sphere') return <SpherePrimitive spec={spec} materials={materials} />;
  return <CylinderPrimitive spec={spec} materials={materials} edges={edges} />;
}

export interface GreyboxLayers {
  mass: boolean;
  partitions: boolean;
  signs: boolean;
  balustrades: boolean;
  fascia: boolean;
  strips: boolean;
  backdrop: boolean;
  /** VF-2 structure completion (walnut wall, partition frames) */
  structure: boolean;
  /** VF-3 furniture / large displays */
  interiors: boolean;
  /** VF-4 robots */
  robots: boolean;
}

export const DEFAULT_LAYERS: GreyboxLayers = { mass: true, partitions: true, signs: true, balustrades: true, fascia: true, strips: true, backdrop: true, structure: true, interiors: true, robots: true };

export function Greybox({ layers = DEFAULT_LAYERS, flat = false, life }: { layers?: GreyboxLayers; flat?: boolean; life?: EmployeeLife }) {
  const model = useMemo(() => buildGreyboxModel(), []);
  const env: EnvironmentModel = useMemo(() => buildEnvironmentModel(), []);
  const mobileK = useMemo(() => (!flat && typeof window !== 'undefined' && Math.min(window.innerWidth, window.innerHeight) < 900 && window.innerWidth < window.innerHeight ? MOBILE_BOOST : 1), [flat]);
  const structureSpecs = useMemo(() => (flat ? [] : buildStructureCompletion()), [flat]);
  const interiorSpecs = useMemo(() => (flat ? [] : buildInteriors()), [flat]);
  const robotSpecs = useMemo(() => (flat ? [] : buildRobots()), [flat]);
  const actorSpecs = useMemo(() => {
    const grouped = new Map<string, PrimitiveSpec[]>();
    for (const spec of robotSpecs) {
      if (!spec.refId) continue;
      const actor = grouped.get(spec.refId) ?? [];
      actor.push(spec);
      grouped.set(spec.refId, actor);
    }
    return grouped;
  }, [robotSpecs]);
  const materials = useMemo(() => createMaterials(flat), [flat]);
  const deptFloor = useMemo(
    () =>
      Object.fromEntries(
        model.departments.map((d) => [d.id as DeptId, flat ? { ...materials, floor: createFlatMaterial(DEPT_FLAT_COLORS[d.id]) } : createDeptMaterials(materials, d.id as DeptId, flat)]),
      ),
    [model, materials, flat],
  );
  const edges = !flat;
  return (
    <group name="World">
      <group name="Building">
        <Primitive spec={model.slab} materials={materials} edges={edges} />
        {layers.mass && <Primitive spec={model.mass} materials={materials} edges={edges} />}
        {layers.fascia && (
          <group name="Facade">
            {env.fascia.map((f) => <RibbonPrimitive key={f.key} spec={f} materials={materials} />)}
            {env.facadePanes.map((f) => <RibbonPrimitive key={f.key} spec={f} materials={materials} materialOverride={displayMaterialFor(f.refId) ?? undefined} />)}
            {boostThin(env.facadeMullions, mobileK).map((f) => <BoxPrimitive key={f.key} spec={f} materials={materials} edges={false} />)}
            {boostThin(env.facadeTransoms, mobileK).map((f) => <BoxPrimitive key={f.key} spec={f} materials={materials} edges={false} />)}
            {env.backGlazingPanes.map((f) => <BoxPrimitive key={f.key} spec={f} materials={materials} edges={false} materialOverride={displayMaterialFor(f.refId) ?? undefined} />)}
            {boostThin(env.backGlazingMullions, mobileK).map((f) => <BoxPrimitive key={f.key} spec={f} materials={materials} edges={false} />)}
          </group>
        )}
        {layers.balustrades && (
          <group name="Balustrades">
            {model.balustrades.map((b) => <Primitive key={b.key} spec={b} materials={materials} edges={edges} />)}
            {boostThin(env.balustradeFrames, mobileK).map((b) => <BoxPrimitive key={b.key} spec={b} materials={materials} edges={false} />)}
          </group>
        )}
      </group>
      <group name="Atrium">
        <Primitive spec={model.plinth} materials={materials} edges={edges} />
        {!flat && <CylinderPrimitive spec={env.plinthRim} materials={materials} edges={false} />}
        {!flat && env.plinthLabels.map((l) => <LabelPrimitive key={l.key} spec={l} />)}
      </group>
      <group name="Departments">
        {model.departments.map((d) => (
          <group key={d.id} name={d.id} userData={{ name: d.name }}>
            <Primitive spec={d.floor} materials={deptFloor[d.id]} edges={false} />
            {layers.partitions && d.walls.map((w) => <Primitive key={w.key} spec={w} materials={materials} edges={edges} />)}
            {layers.signs && <Primitive spec={d.sign} materials={materials} edges={edges} />}
            {layers.signs && !flat && env.signFaces.filter((f) => f.refId === d.sign.refId).map((f) => <LabelPrimitive key={f.key} spec={f} />)}
          </group>
        ))}
      </group>
      {layers.strips && (
        <group name="LightStrips">
          {boostThin(env.partitionStrips, mobileK).map((f) => <BoxPrimitive key={f.key} spec={f} materials={materials} edges={false} />)}
          {boostThin(env.edgeStrips, mobileK).map((f) => <BoxPrimitive key={f.key} spec={f} materials={materials} edges={false} />)}
        </group>
      )}
      {/* VF-2/VF-3/VF-4 content groups. Flat mode skips them: measurement neutrality for the
          rendered check (identical behaviour to the 006-A flat mode; documented in the reports). */}
      {!flat && layers.structure && (
        <group name="StructureCompletion">
          {structureSpecs.map((f) => <Primitive key={f.key} spec={f} materials={materials} edges={false} />)}
        </group>
      )}
      {!flat && layers.interiors && (
        <group name="Interiors">
          {interiorSpecs.map((f) => <Primitive key={f.key} spec={f} materials={materials} edges={false} materialOverride={displayMaterialFor(f.refId, f.key) ?? undefined} />)}
        </group>
      )}
      {!flat && layers.robots && (
        <LifeActors key={life ? "live" : "static"} engine={life} renderActor={(id) => (actorSpecs.get(id) ?? []).map(f => <Primitive key={f.key} spec={f} materials={materials} edges={false} />)} />
      )}
      {layers.backdrop && (
        <group name="Backdrop">
          {env.backdropDecks.map((f) => <BoxPrimitive key={f.key} spec={f} materials={materials} edges={false} />)}
          {env.backdropCity.map((f) => <BoxPrimitive key={f.key} spec={f} materials={materials} edges={false} materialOverride={displayMaterialFor(f.refId, f.key) ?? undefined} />)}
          {env.backdropParapet.map((f) => <RibbonPrimitive key={f.key} spec={f} materials={materials} />)}
          {env.backdropParapetStrips.map((f) => <RibbonPrimitive key={f.key} spec={f} materials={materials} />)}
          {env.backdropTrees.map((f) => <DiscPrimitive key={f.key} spec={f} materials={materials} />)}
          {env.backdropTreeTrunks.map((f) => <CylinderPrimitive key={f.key} spec={f} materials={materials} edges={false} />)}
        </group>
      )}
    </group>
  );
}
