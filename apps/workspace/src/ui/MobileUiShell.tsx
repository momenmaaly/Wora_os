import { useState, type CSSProperties } from 'react';
import { ACTIVITY_ROWS, NAV_ITEMS, UI_STRINGS } from './uiSpec';
import type { Employee } from '../life/employeeLife';

type Props = { onTab?: (label: string) => void; employees?: readonly Employee[]; onEmployee?: (id: string) => void; onCommand?: (command: string) => void };
const panel: CSSProperties = { background: '#101c2cf5', border: '1px solid #3A4B62', borderRadius: 12, color: '#edf4fb', boxShadow: '0 8px 24px #0006' };

/** Mobile-first controls; desktop continues to render the exact measured REG/UI composition. */
export function MobileUiShell({ onTab, employees = [], onEmployee, onCommand }: Props) {
  const [menu, setMenu] = useState(false);
  const [section, setSection] = useState('');
  const [search, setSearch] = useState('');
  const [command, setCommand] = useState('');
  const [notice, setNotice] = useState('');
  const [tab, setTab] = useState('3D View');
  const matches = search.trim() ? employees.filter(e => `${e.name} ${e.id} ${e.department} ${e.role}`.toLowerCase().includes(search.trim().toLowerCase())).slice(0, 5) : [];
  const choose = (label: string) => { setTab(label); onTab?.(label); };
  const send = () => { if (!command.trim()) return; onCommand?.(command.trim()); setCommand(''); setNotice('Not sent: no connected task runtime.'); };
  const openSection = (label: string) => { setSection(label); setMenu(true); };
  return <div data-testid="ui-shell" data-mobile-ui-shell style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none', font: '14px/1.4 system-ui, sans-serif' }}>
    <header style={{ ...panel, position: 'absolute', top: 'max(8px, env(safe-area-inset-top))', left: 8, right: 8, minHeight: 46, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 10px', pointerEvents: 'auto' }}>
      <button aria-label="Open menu" onClick={() => { setMenu(!menu); setSection(''); }} style={{ background: 'transparent', color: '#edf4fb', border: 0, fontSize: 20 }}>☰</button>
      <strong style={{ letterSpacing: 1.2, color: '#eaf7ff' }}>◉ WORA <small style={{ letterSpacing: 0, color: '#b9c5d5' }}>Enterprise</small></strong>
      <button aria-label="Notifications — reference sample" title="Static reference badge, no notifications service connected" onClick={() => openSection('Notifications')} style={{ background: 'transparent', color: '#edf4fb', border: 0 }}>♧ <small>3</small></button>
    </header>
    <div style={{ ...panel, position: 'absolute', top: 64, left: 8, right: 8, padding: '6px 10px', pointerEvents: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}><span aria-hidden="true">⌕</span><input aria-label={UI_STRINGS.searchPlaceholder} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search employees…" style={{ background: 'transparent', color: '#edf4fb', border: 0, outline: 0, width: '100%', minWidth: 0, fontSize: 14 }} /></label>
      <div style={{ fontSize: 11, color: '#c3cad3' }} title="Reference snapshot metrics, not runtime counts">My Company · Operational · 24 AI Employees · reference snapshot</div>
    </div>
    {search.trim() && <div role="listbox" aria-label="Employee search results" style={{ ...panel, position: 'absolute', top: 116, left: 8, right: 8, maxHeight: '30vh', overflow: 'auto', pointerEvents: 'auto' }}>
      {matches.length ? matches.map(e => <button role="option" key={e.id} onClick={() => { onEmployee?.(e.id); setSearch(''); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 10px', color: '#edf4fb', background: 'transparent', border: 0, borderBottom: '1px solid #283b50' }}>{e.name} · {e.id} · {e.role} · {e.department}</button>) : <div style={{ padding: 10 }}>No matching local demo profile.</div>}
    </div>}
    {menu && <section aria-label={section || 'Workspace menu'} style={{ ...panel, position: 'absolute', top: 62, left: 8, bottom: 78, width: 'min(340px, calc(100vw - 32px))', overflow: 'auto', padding: 12, pointerEvents: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><strong>{section || 'Workspace'}</strong><button onClick={() => setMenu(false)} aria-label="Close menu">Close</button></div>
      <div style={{ color: '#fbb845', fontSize: 11, margin: '4px 0 8px' }}>Prototype data · external services not connected</div>
      {!section && <>
        {NAV_ITEMS.map(item => <button key={item.id} onClick={() => setSection(item.label)} style={{ display: 'block', width: '100%', padding: 9, textAlign: 'left', color: '#edf4fb', background: 'transparent', border: 0, borderBottom: '1px solid #27394d' }}>{item.label}</button>)}
        <button onClick={() => setSection('Executive Command')} style={{ display: 'block', width: '100%', padding: 9, textAlign: 'left', color: '#edf4fb', background: 'transparent', border: 0, borderBottom: '1px solid #27394d' }}>Executive Command</button>
        <button onClick={() => setSection('Live Activity')} style={{ display: 'block', width: '100%', padding: 9, textAlign: 'left', color: '#edf4fb', background: 'transparent', border: 0, borderBottom: '1px solid #27394d' }}>Live Activity · reference sample</button>
        <button onClick={() => { setNotice('Billing is not connected; no plan change was made.'); setMenu(false); }} style={{ marginTop: 10 }}>Upgrade to Pro</button>
      </>}
      {section === 'Agent Directory' && <div>{employees.map(e => <button key={e.id} onClick={() => { onEmployee?.(e.id); setMenu(false); }} style={{ display: 'block', width: '100%', padding: 7, textAlign: 'left', color: '#edf4fb', background: 'transparent', border: 0, borderBottom: '1px solid #27394d' }}>{e.name} · {e.department} · {e.status}</button>)}</div>}
      {section === 'Departments' && <ul>{Array.from(new Set(employees.map(e => e.department))).map(d => <li key={d}>{d} · {employees.filter(e => e.department === d).length} measured actors</li>)}</ul>}
      {section === 'Live Activity' && <><strong>REFERENCE SNAPSHOT · STATIC</strong>{ACTIVITY_ROWS.map(r => <div key={r.id} style={{ padding: 7, borderBottom: '1px solid #27394d' }}>{r.name}<br /><small>{r.detail} · {r.time}</small></div>)}</>}
      {section === 'Executive Command' && <><label htmlFor="mobile-command">Tell your company what to do</label><input id="mobile-command" value={command} onChange={e => setCommand(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') send(); }} /><button onClick={send}>Submit command</button>{notice && <p role="status">{notice}</p>}</>}
      {section === 'Company Overview' && <p>Workspace preview. The status metrics on this page are static reference values.</p>}
      {section === 'Notifications' && <p>Static reference-image badge; no notification service is connected.</p>}
      {section === 'Executive Office' && <p>Open the Agent Directory to inspect its local demo employee record; no live executive service is connected.</p>}
      {section && !['Agent Directory', 'Departments', 'Live Activity', 'Executive Command', 'Company Overview', 'Notifications', 'Executive Office'].includes(section) && <p>{section} module is not connected to a service or dedicated route.</p>}
    </section>}
    <nav aria-label="Workspace views" style={{ ...panel, position: 'absolute', left: 8, right: 8, bottom: 'max(8px, env(safe-area-inset-bottom))', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', padding: 4, pointerEvents: 'auto' }}>
      {['3D View', 'Floor Plan', 'Live View'].map(label => <button key={label} aria-pressed={tab === label} onClick={() => choose(label)} style={{ minHeight: 46, border: 0, borderRadius: 8, color: tab === label ? '#fff' : '#c3cad3', background: tab === label ? '#06556B' : 'transparent' }}>{label}</button>)}
    </nav>
    {notice && <div role="status" style={{ ...panel, position: 'absolute', left: 10, right: 10, bottom: 70, padding: 8, pointerEvents: 'auto' }}>{notice}<button onClick={() => setNotice('')} style={{ float: 'right' }}>Dismiss</button></div>}
  </div>;
}
