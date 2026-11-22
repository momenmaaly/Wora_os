/** Additive deterministic simulation coverage; the measured scene census stays immutable. */
import { describe, expect, test } from 'vitest';
import { EmployeeLife, MAX_EVENTS, lifeMotion } from '../src/life/employeeLife';
import { ROBOT_VISUAL } from '../src/config/sceneConfig';

function step(life: EmployeeLife, seconds: number) {
  for (let n = 0; n < seconds * 4; n++) life.advance(0.25);
}

describe('47-employee life simulation and local identity fixture', () => {
  test('covers every measured actor once with stable IDs and explicit demo identity', () => {
    const life = new EmployeeLife();
    expect(life.employees).toHaveLength(47);
    expect(life.employees.map(e => e.id)).toEqual(ROBOT_VISUAL.map(r => r.id));
    expect(new Set(life.employees.map(e => e.id)).size).toBe(47);
    for (const employee of life.employees) {
      expect(employee.name).toBeTruthy();
      expect(employee.role).toBeTruthy();
      expect(employee.department).toBe(ROBOT_VISUAL.find(r => r.id === employee.id)?.zone);
      expect(employee.skills.length).toBeGreaterThan(0);
      expect(employee.tools.length).toBeGreaterThan(0);
      expect(employee.permissions).toContain('demo.read-only');
      expect(employee.identitySource).toBe('local-demo-fixture');
    }
  });

  test('working, same-zone paired collaboration, breaks, waiting and work resume transition deterministically', () => {
    const life = new EmployeeLife();
    expect(life.counts().working + life.counts().collaborating + life.counts().break + life.counts().idle).toBe(47);
    step(life, 60);
    expect(life.counts().collaborating).toBeGreaterThan(0);
    for (const e of life.employees.filter(e => e.activity === 'collaborating')) {
      const partner = life.getEmployee(e.partner!);
      expect(partner?.department).toBe(e.department);
      expect(partner?.partner).toBe(e.id);
      expect(partner?.sharedTaskId).toBe(e.sharedTaskId);
      expect(partner?.activity).toBe('collaborating');
    }
    step(life, 20);
    expect(life.counts().break).toBeGreaterThan(0);
    step(life, 25);
    expect(life.counts().idle).toBeGreaterThan(0);
    step(life, 15);
    expect(life.counts().working).toBeGreaterThan(0);
    expect(life.events.every(e => e.time >= 0 && e.id.startsWith('ROBOT-'))).toBe(true);
  });

  test('employee info query and explicit complete/blocked/waiting state transitions work', () => {
    const life = new EmployeeLife();
    const e = life.getEmployee('ROBOT-001')!;
    expect(e.department).toBe('Executive Office');
    expect(e.taskId).toBe('DEMO-TASK-001');
    expect(life.setStatus(e.id, 'blocked', 'Demo blocked scenario')).toBe(true);
    expect(e.status).toBe('blocked');
    expect(e.history.at(-1)?.note).toBe('Demo blocked scenario');
    step(life, 15);
    expect(e.status).toBe('blocked'); // an explicit blocked state is not erased by the idle visual schedule
    expect(life.setStatus(e.id, 'completed')).toBe(true);
    expect(e.progress).toBe(100);
    expect(e.status).toBe('completed');
    expect(life.setStatus('NOT-A-ROBOT', 'working')).toBe(false);
    expect(e.history.length).toBeLessThanOrEqual(12);
  });

  test('runtime controls pause, reset, invalid/large frames, and speed bounds are safe', () => {
    const life = new EmployeeLife();
    life.dispatch({ type: 'set-speed', value: 100 });
    life.advance(1);
    expect(life.time).toBe(2); // frame catch-up capped at .25s; speed capped at 8x
    life.dispatch({ type: 'pause' });
    life.advance(10);
    expect(life.time).toBe(2);
    life.dispatch({ type: 'resume' });
    life.advance(Number.NaN);
    life.advance(-1);
    expect(life.time).toBe(2);
    life.dispatch({ type: 'reset' });
    expect(life.time).toBe(0);
    expect(life.events).toHaveLength(0);
    expect(life.employees.every(e => e.status === 'working' && e.progress === 0)).toBe(true);
  });

  test('transition history and employee histories are memory bounded over repeated cycles', () => {
    const life = new EmployeeLife();
    for (let i = 0; i < 2400; i++) life.advance(0.25);
    expect(life.time).toBe(600);
    expect(life.events.length).toBeLessThanOrEqual(MAX_EVENTS);
    expect(life.employees.every(e => e.history.length <= 12 && e.energy >= 0 && e.energy <= 1)).toBe(true);
  });

  test('frame-rate probe tracks 60 Hz input', () => {
    const life = new EmployeeLife();
    for (let i = 0; i < 120; i++) life.advance(1 / 60);
    expect(life.fps).toBeCloseTo(60, 0);
    expect(life.events.length).toBeLessThanOrEqual(MAX_EVENTS);
  });

  test('motion stays bounded and reduced-motion mode is exactly still', () => {
    const life = new EmployeeLife();
    for (let i = 0; i < 100; i++) life.advance(0.25);
    for (const e of life.employees) {
      expect(lifeMotion(e, true)).toEqual({ y: 0, yaw: 0 });
      const moving = lifeMotion(e, false);
      expect(Math.abs(moving.y)).toBeLessThanOrEqual(0.025);
      expect(Math.abs(moving.yaw)).toBeLessThanOrEqual(0.09);
    }
  });
});
