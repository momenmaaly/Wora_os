/**
 * Routes:
 *  - `/`            the greybox, full-bleed, HOME camera with the responsive FOV rule;
 *  - `#/dev`, `?dev` the dev inspect page (overlay, markers, layers, orbit).
 * No UI panels are drawn: they are DOM overlays for a later phase (architecture/04 §1.4).
 */
import { useEffect, useState } from 'react';
import { WorkspaceCanvas } from './scene/WorkspaceCanvas';
import { DevInspector } from './dev/DevInspector';

const isDevRoute = () => window.location.hash.startsWith('#/dev') || new URLSearchParams(window.location.search).has('dev');

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
      <a
        href="#/dev"
        style={{ position: 'absolute', left: 12, bottom: 12, color: '#e6e8eb', font: '12px system-ui, sans-serif', opacity: 0.75 }}
      >
        Structural greybox (WORA-3D-GREYBOX-004) · open dev inspector
      </a>
    </div>
  );
}
