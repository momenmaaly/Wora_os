import { useEffect, useRef, useState } from 'react';
import { EmployeeLife } from './employeeLife';
import { LifeAudio } from './lifeAudio';

export function LifePanel({ engine }: { engine: EmployeeLife }) {
  const [, refresh] = useState(0);
  const [sound, setSound] = useState(false);
  const [error, setError] = useState('');
  const audio = useRef<LifeAudio | null>(null);
  useEffect(() => {
    const player = new LifeAudio(); audio.current = player;
    return () => { player.dispose(); audio.current = null; };
  }, []);
  useEffect(() => {
    let lastTime = engine.time;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      if (sound && !engine.paused && engine.events.some(e => e.time > lastTime && e.activity === 'collaborating')) audio.current?.cue(performance.now() / 1000);
      lastTime = engine.time;
      refresh(n => n + 1);
    }, 250);
    return () => clearInterval(timer);
  }, [engine, sound]);
  const counts = engine.counts();
  return <section aria-label="Employee life simulation" style={{ position: 'absolute', right: 16, bottom: 112, width: 'min(320px, calc(100vw - 32px))', padding: 12, background: '#101c2eee', border: '1px solid #386174', borderRadius: 10, color: '#eefaff', font: '12px/1.6 system-ui' }}>
    <strong>Employee life · {engine.employees.length} actors</strong>
    <div>Visual simulation · {engine.time.toFixed(1)}s</div>
    <div>{Object.entries(counts).map(([k,v]) => `${k}: ${v}`).join(' · ')}</div>
    <div>Render: {engine.fps.toFixed(0)} FPS · last 47-actor update: {engine.actorUpdateMs.toFixed(2)} ms</div>
    <button onClick={() => { engine.paused = !engine.paused; refresh(n => n + 1); }}>{engine.paused ? 'Resume' : 'Pause'}</button>{' '}
    <button onClick={() => { engine.reset(); refresh(n => n + 1); }}>Reset</button>{' '}
    <label>Speed <select aria-label="Simulation speed" defaultValue="1" onChange={e => { engine.speed = Number(e.target.value); }}><option value="1">1×</option><option value="4">4×</option><option value="8">8×</option></select></label>{' '}
    <button aria-pressed={sound} onClick={async () => {
      if (sound) { audio.current?.dispose(); setSound(false); return; }
      try { await audio.current?.enable(); setSound(true); setError(''); } catch { setError('Audio unavailable in this browser'); }
    }}>{sound ? 'Mute' : 'Enable sound'}</button>
    {error && <div role="alert">{error}</div>}
    <div>Same-department local pairing; actors stay at measured positions. Breaks are in-place—no obstacle-avoiding walking, drink station, or lounge trip is implemented.</div>
    <details><summary>Recent transitions ({engine.events.length}/32)</summary><ol style={{ maxHeight: 120, overflow: 'auto', margin: 0 }}>{engine.events.slice(-6).reverse().map((e,i) => <li key={`${e.time}-${e.id}-${i}`}>{e.id}: {e.activity}</li>)}</ol></details>
  </section>;
}
