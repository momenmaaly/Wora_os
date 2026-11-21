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
 * No UI panels are drawn: they are DOM overlays for a later phase (architecture/04 §1.4).
 */
import { useEffect, useState } from 'react';
import { WorkspaceCanvas } from './scene/WorkspaceCanvas';
import { DevInspector } from './dev/DevInspector';

const isDevRoute = () => window.location.hash.startsWith('#/dev');

export function App() {
  const [dev, setDev] = useState(isDevRoute);
  useEffect(() => {
    const onHash = () => setDev(isDevRoute());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  if (dev) return <DevInspector />;
  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <WorkspaceCanvas />
    </div>
  );
}
