/**
 * VF/RESET UI shell — the real dashboard interface of the reference (analysis/04), implemented as
 * DOM overlay components above the 3D canvas (architecture/04 §1.4). Not a background image: the
 * sidebar, search, status strip, Live Activity, Executive Command and view switcher are real,
 * interactive elements. All strings verbatim; all positions from the measured inventory
 * (uiSpec.ts) scaled by s = viewportHeight / 941 and edge-anchored (reproduces the reference
 * exactly at the 16:9 acceptance family; stays sane at other aspects).
 *
 * Photos/faces (UI-063 avatar) are not reproducible without inventing a face: a neutral dark
 * avatar disc with a light ring stands in (documented deviation). Robot avatars are SVG glyphs.
 * Icon glyphs are hand-drawn SVG approximations of the catalogued icons (analysis/04 icon notes).
 */
import { Fragment, useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { ACTIVITY_ROWS, NAV_ITEMS, REF_FRAME, STATUS_METRICS, UI_STRINGS, VIEW_TABS, uiBox } from './uiSpec';
import type { Employee } from '../life/employeeLife';

export function useUiScale(): number {
  const [s, setS] = useState(() => (typeof window === 'undefined' ? 1 : window.innerHeight / REF_FRAME.h));
  useEffect(() => {
    const onResize = () => setS(window.innerHeight / REF_FRAME.h);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return s;
}

/* ── icons (SVG approximations of the catalogued glyphs) ── */
function Icon({ kind, size, color = '#A3A6B0' }: { kind: string; size: number; color?: string }) {
  const p: Record<string, ReactNode> = {
    house: <path d="M3 11 12 3l9 8v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />,
    'people-two': (
      <>
        <circle cx="9" cy="8" r="3.2" />
        <path d="M3 19c0-3 2.7-5 6-5s6 2 6 5z" />
        <circle cx="16.5" cy="8.5" r="2.6" />
        <path d="M15.5 14.2c2.9.2 5.5 2 5.5 4.8h-5" />
      </>
    ),
    'people-group': (
      <>
        <circle cx="12" cy="7" r="2.6" />
        <path d="M7 19c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6z" />
        <circle cx="5.5" cy="9" r="2" />
        <path d="M2 18c0-2.2 1.6-3.6 3.5-3.6" />
        <circle cx="18.5" cy="9" r="2" />
        <path d="M22 18c0-2.2-1.6-3.6-3.5-3.6" />
      </>
    ),
    person: (
      <>
        <circle cx="12" cy="7.5" r="3.4" />
        <path d="M5 20c0-3.6 3.1-5.8 7-5.8s7 2.2 7 5.8z" />
      </>
    ),
    folder: <path d="M3 5h6l2 2h10a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />,
    clipboard: (
      <>
        <rect x="5" y="4" width="14" height="17" rx="2" />
        <rect x="9" y="2" width="6" height="4" rx="1" fill="#0F1620" />
        <path d="M8.5 12l2.4 2.4 4.8-4.8" stroke="#0F1620" strokeWidth="1.6" fill="none" />
      </>
    ),
    book: (
      <>
        <path d="M4 4h7a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4z" />
        <path d="M20 4h-7a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h7z" opacity="0.75" />
      </>
    ),
    bars: (
      <>
        <rect x="4" y="12" width="4.5" height="8" rx="0.8" />
        <rect x="10" y="7" width="4.5" height="13" rx="0.8" />
        <rect x="16" y="3" width="4.5" height="17" rx="0.8" />
      </>
    ),
    nodes: (
      <>
        <circle cx="6" cy="6" r="2.4" />
        <circle cx="18" cy="6" r="2.4" />
        <circle cx="6" cy="18" r="2.4" />
        <circle cx="18" cy="18" r="2.4" />
        <path d="M8 7.5 16 7.5M8 16.5 16 16.5M7.5 8v8M16.5 8v8" stroke={color} strokeWidth="1.4" fill="none" />
      </>
    ),
    card: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 10h18" stroke="#0F1620" strokeWidth="1.6" />
        <path d="M6 15h5" stroke="#0F1620" strokeWidth="1.6" />
      </>
    ),
    gear: (
      <>
        <path d="M12 8.5A3.5 3.5 0 1 0 12 15.5 3.5 3.5 0 0 0 12 8.5z" fill="#0F1620" />
        <path d="M19.4 13.2l2-.9-1-3.4-2.2.3a6 6 0 0 0-1.3-1.3l.3-2.2-3.4-1-.9 2a6 6 0 0 0-1.8 0l-.9-2-3.4 1 .3 2.2a6 6 0 0 0-1.3 1.3l-2.2-.3-1 3.4 2 .9a6 6 0 0 0 0 1.8l-2 .9 1 3.4 2.2-.3a6 6 0 0 0 1.3 1.3l-.3 2.2 3.4 1 .9-2a6 6 0 0 0 1.8 0l.9 2 3.4-1-.3-2.2a6 6 0 0 0 1.3-1.3l2.2.3 1-3.4-2-.9a6 6 0 0 0 0-1.8z" />
      </>
    ),
    magnifier: (
      <>
        <circle cx="10.5" cy="10.5" r="6" fill="none" stroke={color} strokeWidth="2" />
        <path d="M15 15l5 5" stroke={color} strokeWidth="2" />
      </>
    ),
    bell: <path d="M12 3a6 6 0 0 0-6 6v4l-1.6 3h15.2L18 13V9a6 6 0 0 0-6-6zM10 18a2 2 0 0 0 4 0z" />,
    building: <path d="M4 21V5l8-3 8 3v16h-5v-6h-6v6zM8 8h2v2H8zm6 0h2v2h-2zm-6 4h2v2H8zm6 0h2v2h-2z" />,
    cube: <path d="M12 2 21 7v10l-9 5-3-1.7V10.6L3 6.8V7L12 2zM12 4.3 6.2 7.5 12 10.7l5.8-3.2zM5 8.9v7.2l6 3.3v-7.2zm14 0-6 3.3v7.2l6-3.3z" />,
    plan: (
      <>
        <rect x="3" y="3" width="7.5" height="7.5" rx="1.6" />
        <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.6" />
        <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.6" />
        <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.6" />
      </>
    ),
    broadcast: (
      <>
        <circle cx="12" cy="12" r="2.2" />
        <path d="M7.7 7.7a6 6 0 0 0 0 8.6M16.3 7.7a6 6 0 0 1 0 8.6M5 5a9.5 9.5 0 0 0 0 14M19 5a9.5 9.5 0 0 1 0 14" fill="none" stroke={color} strokeWidth="1.7" />
      </>
    ),
    send: <path d="M3 11.5 21 3l-4.5 18-5-7.5z" />,
    crown: <path d="M3 8l4.5 4L12 5l4.5 7L21 8l-1.6 10H4.6z" />,
    cycle: (
      <>
        <path d="M20 12a8 8 0 1 1-2.3-5.6" fill="none" stroke={color} strokeWidth="2" />
        <path d="M18.5 3v4h-4" fill="none" stroke={color} strokeWidth="2" />
      </>
    ),
    chevDown: <path d="M5 8l7 7 7-7" fill="none" stroke={color} strokeWidth="2.2" />,
    chevRight: <path d="M8 4l8 8-8 8" fill="none" stroke={color} strokeWidth="2.2" />,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display: 'block' }}>
      {p[kind]}
    </svg>
  );
}

/** Small robot-bust avatar glyph (Live Activity rows, Executive Command avatar). */
function RobotAvatar({ size, visor = '#05080F', ear = '#3AA6D8' }: { size: number; visor?: string; ear?: string }) {
  return (
    <svg width={size} height={size * 1.55} viewBox="0 0 20 31" style={{ display: 'block' }}>
      <ellipse cx="10" cy="9" rx="8.4" ry="8" fill="#F2F4FA" />
      <rect x="4.2" y="7" width="11.6" height="8.4" rx="3.4" fill={visor} />
      <circle cx="7.4" cy="11" r="1.5" fill="#19C6FF" />
      <circle cx="12.6" cy="11" r="1.5" fill="#19C6FF" />
      <rect x="1" y="7.6" width="2.4" height="3.6" rx="1.1" fill={ear} />
      <rect x="16.6" y="7.6" width="2.4" height="3.6" rx="1.1" fill={ear} />
      <rect x="9" y="0.6" width="2" height="3" rx="1" fill="#F2F4FA" />
      <path d="M3 31v-9c0-3.6 3.1-6 7-6s7 2.4 7 6v9z" fill="#F2F4FA" />
      <rect x="7.5" y="19.5" width="5" height="3.4" rx="1.4" fill="#2E7FD8" />
    </svg>
  );
}

function Logo({ size }: { size: number }) {
  return (
    <svg width={size} height={size * 0.93} viewBox="0 0 30 28">
      <defs>
        <linearGradient id="woralogo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#16CBDD" />
          <stop offset="1" stopColor="#035A86" />
        </linearGradient>
      </defs>
      <rect x="2.2" y="5.6" width="14.4" height="14.4" rx="6.4" transform="rotate(45 9.4 12.8)" fill="none" stroke="#16CBDD" strokeWidth="3.9" />
      <rect x="9.6" y="9.4" width="13.2" height="13.2" rx="5.8" transform="rotate(45 16.2 16)" fill="#073B63" stroke="#0B7FB8" strokeWidth="3.2" opacity="0.96" />
    </svg>
  );
}

function Text({ x, y, w, h, s, size, weight = 400, color = '#FFFFFF', align, letterSpacing, children, opacity }: {
  x: number; y: number; w: number; h: number; s: number; size: number; weight?: number; color?: string;
  align?: 'center'; letterSpacing?: number; children: ReactNode; opacity?: number;
}) {
  const style: CSSProperties = {
    position: 'absolute',
    left: x * s,
    top: y * s,
    width: w * s,
    height: h * s,
    fontSize: size * s,
    fontWeight: weight,
    color,
    lineHeight: `${h * s}px`,
    whiteSpace: 'nowrap',
    opacity,
    ...(align ? { textAlign: align, left: x * s, width: w * s } : {}),
    ...(letterSpacing ? { letterSpacing: letterSpacing * s } : {}),
  };
  return <div style={style}>{children}</div>;
}

/** The full measured UI overlay. Rendered on the production route; skipped on the dev route. */
export function UiShell({ onTab, employees = [], onEmployee, onCommand }: { onTab?: (label: string) => void; employees?: readonly Employee[]; onEmployee?: (id: string) => void; onCommand?: (command: string) => void }) {
  const s = useUiScale();
  const [activeNav, setActiveNav] = useState('Company Overview');
  const [openSection, setOpenSection] = useState('');
  const [, refreshDirectory] = useState(0);
  const [activeTab, setActiveTab] = useState('3D View');
  const [command, setCommand] = useState('');
  const [search, setSearch] = useState('');
  const [commandNotice, setCommandNotice] = useState('');
  const matches = search.trim() ? employees.filter(e => `${e.name} ${e.id} ${e.department} ${e.role}`.toLowerCase().includes(search.trim().toLowerCase())).slice(0, 6) : [];
  const submitCommand = () => {
    if (!command.trim()) return;
    onCommand?.(command.trim());
    setCommandNotice('Not sent: no task runtime is connected.');
    setCommand('');
  };
  useEffect(() => {
    if (!openSection) return;
    const timer = window.setInterval(() => refreshDirectory(n => n + 1), 500);
    return () => window.clearInterval(timer);
  }, [openSection]);

  const px = (n: number) => `${n * s}px`;
  const panel: CSSProperties = { position: 'absolute', borderRadius: px(12), background: '#0A1422', boxShadow: `0 ${px(6)} ${px(14)} rgba(0,0,0,0.22)` }; // review R1: ref panels show crisp edges, minimal shadow

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', fontFamily: "'Inter', 'Roboto', system-ui, sans-serif" }} data-testid="ui-shell">
      {/* ── Brand header (REG-01) + Sidebar (REG-02) — left rail ── */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: px(295), height: px(67), background: '#091423', pointerEvents: 'auto' }} />
      <div style={{ position: 'absolute', left: 0, top: px(67), width: px(235), bottom: 0, background: '#121C2C', borderRight: `${px(1)} solid #0B1523`, pointerEvents: 'auto' }}>
        {/* company selector (UI-010) */}
        <div style={{ position: 'absolute', left: px(19), top: px(86 - 67), width: px(197), height: px(69), background: '#091321', border: `${px(1)} solid #3E4D63`, borderRadius: px(10) }}>
          <div style={{ position: 'absolute', left: px(11), top: px(11), width: px(20), height: px(19), background: 'linear-gradient(135deg,#16CBDD,#0891B2)', borderRadius: px(5), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon kind="building" size={12 * s} color="#FFFFFF" />
          </div>
          <Text x={61 - 19} y={100 - 86} w={84} h={16} s={s} size={16}>{UI_STRINGS.company}</Text>
          <div style={{ position: 'absolute', left: px(192 - 19), top: px(103 - 86) }}><Icon kind="chevDown" size={8 * s} color="#A3A6B0" /></div>
          <div style={{ position: 'absolute', left: px(13), top: px(124 - 86), width: px(16), height: px(17), borderRadius: '50%', background: 'radial-gradient(circle, #12DB76 32%, rgba(18,219,118,0.28) 72%)' }} />
          <Text x={61 - 19} y={127 - 86} w={29} h={12} s={s} size={13} weight={600} color="#12DB76">{UI_STRINGS.live}</Text>
        </div>
        {/* navigation (UI-020…030) */}
        {NAV_ITEMS.map((n) => {
          const b = uiBox(n.id);
          const active = activeNav === n.label;
          return (
            <div
              key={n.id}
              onClick={() => { setActiveNav(n.label); setOpenSection(n.label); }}
              aria-label={`Open ${n.label}`}
              aria-current={active ? 'page' : undefined}
              style={{
                position: 'absolute', left: px(b.x), top: px(b.y - 67), width: px(b.w), height: px(b.h),
                borderRadius: px(10), background: active ? '#074A5F' : 'transparent', cursor: 'pointer', pointerEvents: 'auto',
              }}
            >
              <div style={{ position: 'absolute', left: px(14), top: px(11), opacity: active ? 1 : 0.9 }}>
                <Icon kind={n.icon} size={20 * s} color={active ? '#FFFFFF' : '#A3A6B0'} />
              </div>
              <Text x={48} y={12} w={b.w - 55} h={17} s={s} size={16} color={active ? '#FFFFFF' : '#FFFFFF'}>{n.label}</Text>
            </div>
          );
        })}
        {/* upgrade card (UI-031…037) */}
        <div style={{ position: 'absolute', left: px(19), bottom: px(48), width: px(197), height: px(166), background: '#111B2B', border: `${px(1)} solid #3E4D63`, borderRadius: px(12) }}>
          <div style={{ position: 'absolute', left: px(85.5), top: px(-11), width: px(26), height: px(22) }}><Icon kind="crown" size={26 * s} color="#FFC84E" /></div>
          <Text x={0} y={45} w={197} h={15} s={s} size={16} weight={700} align="center">{UI_STRINGS.upgradeTitle}</Text>
          <Text x={0} y={71} w={197} h={13} s={s} size={14} color="#C3CAD3" align="center">{UI_STRINGS.upgradeLine1}</Text>
          <Text x={0} y={90} w={197} h={13} s={s} size={14} color="#C3CAD3" align="center">{UI_STRINGS.upgradeLine2}</Text>
          <button type="button" onClick={() => setCommandNotice('Billing is not connected; no plan change was made.')} style={{ position: 'absolute', left: px(21), top: px(116), width: px(156), height: px(36), background: '#1A2B43', border: 0, borderRadius: px(8), cursor: 'pointer', pointerEvents: 'auto', fontSize: px(15), fontWeight: 700, color: '#FFFFFF' }}>{UI_STRINGS.upgradeButton}</button>
        </div>
      </div>
      {openSection && <section aria-label={`${openSection} section`} style={{ position: 'absolute', left: '50%', top: px(140), transform: 'translateX(-50%)', width: 'min(420px, calc(100vw - 32px))', maxHeight: '55vh', overflow: 'auto', zIndex: 55, boxSizing: 'border-box', padding: 14, border: '1px solid #386174', borderRadius: 10, background: '#101c2cf5', color: '#eefaff', font: '13px/1.5 system-ui', pointerEvents: 'auto' }}>
        <button onClick={() => setOpenSection('')} style={{ float: 'right' }} aria-label="Close navigation section">Close</button>
        <strong>{openSection}</strong><div style={{ color: '#FBB845' }}>Prototype data · no production workspace service connected</div>
        {openSection === 'Agent Directory' && <><p>{employees.length} local demo profiles. Select an employee to inspect its stable ID and simulated state.</p>{employees.map(e => <button key={e.id} onClick={() => { onEmployee?.(e.id); setOpenSection(''); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '5px 8px', background: 'transparent', color: '#eefaff', border: 0, borderBottom: '1px solid #293a4c', cursor: 'pointer' }}>{e.name} · {e.role} · {e.department} · {e.status} ({e.progress}%)</button>)}</>}
        {openSection === 'Departments' && <ul>{Array.from(new Set(employees.map(e => e.department))).map(dept => <li key={dept}>{dept}: {employees.filter(e => e.department === dept).length} measured actor records</li>)}</ul>}
        {openSection !== 'Agent Directory' && openSection !== 'Departments' && <p>This navigation action opens a prototype status panel. This module has no connected data source or dedicated route yet.</p>}
      </section>}
      <Text x={66} y={28} w={72} h={17} s={s} size={24} weight={700} letterSpacing={0.5}>{UI_STRINGS.wordmark}</Text>
      <div style={{ position: 'absolute', left: px(27), top: px(23), pointerEvents: 'auto' }}><Logo size={28 * s} /></div>
      <div style={{ position: 'absolute', left: px(163), top: px(26), width: px(75), height: px(21), background: '#4C5669', borderRadius: px(999), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: px(13), color: '#FFFFFF' }}>{UI_STRINGS.badge}</div>
      <div style={{ position: 'absolute', left: px(270), top: px(31) }}><Icon kind="chevRight" size={10 * s} color="#A3A6B0" /></div>

      {/* ── Search (UI-040) — centre, top-anchored ── */}
      {/* ref: one dark pill — the outer shell IS the field (no inner border box) */}
      <div style={{ ...panel, left: '50%', transform: 'translateX(-50%)', top: px(10), width: px(562), height: px(47), background: '#151B28', border: `${px(1)} solid #2E3947`, borderRadius: px(14), pointerEvents: 'auto' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
          <div style={{ marginLeft: px(11) }}><Icon kind="magnifier" size={15 * s} color="#C8CDD5" /></div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={UI_STRINGS.searchPlaceholder}
            style={{ background: 'transparent', border: 'none', outline: 'none', color: '#E1E5EA', fontSize: px(16), marginLeft: px(12), width: '80%' }}
          />
        </div>
      </div>
      {search.trim() && <div role="listbox" aria-label="Employee search results" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: px(60), width: px(562), maxHeight: px(210), overflow: 'auto', zIndex: 50, background: '#101c2c', border: '1px solid #3A4456', borderRadius: px(10), pointerEvents: 'auto' }}>
        {matches.length ? matches.map(e => <button key={e.id} role="option" onClick={() => { onEmployee?.(e.id); setSearch(''); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: `${px(7)} ${px(12)}`, color: '#eefaff', background: 'transparent', border: 0, cursor: 'pointer' }}>{e.name} · {e.role} · {e.department}</button>) : <div style={{ padding: px(10), color: '#c3cad3', fontSize: px(12) }}>No matching employee in the local demo directory.</div>}
      </div>}

      {/* ── Status strip (UI-050) — centre, below search ── */}
      <div title="Immutable counts reproduced from the reference image; not connected runtime metrics." style={{ ...panel, left: '50%', transform: 'translateX(-50%)', top: px(63), width: px(590), height: px(64), background: '#141C2C', borderRadius: px(11), pointerEvents: 'auto' }}>
        <div style={{ position: 'absolute', left: px(18), top: px(20) }}><Icon kind="building" size={27 * s} color="#A3A6B0" /></div>
        <Text x={60} y={17} w={90} h={16} s={s} size={15}>{UI_STRINGS.company}</Text>
        <Text x={60} y={37} w={70} h={11} s={s} size={12} color="#C3CAD3">{UI_STRINGS.operational}</Text>
        <div style={{ position: 'absolute', left: px(118), top: px(38) }}><Icon kind="cycle" size={9 * s} color="#12DB76" /></div>
        <div style={{ position: 'absolute', left: px(175), top: px(19), width: px(1), height: px(30), background: '#2A3547' }} />
        {STATUS_METRICS.map((m, i) => (
          <Fragment key={`d${m.id}`}>
            {i > 0 && <div style={{ position: 'absolute', left: px(203 + i * 105 - 12), top: px(14), width: px(1), height: px(34), background: '#2A3547' }} />}

          <div key={m.id} style={{ position: 'absolute', left: px(203 + i * 105), top: px(15), width: px(100), pointerEvents: 'auto' }}>
            {/* ref: value row = coloured badge (people glyph on the first metric, solid disc on the
                state metrics) + big white number; label row = coloured dot + light-grey label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: px(6) }}>
              {i === 0 ? <Icon kind={m.icon} size={15 * s} color={m.color} /> : <span style={{ width: px(12), height: px(12), borderRadius: '50%', background: m.color, display: 'inline-block' }} />}
              <span style={{ fontSize: px(18), fontWeight: 700, color: '#FFFFFF' }}>{m.value}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: px(5), marginTop: px(4) }}>
              <span style={{ width: px(8), height: px(8), borderRadius: '50%', background: m.color, display: 'inline-block' }} />
              <span style={{ fontSize: px(12), color: '#C9CFD8' }}>{m.label}</span>
            </div>
          </div>
          </Fragment>
        ))}
      </div>

      {/* ── Top-right cluster (REG-05) ── */}
      <div role="button" tabIndex={0} aria-label="Open account details" onClick={() => setOpenSection('Account')} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setOpenSection('Account'); }} style={{ ...panel, right: px(15), top: px(12), width: px(239), height: px(51), background: '#091322', pointerEvents: 'auto', cursor: 'pointer' }}>
        <div role="button" tabIndex={0} aria-label="Open notifications" onClick={() => setOpenSection('Notifications')} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setOpenSection('Notifications'); }} title="Static reference-image badge; no live notification feed." style={{ position: 'absolute', left: px(15), top: px(13), cursor: 'pointer' }}>
          <Icon kind="bell" size={19 * s} color="#E6E9EE" />
          <div style={{ position: 'absolute', left: px(11), top: px(-10), width: px(13), height: px(14), background: '#F3272B', borderRadius: '50%', color: '#FFFFFF', fontSize: px(10), fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</div>
        </div>
        <div style={{ position: 'absolute', left: px(51), top: px(10), width: px(1), height: px(28), background: '#2A3547' }} />
        {/* UI-063 avatar: photo not reproducible → neutral dark disc with light ring (documented deviation) */}
        <div style={{ position: 'absolute', left: px(68), top: px(9), width: px(34), height: px(33), borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #3A4356, #141B29 70%)', border: `${px(2)} solid #C9CFD8` }} />
        <Text x={112} y={10} w={95} h={16} s={s} size={16}>{UI_STRINGS.profileName}</Text>
        <Text x={112} y={28} w={40} h={10} s={s} size={12} color="#BDC4CF">{UI_STRINGS.profileRole}</Text>
        <div style={{ position: 'absolute', left: px(213), top: px(21) }}><Icon kind="chevDown" size={9 * s} color="#E6E9EE" /></div>
      </div>

      {/* ── Live Activity (REG-06) ── */}
      <div title="Static reference-image sample; not a live operational feed." style={{ ...panel, right: px(16), top: px(83), width: px(236), height: px(266), background: '#0A1422', pointerEvents: 'auto' }}>
        <div style={{ position: 'absolute', left: px(15), top: px(15), width: px(10), height: px(9), borderRadius: '50%', background: '#11FA73' }} />
        <Text x={32} y={12} w={120} h={14} s={s} size={16} weight={700}>{UI_STRINGS.activityTitle}</Text>
        <div style={{ position: 'absolute', left: px(32), top: px(30), fontSize: px(8), color: '#FBB845', letterSpacing: px(0.5) }}>REFERENCE SNAPSHOT · STATIC</div>
        {ACTIVITY_ROWS.map((r, i) => {
          const y = [47, 97, 144, 189][i];
          return (
            <div key={r.id} style={{ position: 'absolute', left: px(7), top: px(y) }}>
              <div style={{ position: 'absolute', left: 0, top: 0 }}><RobotAvatar size={20 * s} visor={r.visor === 'peach' ? '#B8875F' : '#05080F'} /></div>
              <div style={{ position: 'absolute', left: px(33), top: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: px(186) }}>
                  <span style={{ fontSize: px(12), fontWeight: 600, color: '#FFFFFF', whiteSpace: 'nowrap' }}>{r.name}</span>
                  <span style={{ fontSize: px(10.5), color: '#D2D5DA', whiteSpace: 'nowrap' }}>{r.time}</span>
                </div>
                <div style={{ fontSize: px(10.5), color: '#D8DCE4', whiteSpace: 'nowrap', marginTop: px(2) }}>{r.detail}</div>
              </div>
            </div>
          );
        })}
        <div style={{ position: 'absolute', left: px(15), top: px(233), width: px(205), height: px(1), background: '#222D40' }} />
        <button type="button" onClick={() => { setActiveNav('Agent Directory'); setOpenSection('Agent Directory'); }} style={{ position: 'absolute', right: px(15), top: px(240), fontSize: px(12), color: '#EAF1F7', cursor: 'pointer', background: 'transparent', border: 0 }}>{UI_STRINGS.viewAll}</button>
      </div>

      {/* ── Executive Command (REG-07) — bottom, left-anchored per measurement ── */}
      <div style={{ position: 'absolute', left: px(481), bottom: 0, width: px(852), height: px(112), background: '#111A2A', borderTopLeftRadius: px(14), borderTopRightRadius: px(14), boxShadow: `0 ${px(10)} ${px(30)} rgba(0,0,0,0.35)`, pointerEvents: 'auto' }}>
        <div style={{ position: 'absolute', left: px(18), top: px(13), width: px(43), height: px(45), borderRadius: '50%', background: '#0E1C2F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <RobotAvatar size={26 * s} ear="#E8A06B" />
        </div>
        <div style={{ position: 'absolute', left: px(16), top: px(60), width: px(45), height: px(26), background: '#0B2C3C', borderRadius: px(6), display: 'flex', alignItems: 'center', justifyContent: 'center', gap: px(2.5) }}>
          {[4, 8, 13, 17, 10, 6].map((h, i) => (
            <span key={i} style={{ width: px(3), height: px(h * 0.75 + 4), borderRadius: px(2), background: '#0DFFFF', display: 'inline-block' }} />
          ))}
        </div>
        <Text x={74} y={15} w={160} h={13} s={s} size={15} weight={700}>{UI_STRINGS.commandTitle}</Text>
        <div style={{ position: 'absolute', left: px(72), top: px(38), width: px(764), height: px(49), background: '#1C273C', border: `${px(1)} solid #3A4456`, borderRadius: px(10), display: 'flex', alignItems: 'center' }}>
          <input
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') submitCommand(); }}
            aria-label={UI_STRINGS.commandPlaceholder}
            placeholder={UI_STRINGS.commandPlaceholder}
            style={{ background: 'transparent', border: 'none', outline: 'none', color: '#E6E9EE', fontSize: px(17), marginLeft: px(17), width: '88%' }}
          />
          <button type="button" aria-label="Submit executive command" onClick={submitCommand} style={{ position: 'absolute', right: px(8), width: px(37), height: px(37), border: 0, borderRadius: '50%', background: '#019FBB', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Icon kind="send" size={16 * s} color="#FFFFFF" />
          </button>
        </div>
        {commandNotice && <div role="status" style={{ position: 'absolute', left: px(72), bottom: px(2), color: '#FBB845', fontSize: px(10) }}>{commandNotice}</div>}
      </div>

      {/* ── View switcher (REG-08) — bottom right ── */}
      <div style={{ ...panel, right: px(15), bottom: px(15), width: px(288), height: px(73), background: '#1D222F', opacity: 0.96, pointerEvents: 'auto' }}>
        {VIEW_TABS.map((t, i) => {
          const active = activeTab === t.label;
          return (
            <div
              key={t.id}
              onClick={() => {
                setActiveTab(t.label);
                onTab?.(t.label);
              }}
              style={{
                position: 'absolute', left: px(4 + i * 95), top: px(10), width: px(90), height: px(54),
                borderRadius: px(10), background: active ? '#06556B' : 'transparent', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: px(4),
              }}
            >
              <Icon kind={t.icon} size={18 * s} color={active ? '#FFFFFF' : '#A3A6B0'} />
              <span style={{ fontSize: px(13), color: active ? '#FFFFFF' : '#C3CAD3' }}>{t.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
