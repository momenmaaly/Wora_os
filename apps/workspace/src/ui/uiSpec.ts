/**
 * UI shell specification — CRITICAL DESIGN FIDELITY RESET (owner, 2026-11-20).
 *
 * The authoritative source is the locked reference (SHA-256 6f91ff3d…718036a1) via the measured
 * inventory in analysis/data/measurements.json (REG-01…08 + UI-001…092) and the component spec
 * analysis/04-ui-components-spec.md. Every string is reproduced VERBATIM (analysis/04 header rule).
 * Positions are original-image px (1672×941 frame); the shell scales them by (viewportHeight/941)
 * and anchors rails to the viewport edges, which reproduces the reference exactly at the 16:9
 * acceptance family (1920×1080, 2560×1440, 1366×768) and stays sane at other aspects.
 *
 * Colours are the measured samples from analysis/04 (est. flagged there): surfaces #091423/#121C2C/
 * #141C2C/#0A1422/#111A2A, borders #3E4D63–#4A5568, accent teal #074A5F (active pill) / #019FBB
 * (send) / #16CBDD (logo cyan), status green #12DB76 / amber #FBB845 / red #FE3D37 / cyan #32DDFF.
 */
import { MEASURED, type MeasuredElement } from '../config/sceneConfig';

export const REF_FRAME = { w: 1672, h: 941 } as const;

export function uiBox(id: string): MeasuredElement {
  const el = MEASURED[id];
  if (!el) throw new Error(`UI element ${id} missing from measurements.json`);
  return el;
}

/** Sidebar navigation — exact labels, verbatim (analysis/04 §2.2); icon glyph keys for the SVG painter. */
export const NAV_ITEMS: { id: string; label: string; icon: string; active?: boolean }[] = [
  { id: 'UI-020', label: 'Company Overview', icon: 'house', active: true },
  { id: 'UI-021', label: 'Executive Office', icon: 'people-two' },
  { id: 'UI-022', label: 'Departments', icon: 'people-group' },
  { id: 'UI-023', label: 'Agent Directory', icon: 'person' },
  { id: 'UI-024', label: 'Projects', icon: 'folder' },
  { id: 'UI-025', label: 'Tasks & Workflows', icon: 'clipboard' },
  { id: 'UI-026', label: 'Knowledge Base', icon: 'book' },
  { id: 'UI-027', label: 'Reports & Analytics', icon: 'bars' },
  { id: 'UI-028', label: 'Integrations', icon: 'nodes' },
  { id: 'UI-029', label: 'Billing & Usage', icon: 'card' },
  { id: 'UI-030', label: 'Settings', icon: 'gear' },
];

/** Live Activity rows — verbatim (analysis/04 §6). */
export const ACTIVITY_ROWS: { id: string; name: string; detail: string; time: string; visor?: string }[] = [
  { id: 'UI-071', name: 'Marketing Agent', detail: 'Finished creating ideas', time: '2m ago' },
  { id: 'UI-072', name: 'Dev Agent', detail: 'Pushed new code', time: '3m ago' },
  { id: 'UI-073', name: 'Reviewer Agent', detail: 'Approved the changes', time: '4m ago' },
  { id: 'UI-074', name: 'Video Producer', detail: 'Started rendering video', time: '5m ago', visor: 'peach' },
];

/** Status strip metrics — the immutable counts (analysis/04 §4). */
export const STATUS_METRICS: { id: string; value: string; label: string; color: string; icon: string }[] = [
  { id: 'UI-055', value: '24', label: 'AI Employees', color: '#32DDFF', icon: 'people-cyan' },
  { id: 'UI-056', value: '08', label: 'Working', color: '#05EB62', icon: 'ring-green' },
  { id: 'UI-057', value: '03', label: 'Waiting', color: '#FEB837', icon: 'ring-amber' },
  { id: 'UI-058', value: '01', label: 'Blocked', color: '#FD362D', icon: 'ring-red' },
];

export const VIEW_TABS: { id: string; label: string; icon: string; active?: boolean }[] = [
  { id: 'UI-090', label: '3D View', icon: 'cube', active: true },
  { id: 'UI-091', label: 'Floor Plan', icon: 'plan' },
  { id: 'UI-092', label: 'Live View', icon: 'broadcast' },
];

/** Verbatim strings used by tests (single source). */
export const UI_STRINGS = {
  wordmark: 'WORA',
  badge: 'Enterprise',
  company: 'My Company',
  live: 'Live',
  upgradeTitle: 'Upgrade to Pro',
  upgradeLine1: 'Unlock more power',
  upgradeLine2: 'for your company',
  upgradeButton: 'Upgrade Now',
  searchPlaceholder: 'Search across your company…',
  operational: 'Operational',
  profileName: 'Momen Maaly',
  profileRole: 'CEO',
  activityTitle: 'Live Activity',
  viewAll: 'View All →',
  commandTitle: 'Executive Command',
  commandPlaceholder: 'Tell your company what to do…',
} as const;
