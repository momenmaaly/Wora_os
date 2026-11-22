import { ROBOT_VISUAL } from '../config/sceneConfig';

export type Activity = 'working' | 'collaborating' | 'break' | 'idle';
export type EmployeeStatus = 'working' | 'waiting' | 'on-break' | 'collaborating' | 'completed' | 'blocked' | 'communicating';
export interface AgentProfile {
  id: string;
  name: string;
  role: string;
  department: string;
  personality: string;
  communicationStyle: string;
  skills: string[];
  tools: string[];
  permissions: string[];
  identitySource: 'local-demo-fixture';
}
export interface Employee extends AgentProfile {
  activity: Activity;
  status: EmployeeStatus;
  taskId: string;
  task: string;
  progress: number;
  partner: string | null;
  sharedTaskId: string | null;
  energy: number;
  phase: number;
  history: { time: number; status: EmployeeStatus; note: string }[];
}
export interface LifeEvent { time: number; id: string; activity: Activity; status: EmployeeStatus }
export const CYCLE_SECONDS = 120;
export const MAX_EVENTS = 32;
const MAX_HISTORY = 12;

const DEPT: Record<string, { role: string; task: string; skills: string[]; tools: string[] }> = {
  'Executive Office': { role: 'Executive assistant', task: 'Prepare leadership briefing', skills: ['planning', 'summarization', 'coordination'], tools: ['workspace.read', 'briefing.draft'], },
  Marketing: { role: 'Marketing specialist', task: 'Draft campaign concepts', skills: ['campaigns', 'copywriting', 'research'], tools: ['workspace.read', 'campaign.draft'], },
  Engineering: { role: 'Software engineer', task: 'Review implementation changes', skills: ['software engineering', 'testing', 'code review'], tools: ['workspace.read', 'code.review', 'tests.run'], },
  'Creative Studio': { role: 'Creative producer', task: 'Prepare creative assets', skills: ['visual planning', 'storytelling', 'production'], tools: ['workspace.read', 'asset.plan'], },
  Management: { role: 'Operations coordinator', task: 'Review team delivery plan', skills: ['operations', 'planning', 'coordination'], tools: ['workspace.read', 'plan.draft'], },
  Research: { role: 'Research analyst', task: 'Summarize source material', skills: ['research', 'synthesis', 'fact checking'], tools: ['workspace.read', 'research.search'], },
  'QA & Testing': { role: 'Quality analyst', task: 'Check release acceptance cases', skills: ['quality assurance', 'test design', 'triage'], tools: ['workspace.read', 'tests.run'], },
  'Atrium lounge': { role: 'Workspace coordinator', task: 'Review shared work queue', skills: ['coordination', 'planning'], tools: ['workspace.read'], },
};
const PERSONALITIES = ['curious and methodical', 'calm and analytical', 'collaborative and thoughtful', 'direct and detail-oriented', 'creative and reflective'];
const STYLES = ['concise, evidence-led updates', 'warm, structured explanations', 'clear questions and short summaries', 'careful notes with explicit assumptions'];

/**
 * Deterministic local prototype data; not connected to an LLM, task backend, persistent memory,
 * external tools, or an agent runtime. IDs are stable catalogue IDs. Backend identity/state should
 * replace this fixture through the EmployeeRuntime contract rather than changing UI components.
 */
export function buildDemoProfiles(): AgentProfile[] {
  return ROBOT_VISUAL.map((r, i) => {
    const spec = DEPT[r.zone] ?? { role: 'Workspace assistant', task: 'Review shared work queue', skills: ['coordination'], tools: ['workspace.read'] };
    return {
      id: r.id,
      name: `WORA Employee ${String(i + 1).padStart(3, '0')}`,
      role: spec.role,
      department: r.zone,
      personality: PERSONALITIES[i % PERSONALITIES.length],
      communicationStyle: STYLES[i % STYLES.length],
      skills: [...spec.skills],
      tools: [...spec.tools],
      permissions: ['demo.read-only', 'demo.task-simulation'],
      identitySource: 'local-demo-fixture',
    };
  });
}
export interface EmployeeRuntime {
  listEmployees(): readonly Employee[];
  getEmployee(id: string): Employee | undefined;
  subscribe(listener: () => void): () => void;
  dispatch(command: { type: 'pause' | 'resume' | 'set-speed' | 'reset'; value?: number }): void;
}

/** Bounded, deterministic visual/workflow simulation; task updates are explicitly demo-only. */
export class EmployeeLife implements EmployeeRuntime {
  readonly employees: Employee[];
  readonly events: LifeEvent[] = [];
  time = 0;
  paused = false;
  speed = 1;
  fps = 0;
  actorUpdateMs = 0;
  private offsets: number[] = [];
  private partners: (string | null)[] = [];
  private listeners = new Set<() => void>();
  constructor() {
    this.employees = buildDemoProfiles().map((p, i) => ({
      ...p, activity: 'working', status: 'working', taskId: `DEMO-TASK-${String(i + 1).padStart(3, '0')}`,
      task: DEPT[p.department]?.task ?? 'Review shared work queue', progress: 0, partner: null, sharedTaskId: null,
      energy: 1, phase: 0, history: [{ time: 0, status: 'working', note: 'Local demo task started; no external work executed.' }],
    }));
    const zones = new Map<string, number[]>();
    this.employees.forEach((e, i) => zones.set(e.department, [...(zones.get(e.department) ?? []), i]));
    for (const indices of zones.values()) {
      for (let n = 0; n < indices.length; n += 2) {
        const a = indices[n], b = indices[n + 1];
        // Paired coworkers share the same deterministic work/break window; all reset to work.
        this.offsets[a] = 0;
        this.partners[a] = b === undefined ? null : this.employees[b].id;
        if (b !== undefined) { this.offsets[b] = this.offsets[a]; this.partners[b] = this.employees[a].id; }
      }
    }
    this.sample(false);
  }
  listEmployees() { return this.employees; }
  getEmployee(id: string) { return this.employees.find(e => e.id === id); }
  subscribe(listener: () => void) { this.listeners.add(listener); return () => this.listeners.delete(listener); }
  dispatch(command: { type: 'pause' | 'resume' | 'set-speed' | 'reset'; value?: number }) {
    if (command.type === 'pause') this.paused = true;
    if (command.type === 'resume') this.paused = false;
    if (command.type === 'set-speed') this.speed = Math.max(0, Math.min(8, Number(command.value) || 0));
    if (command.type === 'reset') this.reset();
    this.notify();
  }
  setStatus(id: string, status: EmployeeStatus, note = `Demo status changed to ${status}.`) {
    const e = this.getEmployee(id);
    if (!e) return false;
    e.status = status;
    e.activity = status === 'working' || status === 'completed' ? 'working' : status === 'collaborating' ? 'collaborating' : status === 'on-break' ? 'break' : 'idle';
    if (status === 'completed') e.progress = 100;
    e.history.push({ time: this.time, status, note });
    if (e.history.length > MAX_HISTORY) e.history.splice(0, e.history.length - MAX_HISTORY);
    this.notify();
    return true;
  }
  advance(realSeconds: number) {
    if (this.paused || !Number.isFinite(realSeconds) || realSeconds <= 0) return;
    const sampleFps = 1 / Math.min(realSeconds, 1);
    this.fps = this.fps === 0 ? sampleFps : this.fps * 0.9 + sampleFps * 0.1;
    this.time += Math.min(realSeconds, 0.25) * Math.max(0, Math.min(8, this.speed));
    this.sample(true);
  }
  reset() {
    this.time = 0; this.events.length = 0;
    for (const e of this.employees) {
      e.progress = 0; e.history.splice(0, e.history.length, { time: 0, status: 'working', note: 'Local demo task reset; no external work executed.' });
    }
    this.sample(false); this.notify();
  }
  private sample(emit: boolean) {
    this.employees.forEach((e, i) => {
      const t = (this.time + this.offsets[i]) % CYCLE_SECONDS;
      const activity: Activity = t < 60 ? 'working' : t < 80 ? (this.partners[i] ? 'collaborating' : 'idle') : t < 105 ? 'break' : 'idle';
      const status: EmployeeStatus = activity === 'working' ? 'working' : activity === 'collaborating' ? 'collaborating' : activity === 'break' ? 'on-break' : 'waiting';
      if (emit && (activity !== e.activity || status !== e.status)) {
        this.events.push({ time: this.time, id: e.id, activity, status });
        e.history.push({ time: this.time, status, note: 'Local visual cycle transition; not a real runtime event.' });
        if (e.history.length > MAX_HISTORY) e.history.splice(0, e.history.length - MAX_HISTORY);
      }
      if (e.status !== 'blocked' && e.status !== 'completed' && e.status !== 'communicating') {
        e.activity = activity; e.status = status;
        e.partner = activity === 'collaborating' ? this.partners[i] : null;
        e.sharedTaskId = e.partner ? `DEMO-SHARED-${[e.id, e.partner].sort().join('-')}` : null;
        e.progress = activity === 'working' ? Math.min(99, Math.floor((t / 60) * 100)) : e.progress;
      }
      e.phase = t;
      e.energy = t < 80 ? 1 - t / 160 : t < 105 ? 0.5 + (t - 80) / 50 : 1;
    });
    if (this.events.length > MAX_EVENTS) this.events.splice(0, this.events.length - MAX_EVENTS);
  }
  private notify() { this.listeners.forEach(listener => listener()); }
  counts(): Record<Activity, number> {
    const counts = { working: 0, collaborating: 0, break: 0, idle: 0 };
    for (const e of this.employees) counts[e.activity]++;
    return counts;
  }
}

export function lifeMotion(e: Employee, reducedMotion: boolean): { y: number; yaw: number } {
  if (reducedMotion) return { y: 0, yaw: 0 };
  const t = e.phase;
  switch (e.activity) {
    case 'working': return { y: Math.sin(t * 4) * 0.008, yaw: Math.sin(t * 1.5) * 0.018 };
    case 'collaborating': return { y: Math.sin(t * 3) * 0.012, yaw: Math.sin(t * 2) * 0.09 };
    case 'break': return { y: -0.025, yaw: Math.sin(t * 0.4) * 0.04 };
    case 'idle': return { y: 0, yaw: Math.sin(t * 0.5) * 0.03 };
  }
}
