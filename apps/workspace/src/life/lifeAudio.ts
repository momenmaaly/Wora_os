/** Opt-in synthesized cues only: no network, microphone, autoplay, or speech. */
export class LifeAudio {
  private context?: AudioContext;
  private last = -Infinity;
  async enable() {
    this.context ??= new AudioContext();
    await this.context.resume();
  }
  cue(now: number) {
    const ctx = this.context;
    if (!ctx || ctx.state !== 'running' || now - this.last < 1) return;
    this.last = now;
    const osc = ctx.createOscillator(), gain = ctx.createGain();
    osc.frequency.value = 520;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.025, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.09);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.onended = () => { osc.disconnect(); gain.disconnect(); };
    osc.start(); osc.stop(ctx.currentTime + 0.1);
  }
  dispose() { const ctx = this.context; this.context = undefined; if (ctx) void ctx.close(); }
}
