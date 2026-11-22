import { EmployeeLife } from './life/employeeLife';
import { lazy, Suspense, useEffect, useState, useMemo } from 'react';
import { ROBOT_VISUAL } from './config/sceneConfig';
const LifePanel = lazy(() => import('./life/LifePanel').then(m => ({ default: m.LifePanel })));
const EmployeePanel = lazy(() => import('./life/EmployeePanel').then(m => ({ default: m.EmployeePanel })));
/**
 * Routes:
 *  - `/`      the reconstructed workspace: the measured dashboard UI shell (ui/) over the full-bleed
 *             3D scene (HOME camera, responsive FOV rule) — matching the locked reference
 *             composition. Production presentation only: no development overlays, no dev-entry
 *             link (presentation correction, 2026-11-20 — dev activation via `?dev` was removed
 *             because a query parameter survives the preview-auth redirect).
 *  - `#/dev`  the dev inspect page (overlay, markers, layers, orbit). Explicit hash entry only;
 *             all inspection capabilities preserved there. UI shell not rendered on the dev route
 *             (measurement tool sees the bare scene).
 *
 * VF-7 selection: click a department/robot/sign/plinth → additive highlight ring + the info chip
 * (shown only while a selection exists; the idle state is carried by the real status strip, which
 * is part of the reference UI — an always-on chip would be an invented element).
 */
import { WorkspaceCanvas } from './scene/WorkspaceCanvas';
import { DevInspector } from './dev/DevInspector';
import { UiShell } from './ui/UiShell';
import type { Selection } from './scene/sceneInteractionBridge';

const isDevRoute = () => window.location.hash.startsWith('#/dev');

export function App() {
  const engine = useMemo(() => new EmployeeLife(), []);
  const [live, setLive] = useState(false);
  const [view, setView] = useState<'3d' | 'floor-plan'>('3d');
  const [dev, setDev] = useState(isDevRoute);
  const [selection, setSelection] = useState<Selection | null>(null);
  useEffect(() => {
    const onHash = () => setDev(isDevRoute());
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelection(null);
    };
    window.addEventListener('hashchange', onHash);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('hashchange', onHash);
      window.removeEventListener('keydown', onKey);
    };
  }, []);
  if (dev) return <DevInspector />;
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#0B0F16' }}>
      <WorkspaceCanvas onSelection={setSelection} life={live ? engine : undefined} view={view} />
      <UiShell
        employees={engine.employees}
        onEmployee={id => {
          const row = engine.getEmployee(id);
          const visual = ROBOT_VISUAL.find(r => r.id === id);
          if (row && visual) setSelection({ refId: id, label: row.name, kind: 'robot', pos: [visual.floorXZ[0], 0.03, visual.floorXZ[1]], ringR: 0.45, detail: `${row.role} · ${row.department}` });
        }}
        onCommand={() => { /* UiShell displays the explicit local-only response. */ }}
        onTab={label => { setLive(label === 'Live View'); setView(label === 'Floor Plan' ? 'floor-plan' : '3d'); }}
      />
      <Suspense fallback={null}>
        {live && <LifePanel engine={engine} />}
        {selection?.kind === 'robot' && engine.getEmployee(selection.refId) ? (
          <EmployeePanel employee={engine.getEmployee(selection.refId)!} onClose={() => setSelection(null)} />
        ) : selection && (
        <div
          style={{
            position: 'absolute',
            left: 16,
            bottom: 130,
            maxWidth: 300,
            padding: '10px 14px',
            borderRadius: 10,
            background: 'rgba(16, 21, 28, 0.9)',
            border: '1px solid rgba(90, 100, 115, 0.4)',
            color: '#e6e8eb',
            font: '13px/1.45 system-ui, sans-serif',
            pointerEvents: 'none',
          }}
          data-testid="info-chip"
        >
          <div style={{ fontWeight: 600, color: '#7FD1E8' }}>{selection.label}</div>
          <div style={{ opacity: 0.85 }}>{selection.detail}</div>
        </div>
        )}
      </Suspense>
    </div>
  );
}
