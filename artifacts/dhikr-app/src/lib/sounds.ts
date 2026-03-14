interface WebkitWindow extends Window {
  webkitAudioContext?: typeof AudioContext;
}

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  try {
    const w = window as WebkitWindow;
    const Ctor = window.AudioContext || w.webkitAudioContext;
    if (!Ctor) return null;
    if (!ctx || ctx.state === "closed") {
      ctx = new Ctor();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

export function playAchievementChime(): void {
  const ac = getCtx();
  if (!ac) return;

  const now = ac.currentTime;
  const master = ac.createGain();
  master.gain.setValueAtTime(0.18, now);
  master.connect(ac.destination);

  const notes = [523.25, 783.99];

  notes.forEach((freq, i) => {
    const osc = ac.createOscillator();
    const env = ac.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);
    env.gain.setValueAtTime(0, now + i * 0.15);
    env.gain.linearRampToValueAtTime(1, now + i * 0.15 + 0.04);
    env.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.4);
    osc.connect(env);
    env.connect(master);
    osc.start(now + i * 0.15);
    osc.stop(now + i * 0.15 + 0.45);
  });

  setTimeout(() => master.disconnect(), 1200);
}
