import { useEffect, useState } from 'react';
import type { Employee, EmployeeLife } from './employeeLife';
import { ROBOT_VISUAL } from '../config/sceneConfig';

function introduction(employee: Employee): string {
  return `Hello, I am ${employee.name}, the ${employee.role} in ${employee.department}. I focus on ${employee.skills.slice(0, 3).join(', ')}. My communication style is ${employee.communicationStyle}. This profile and all task activity shown here are local demonstration data, not a connected AI agent.`;
}

/** Employee details are driven by the selected stable ROBOT id and the local runtime contract. */
export function EmployeePanel({ employee, engine, onClose }: { employee: Employee; engine: EmployeeLife; onClose: () => void }) {
  const [, refresh] = useState(0);
  const [speechAvailable, setSpeechAvailable] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [muted, setMuted] = useState(false);
  const [message, setMessage] = useState('');
  const peer = engine.employees.find(e => e.id !== employee.id && e.department === employee.department);
  const measuredLocation = ROBOT_VISUAL.find(r => r.id === employee.id)?.floorXZ;
  useEffect(() => {
    const timer = window.setInterval(() => refresh(n => n + 1), 250);
    return () => window.clearInterval(timer);
  }, [employee.id]);
  useEffect(() => {
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      setSpeechAvailable(false);
      return;
    }
    const updateVoices = () => setSpeechAvailable(window.speechSynthesis.getVoices().length > 0);
    updateVoices();
    window.speechSynthesis.addEventListener('voiceschanged', updateVoices);
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', updateVoices);
      window.speechSynthesis.cancel();
    };
  }, [employee.id]);
  const stop = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setSpeaking(false);
  };
  const speak = () => {
    if (muted) { setMessage('Speech is muted; unmute before playback.'); return; }
    if (!speechAvailable) { setMessage('Speech synthesis is not available; the full introduction text is shown below.'); return; }
    stop();
    const utterance = new SpeechSynthesisUtterance(introduction(employee));
    utterance.onstart = () => { setSpeaking(true); setMessage('Introduction is speaking.'); };
    utterance.onend = () => { setSpeaking(false); setMessage('Introduction finished.'); };
    utterance.onerror = () => { setSpeaking(false); setMessage('Audio playback failed; use the introduction text below.'); };
    window.speechSynthesis.speak(utterance);
  };
  return <aside aria-label={`${employee.name} information`} style={{ position: 'absolute', left: 16, bottom: 130, width: 'min(340px, calc(100vw - 32px))', maxHeight: '55vh', overflow: 'auto', boxSizing: 'border-box', padding: 14, borderRadius: 10, background: 'rgba(12, 24, 39, .97)', border: '1px solid #386174', boxShadow: '0 8px 28px #0008', color: '#e6f4fa', font: '13px/1.5 system-ui, sans-serif', pointerEvents: 'auto' }}>
    <header style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}><div><strong>{employee.name}</strong><div>{employee.role} · {employee.department}</div></div><button onClick={onClose} aria-label="Close employee details">Close</button></header>
    <div style={{ marginTop: 8 }}><strong>Stable ID:</strong> {employee.id}</div>
    {measuredLocation && <div><strong>Measured floor location (X, Z):</strong> {measuredLocation[0].toFixed(3)}, {measuredLocation[1].toFixed(3)}</div>}
    <div><strong>Status:</strong> {employee.status} · <strong>Task:</strong> {employee.task}</div>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, margin: '7px 0' }}>
      <button onClick={() => engine.setStatus(employee.id, 'waiting')}>Simulate waiting</button>
      <button onClick={() => engine.setStatus(employee.id, 'on-break')}>Simulate in-place break</button>
      <button onClick={() => engine.setStatus(employee.id, 'blocked')}>Simulate blocked</button>
      <button onClick={() => engine.setStatus(employee.id, 'completed')}>Simulate completed</button>
      <button onClick={() => engine.setStatus(employee.id, 'working')}>Set working</button>
      {peer && <button onClick={() => engine.beginCollaboration(employee.id, peer.id, `DEMO-SHARED-${[employee.id, peer.id].sort().join('-')}`)}>Pair with same-department demo employee</button>}
      <button onClick={() => engine.resumeSchedule(employee.id)}>Resume scheduled demo</button>
    </div>
    <div>Progress: <progress value={employee.progress} max={100} aria-label="Task progress" /> {employee.progress}%</div>
    {employee.partner && <div>Collaborating with {employee.partner} on {employee.sharedTaskId}</div>}
    {employee.status === 'blocked' && <div role="status">Blocked — this is a manually set local demo state. No remote task is running.</div>}
    {employee.status === 'completed' && <div role="status">Completed — demo state only; no task execution is claimed.</div>}
    <div><strong>Personality:</strong> {employee.personality}</div><div><strong>Communication:</strong> {employee.communicationStyle}</div>
    <div><strong>Skills:</strong> {employee.skills.join(', ')}</div><div><strong>Tools:</strong> {employee.tools.join(', ')}</div><div><strong>Permissions:</strong> {employee.permissions.join(', ')}</div>
    <div style={{ marginTop: 8, padding: 8, background: '#18283a', borderRadius: 6 }}><strong>Introduction (local profile)</strong><p>{introduction(employee)}</p>
      <button onClick={speak} disabled={!speechAvailable || speaking || muted} aria-label="Play employee introduction">Play introduction</button>{' '}
      <button onClick={speak} disabled={!speechAvailable || muted} aria-label="Replay employee introduction">Replay</button>{' '}
      <button onClick={() => { const next = !muted; setMuted(next); if (next) stop(); }} aria-pressed={muted} aria-label="Mute employee introduction">{muted ? 'Unmute' : 'Mute'}</button>{' '}
      <button onClick={stop} disabled={!speaking} aria-label="Stop employee introduction">Stop</button>
      <div aria-live="polite">{message || (speechAvailable ? 'Audio is user-initiated only.' : 'Audio unavailable; text fallback is available.')}</div>
    </div>
    <small>Local demo fixture · simulated state · not connected to the WORA agent runtime</small>
  </aside>;
}
