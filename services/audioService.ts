
type OscillatorType = 'sawtooth' | 'sine' | 'square' | 'triangle';

let audioCtx: AudioContext | null = null;
let isMuted = false;

const getCtx = () => {
  if (!audioCtx) {
    // @ts-ignore
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  return audioCtx;
};

const playTone = (
  freq: number,
  type: OscillatorType,
  duration: number,
  vol: number = 0.1,
  startTime: number = 0
) => {
  const ctx = getCtx();
  if (!ctx || isMuted) return;

  // Resume context if suspended (browser policy)
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);

  gain.gain.setValueAtTime(vol, ctx.currentTime + startTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime + startTime);
  osc.stop(ctx.currentTime + startTime + duration);
};

export const audio = {
  move: () => playTone(220, 'square', 0.05, 0.05),
  rotate: () => playTone(440, 'square', 0.05, 0.05),
  drop: () => playTone(110, 'sawtooth', 0.1, 0.1), // Heavy drop
  clear: () => {
    playTone(523.25, 'square', 0.1, 0.1, 0);     // C5
    playTone(659.25, 'square', 0.1, 0.1, 0.1);   // E5
    playTone(783.99, 'square', 0.2, 0.1, 0.2);   // G5
    playTone(1046.50, 'square', 0.4, 0.1, 0.3);  // C6
  },
  gameOver: () => {
    playTone(392.00, 'sawtooth', 0.3, 0.2, 0);
    playTone(369.99, 'sawtooth', 0.3, 0.2, 0.25);
    playTone(349.23, 'sawtooth', 0.3, 0.2, 0.5);
    playTone(329.63, 'sawtooth', 0.8, 0.2, 0.75);
  },
  start: () => {
    playTone(440, 'square', 0.1, 0.1, 0);
    playTone(554, 'square', 0.1, 0.1, 0.1);
    playTone(659, 'square', 0.3, 0.1, 0.2);
  }
};
