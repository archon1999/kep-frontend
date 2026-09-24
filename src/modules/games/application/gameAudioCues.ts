export type GameCue = 'select' | 'correct' | 'wrong' | 'complete' | 'run' | 'step' | 'cell';

const cellPitches = [
  261.63, 293.66, 329.63, 349.23, 392, 440, 493.88, 523.25, 587.33, 659.25, 698.46, 783.99, 880,
  987.77, 1046.5, 1174.66,
];

type Note = { pitch: number; delay: number; length: number; gain: number };

const cueNotes = (cue: GameCue, cellIndex = 0): Note[] => {
  switch (cue) {
    case 'select':
      return [{ pitch: 523.25, delay: 0, length: 0.085, gain: 0.022 }];
    case 'correct':
      return [
        { pitch: 659.25, delay: 0, length: 0.12, gain: 0.032 },
        { pitch: 987.77, delay: 0.09, length: 0.18, gain: 0.027 },
      ];
    case 'wrong':
      return [
        { pitch: 330, delay: 0, length: 0.16, gain: 0.027 },
        { pitch: 246.94, delay: 0.11, length: 0.22, gain: 0.023 },
      ];
    case 'complete':
      return [
        { pitch: 523.25, delay: 0, length: 0.2, gain: 0.033 },
        { pitch: 659.25, delay: 0.11, length: 0.22, gain: 0.031 },
        { pitch: 783.99, delay: 0.23, length: 0.24, gain: 0.029 },
        { pitch: 1046.5, delay: 0.36, length: 0.34, gain: 0.026 },
      ];
    case 'run':
      return [
        { pitch: 392, delay: 0, length: 0.11, gain: 0.022 },
        { pitch: 523.25, delay: 0.09, length: 0.13, gain: 0.02 },
      ];
    case 'step':
      return [{ pitch: 392, delay: 0, length: 0.045, gain: 0.009 }];
    case 'cell':
      return [
        {
          pitch: cellPitches[Math.abs(Math.trunc(cellIndex)) % cellPitches.length],
          delay: 0,
          length: 0.19,
          gain: 0.032,
        },
      ];
  }
};

/** Quiet generated UI cues; no external sound-effect assets or audio downloads. */
export const playGameCue = (context: AudioContext, cue: GameCue, cellIndex?: number) => {
  const now = context.currentTime;
  for (const note of cueNotes(cue, cellIndex)) {
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    const start = now + note.delay;
    const end = start + note.length;
    oscillator.type = cue === 'wrong' ? 'sine' : 'triangle';
    oscillator.frequency.setValueAtTime(note.pitch, start);
    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.linearRampToValueAtTime(note.gain, start + 0.012);
    envelope.gain.exponentialRampToValueAtTime(0.0001, end);
    oscillator.connect(envelope);
    envelope.connect(context.destination);
    oscillator.start(start);
    oscillator.stop(end + 0.01);
    oscillator.onended = () => {
      oscillator.disconnect();
      envelope.disconnect();
    };
  }
};
