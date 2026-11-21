/**
 * Routes:
 *  - `/`      the workspace, full-bleed, HOME camera with the responsive FOV rule. Production
 *             presentation only: no development overlays, no dev-entry link (VF-1 presentation
 *             correction, 2026-11-20 — dev activation via `?dev` was removed because a query
 *             parameter survives the preview-auth redirect and can silently put the primary
 *             route into the inspector view).
 *  - `#/dev`  the dev inspect page (overlay, markers, layers, orbit). Explicit hash entry only;
 *             all inspection capabilities preserved there.
 *
 * VF-7 (owner-approved): click/tap a department, robot, sign or the plinth → additive highlight
 * ring + the info chip (bottom-left). The chip shows the immutable global figures
 * (24 AI Employees · 47 visible robots) when nothing is selected. Escape or tapping empty space
 * clears the selection. The HOME camera is never moved by interaction.
 */
import { useEffect, useState } from 'react';
import { WorkspaceCanvas } from './scene/WorkspaceCanvas';
import { DevInspector } from './dev/DevInspector';
import type { Selection } from './scene/sceneInteractionBridge';

const isDevRoute = () => window.location.hash.startsWith('#/dev');

export function App() {
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
    <div style={{ position: 'fixed', inset: 0 }}>
      <WorkspaceCanvas onSelection={setSelection} />
      <div
        style={{
          position: 'absolute',
          left: 16,
          bottom: 16,
          maxWidth: 300,
          padding: '10px 14px',
          borderRadius: 10,
          background: 'rgba(16, 21, 28, 0.86)',
          border: '1px solid rgba(90, 100, 115, 0.4)',
          color: '#e6e8eb',
          font: '13px/1.45 system-ui, sans-serif',
          pointerEvents: 'none',
        }}
        data-testid="info-chip"
      >
        {selection ? (
          <>
            <div style={{ fontWeight: 600, color: '#7FD1E8' }}>{selection.label}</div>
            <div style={{ opacity: 0.85 }}>{selection.detail}</div>
          </>
        ) : (
          <div style={{ opacity: 0.75 }}>24 AI Employees · 47 visible robots</div>
        )}
      </div>
    </div>
  );
}
