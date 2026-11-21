/**
 * Dev inspect route (`#/dev` or `?dev`). Shows the greybox with:
 *  - frame mode: the reference frame (1672:941, letterboxed) or the full viewport (responsive rule);
 *  - the locked reference as a QA overlay (DEV server only, analysis/06 P-6) with an opacity slider;
 *  - measured reference px (red ×) vs live projected world points (cyan ●) with deviation links;
 *  - the measured slab-edge lines and UI occluder rectangles;
 *  - layer toggles and a free-orbit mode with "Reset to HOME".
 *
 * URL params (for scripted checks): overlay=<0..1>, markers=0|1, panel=0|1, frame=reference|fill,
 * robots=0|1, ui=0|1, edges=0|1, flat=0|1 (unlit ID colours), mass|partitions|signs|balustrades|fascia|strips|backdrop=0|1.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { WorkspaceCanvas } from '../scene/WorkspaceCanvas';
import { DEFAULT_LAYERS, type GreyboxLayers } from '../scene/Greybox';
import { REFERENCE_ASPECT, type FovRule } from '../scene/camera';
import { DEPARTMENTS, ROBOT_POSITIONS, UI_OCCLUDERS } from '../config/sceneConfig';
import { SLAB_EDGE_LINES } from '../config/referencePoints';
import { MARKERS } from './markerSets';
import { ProjectedMarkers } from './ProjectedMarkers';
import { OrbitInspect } from './OrbitInspect';
import { overlayTransform, refToCanvas, REF_H, REF_W } from './overlayTransform';
import { useElementSize, useViewportSize } from './useSize';
import { renderedCheck, type RenderedCheckResult } from './renderedCheck';
import type { PerspectiveCamera } from 'three';

function runRenderedCheck(): RenderedCheckResult | null {
  const canvas = document.querySelector('canvas');
  const camera = (window as unknown as { __WORA_CAMERA__?: PerspectiveCamera }).__WORA_CAMERA__;
  return canvas && camera ? renderedCheck(canvas, camera) : null;
}
(window as unknown as { __WORA_RENDERED_CHECK__?: () => RenderedCheckResult | null }).__WORA_RENDERED_CHECK__ = runRenderedCheck;

const OVERLAY_URL: string = import.meta.env.DEV ? __REFERENCE_OVERLAY_URL__ : '';

function param(name: string): string | null {
  const search = new URLSearchParams(window.location.search);
  if (search.has(name)) return search.get(name);
  const hashQuery = window.location.hash.split('?')[1];
  return hashQuery ? new URLSearchParams(hashQuery).get(name) : null;
}
const flag = (name: string, dflt: boolean) => {
  const p = param(name);
  return p === null ? dflt : p !== '0' && p !== 'false';
};

export function DevInspector() {
  const [frame, setFrame] = useState<'reference' | 'fill'>(param('frame') === 'fill' ? 'fill' : 'reference');
  const [overlayOn, setOverlayOn] = useState(param('overlay') !== null && param('overlay') !== '0');
  const [opacity, setOpacity] = useState(() => {
    const p = Number(param('overlay'));
    return Number.isFinite(p) && p > 0 && p <= 1 ? p : 0.5;
  });
  const [markersOn, setMarkersOn] = useState(flag('markers', true));
  const [robotsOn, setRobotsOn] = useState(flag('robots', true));
  const [uiOn, setUiOn] = useState(flag('ui', false));
  const [edgesOn, setEdgesOn] = useState(flag('edges', true));
  const [panelOn, setPanelOn] = useState(flag('panel', true));
  const [layers, setLayers] = useState<GreyboxLayers>(() => ({
    mass: flag('mass', DEFAULT_LAYERS.mass),
    partitions: flag('partitions', DEFAULT_LAYERS.partitions),
    signs: flag('signs', DEFAULT_LAYERS.signs),
    balustrades: flag('balustrades', DEFAULT_LAYERS.balustrades),
    fascia: flag('fascia', DEFAULT_LAYERS.fascia),
    strips: flag('strips', DEFAULT_LAYERS.strips),
    backdrop: flag('backdrop', DEFAULT_LAYERS.backdrop),
  }));
  const [flat, setFlat] = useState(flag('flat', false));
  const [orbit, setOrbit] = useState(false);
  const [homeToken, setHomeToken] = useState(0);
  const [rule, setRule] = useState<{ rule: FovRule; fov: number }>({ rule: 'reference', fov: 0 });
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [check, setCheck] = useState<RenderedCheckResult | null>(null);

  const viewport = useViewportSize();
  const stageStyle: CSSProperties = useMemo(() => {
    if (frame === 'fill') return { position: 'absolute', inset: 0 };
    const va = viewport.width / viewport.height;
    const w = va > REFERENCE_ASPECT ? viewport.height * REFERENCE_ASPECT : viewport.width;
    const h = w / REFERENCE_ASPECT;
    return { position: 'absolute', width: w, height: h, left: (viewport.width - w) / 2, top: (viewport.height - h) / 2 };
  }, [frame, viewport]);

  const [stageRef, stage] = useElementSize<HTMLDivElement>();
  const t = overlayTransform(stage.width || 1, stage.height || 1, rule.fov || 12);
  const visibleMarkers = useMemo(() => MARKERS.filter((m) => robotsOn || m.group !== 'robot'), [robotsOn]);
  const onRule = useCallback((r: FovRule, fov: number) => setRule({ rule: r, fov }), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'h' || e.key === 'H') setPanelOn((v) => !v);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const resetHome = () => {
    setOrbit(false);
    setHomeToken((n) => n + 1);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#16181b', overflow: 'hidden', fontFamily: 'system-ui, sans-serif' }}>
      <div ref={stageRef} style={stageStyle} data-testid="stage">
        <WorkspaceCanvas layers={layers} flat={flat} homeToken={homeToken} onRule={onRule}>
          {orbit && <OrbitInspect />}
          {markersOn && <ProjectedMarkers markers={visibleMarkers} svgRef={svgRef} />}
        </WorkspaceCanvas>

        {overlayOn && OVERLAY_URL && (
          <img
            src={OVERLAY_URL}
            alt="Locked reference (DEV overlay)"
            style={{
              position: 'absolute',
              left: t.offsetX,
              top: t.offsetY,
              width: REF_W * t.scale,
              height: REF_H * t.scale,
              opacity,
              pointerEvents: 'none',
            }}
          />
        )}

        <svg ref={svgRef} width={stage.width} height={stage.height} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {uiOn &&
            UI_OCCLUDERS.map((r) => {
              const [x, y] = refToCanvas(t, [r.x, r.y]);
              return (
                <g key={r.id}>
                  <rect x={x} y={y} width={r.w * t.scale} height={r.h * t.scale} fill="rgba(255,200,0,0.08)" stroke="#ffc800" strokeDasharray="6 4" />
                  <text x={x + 4} y={y + 14} fill="#ffc800" fontSize={11}>{r.id}</text>
                </g>
              );
            })}
          {edgesOn &&
            SLAB_EDGE_LINES.map((l) => {
              const [x1, y1] = refToCanvas(t, l.a);
              const [x2, y2] = refToCanvas(t, l.b);
              return <line key={l.id} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ff8c1a" strokeWidth={2} strokeDasharray={l.id.endsWith('spec') ? '8 5' : undefined} />;
            })}
          {markersOn &&
            visibleMarkers.map((m, i) => {
              const [mx, my] = m.measuredPx ? refToCanvas(t, m.measuredPx) : [0, 0];
              const color = m.group === 'robot' ? '#7fdcff' : '#21e6c1';
              return (
                <g key={m.id}>
                  {m.measuredPx && (
                    <>
                      <line data-link={i} x1={mx} y1={my} x2={mx} y2={my} stroke="#ffffff" strokeOpacity={0.7} />
                      <path d={`M${mx - 4},${my - 4}L${mx + 4},${my + 4}M${mx - 4},${my + 4}L${mx + 4},${my - 4}`} stroke="#ff3b3b" strokeWidth={2} />
                    </>
                  )}
                  <g data-proj={i}>
                    <circle r={m.group === 'robot' ? 2.5 : 3.5} fill={color} />
                    {m.group !== 'robot' && <text x={6} y={-6} fill={color} fontSize={10}>{m.id}</text>}
                  </g>
                </g>
              );
            })}
        </svg>
      </div>

      {panelOn && (
        <div style={panelStyle} data-testid="dev-panel">
          <div style={{ fontWeight: 600, marginBottom: 6 }}>WORA greybox · dev inspect</div>
          <div style={{ opacity: 0.8, marginBottom: 8 }}>
            canvas {Math.round(stage.width)}×{Math.round(stage.height)} · aspect {(stage.width / (stage.height || 1)).toFixed(3)}
            <br />
            FOV rule <b>{rule.rule}</b> · vFOV {rule.fov.toFixed(3)}°
            <br />
            {DEPARTMENTS.length} departments · {ROBOT_POSITIONS.length} robot positions (markers only)
          </div>
          <Row label="Frame">
            <select value={frame} onChange={(e) => setFrame(e.target.value as 'reference' | 'fill')}>
              <option value="reference">Reference 1672:941</option>
              <option value="fill">Fill viewport</option>
            </select>
          </Row>
          <Row label="Reference overlay">
            {OVERLAY_URL ? <input type="checkbox" checked={overlayOn} onChange={(e) => setOverlayOn(e.target.checked)} /> : <i>dev server only</i>}
          </Row>
          {OVERLAY_URL && (
            <Row label={`Opacity ${Math.round(opacity * 100)}%`}>
              <input type="range" min={0} max={1} step={0.05} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} />
            </Row>
          )}
          <Row label="Point markers"><input type="checkbox" checked={markersOn} onChange={(e) => setMarkersOn(e.target.checked)} /></Row>
          <Row label="Robot head markers"><input type="checkbox" checked={robotsOn} onChange={(e) => setRobotsOn(e.target.checked)} /></Row>
          <Row label="Measured slab edges"><input type="checkbox" checked={edgesOn} onChange={(e) => setEdgesOn(e.target.checked)} /></Row>
          <Row label="UI occluder rects"><input type="checkbox" checked={uiOn} onChange={(e) => setUiOn(e.target.checked)} /></Row>
          {(Object.keys(layers) as (keyof GreyboxLayers)[]).map((k) => (
            <Row key={k} label={`Layer: ${k}`}>
              <input type="checkbox" checked={layers[k]} onChange={(e) => setLayers({ ...layers, [k]: e.target.checked })} />
            </Row>
          ))}
          <Row label="Flat ID colours (measurement)"><input type="checkbox" checked={flat} onChange={(e) => setFlat(e.target.checked)} /></Row>
          {flat && (
            <>
              <button onClick={() => setCheck(runRenderedCheck())} style={{ marginTop: 4, width: '100%' }}>
                Rendered check (flat, HOME; hide partitions)
              </button>
              {check && (
                <div style={{ marginTop: 4 }} data-testid="rendered-check">
                  rendered vs projected max: plinth {check.summary.plinthMaxPx} px · floor corners {check.summary.floorCornerMaxPx} px · signs {check.summary.signMaxPx} px
                </div>
              )}
            </>
          )}
          <Row label="Free orbit">
            <input type="checkbox" checked={orbit} onChange={(e) => (e.target.checked ? setOrbit(true) : resetHome())} />
          </Row>
          <button onClick={resetHome} style={{ marginTop: 6, width: '100%' }}>Reset to HOME camera</button>
          <button onClick={() => setPanelOn(false)} style={{ marginTop: 4, width: '100%' }}>Hide panel (press H to toggle)</button>
          <div style={{ marginTop: 8, opacity: 0.7, fontSize: 11, lineHeight: 1.4 }}>
            <span style={{ color: '#ff3b3b' }}>×</span> measured reference px · <span style={{ color: '#21e6c1' }}>●</span> projected world point ·
            <span style={{ color: '#ff8c1a' }}> —</span> measured slab-edge lines. Markers compare only in the HOME pose.
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, margin: '3px 0' }}>
      <span>{label}</span>
      {children}
    </label>
  );
}

const panelStyle: CSSProperties = {
  position: 'absolute',
  top: 12,
  right: 12,
  width: 260,
  padding: 12,
  background: 'rgba(20,22,26,0.88)',
  color: '#e6e8eb',
  fontSize: 12,
  borderRadius: 8,
  border: '1px solid #3a3f46',
};
