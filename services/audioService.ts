
type OscillatorType = 'sawtooth' | 'sine' | 'square' | 'triangle';

let audioCtx: AudioContext | null = null;
let isMuted = false;
let isPlayingBGM = false;
let nextNoteTime = 0;
let noteIndex = 0;
let schedulerTimer: number | null = null;

// Frequencies
const D3 = 146.83;
const G3 = 196.00;
const A3 = 220.00;
const B3 = 246.94;
const C4 = 261.63;
const D4 = 293.66;
const E4 = 329.63;
const F4 = 349.23;
const Fs4 = 369.99;
const G4 = 392.00;
const A4 = 440.00;
const B4 = 493.88;
const C5 = 523.25;
const Cs5 = 554.37;
const D5 = 587.33;
const E5 = 659.25;
const Fs5 = 739.99;
const G5 = 783.99;

// Pokemon Red/Blue Title Theme (Main Loop Transcription)
// 16th notes
const TEMPO = 0.11; 

const MELODY_LINE = [
  // Bar 1: G4 G4 G4 -> D5 ... B4 ... G4
  G4, 0, G4, 0, G4, 0, D5, 0, 
  0, 0, B4, 0, 0, 0, G4, 0,
  
  // Bar 2: C5 C5 C5 -> E5 ... C5 ... A4
  C5, 0, C5, 0, C5, 0, E5, 0,
  0, 0, C5, 0, 0, 0, A4, 0,

  // Bar 3: F#4 F#4 F#4 -> A4 ... F#4 ... D4
  Fs4, 0, Fs4, 0, Fs4, 0, A4, 0,
  0, 0, Fs4, 0, 0, 0, D4, 0,

  // Bar 4: G4 ... B4 ... D5 ... G5
  G4, 0, 0, 0, B4, 0, D5, 0,
  G5, 0, 0, 0, 0, 0, 0, 0,

  // Bar 5: (Variation)
  G4, 0, G4, 0, G4, 0, D5, 0, 
  0, 0, B4, 0, 0, 0, G4, 0,

  // Bar 6:
  C5, 0, C5, 0, C5, 0, E5, 0,
  0, 0, C5, 0, 0, 0, A4, 0,

  // Bar 7:
  D4, 0, Fs4, 0, A4, 0, C5, 0,
  B4, 0, A4, 0, G4, 0, Fs4, 0,

  // Bar 8:
  G4, 0, 0, 0, D4, 0, G4, 0,
  B4, 0, G5, 0, G4, 0, 0, 0
];

const BASS_LINE = [
  // Driving Bass (Alternating G and D mostly)
  G3, 0, G3, 0, D3, 0, G3, 0,
  G3, 0, G3, 0, D3, 0, G3, 0,

  C4, 0, C4, 0, G3, 0, C4, 0,
  C4, 0, C4, 0, G3, 0, C4, 0,

  D4, 0, D4, 0, A3, 0, D4, 0,
  D4, 0, D4, 0, A3, 0, D4, 0,

  G3, 0, B3, 0, D4, 0, G4, 0,
  G3, 0, 0, 0, D3, 0, 0, 0,

  // Repeat similar pattern
  G3, 0, G3, 0, D3, 0, G3, 0,
  G3, 0, G3, 0, D3, 0, G3, 0,

  C4, 0, C4, 0, G3, 0, C4, 0,
  C4, 0, C4, 0, G3, 0, C4, 0,

  D4, 0, D4, 0, A3, 0, D4, 0,
  D4, 0, D4, 0, A3, 0, D4, 0,

  G3, 0, D3, 0, G3, 0, D3, 0,
  G3, 0, G3, 0, 0, 0, 0, 0
];

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
  startTime?: number
) => {
  if (isMuted) return;
  const ctx = getCtx();
  if (!ctx) return;

  const start = startTime !== undefined ? startTime : ctx.currentTime;

  // Resume context if suspended (browser policy)
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);

  gain.gain.setValueAtTime(vol, start);
  gain.gain.exponentialRampToValueAtTime(0.01, start + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(start);
  osc.stop(start + duration);
};

// Scheduler for BGM
const scheduleNote = (time: number) => {
  if (isMuted) return;
  
  // Play Bass (Square wave for 8-bit Gameboy bass feel)
  const bassFreq = BASS_LINE[noteIndex % BASS_LINE.length];
  if (bassFreq) {
    playTone(bassFreq, 'square', 0.1, 0.12, time);
  }

  // Play Melody (Sawtooth/Square mix for Lead)
  const melodyFreq = MELODY_LINE[noteIndex % MELODY_LINE.length];
  if (melodyFreq) {
    // Main lead
    playTone(melodyFreq, 'square', 0.1, 0.08, time);
    // Slight detuned layer for thickness (chorus effect)
    playTone(melodyFreq + 2, 'sawtooth', 0.1, 0.04, time);
  }
};

const nextNote = () => {
  nextNoteTime += TEMPO;
  noteIndex++;
};

const scheduler = () => {
  if (!isPlayingBGM) return;
  
  const ctx = getCtx();
  if (!ctx) return;

  // Lookahead: 0.1 seconds
  while (nextNoteTime < ctx.currentTime + 0.1) {
    scheduleNote(nextNoteTime);
    nextNote();
  }
  schedulerTimer = window.setTimeout(scheduler, 25);
};

export const audio = {
  move: () => playTone(220, 'square', 0.05, 0.05),
  rotate: () => playTone(440, 'square', 0.05, 0.05),
  drop: () => playTone(110, 'sawtooth', 0.1, 0.1), 
  clear: () => {
    // Pokemon "Get Item" or "Level Up" style jingle
    const now = getCtx()?.currentTime || 0;
    playTone(1174.66, 'square', 0.08, 0.1, now); // D6
    playTone(1318.51, 'square', 0.08, 0.1, now + 0.08); // E6
    playTone(1396.91, 'square', 0.08, 0.1, now + 0.16); // F6
    playTone(1567.98, 'square', 0.2, 0.1, now + 0.24); // G6 
  },
  gameOver: () => {
    // Sad chromatic scale down
    const now = getCtx()?.currentTime || 0;
    playTone(392.00, 'sawtooth', 0.3, 0.2, now);
    playTone(369.99, 'sawtooth', 0.3, 0.2, now + 0.25);
    playTone(349.23, 'sawtooth', 0.3, 0.2, now + 0.5);
    playTone(329.63, 'sawtooth', 0.8, 0.2, now + 0.75);
  },
  start: () => {
    const ctx = getCtx();
    if (ctx && ctx.state === 'suspended') {
        ctx.resume();
    }
    // "Game Start" / "Select" sound
    const now = ctx?.currentTime || 0;
    playTone(440, 'square', 0.1, 0.1, now);
    playTone(880, 'square', 0.4, 0.1, now + 0.1);
  },
  
  playBGM: () => {
    const ctx = getCtx();
    if (!ctx) return;

    // Ensure context is running
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    if (!isPlayingBGM) {
        isPlayingBGM = true;
        noteIndex = 0;
        nextNoteTime = ctx.currentTime + 0.1;
        scheduler();
    }
  },
  stopBGM: () => {
    isPlayingBGM = false;
    if (schedulerTimer) {
        clearTimeout(schedulerTimer);
        schedulerTimer = null;
    }
  },
  setMute: (muted: boolean) => {
      isMuted = muted;
  }
};
