import type { IToneOptions } from '@/types';
import { audio } from '.';

const ATTACK_SEC = 0.01;
const SILENCE = 0.001; // exponential ramps cannot reach 0

export const playTone = ({
  frequency,
  endFrequency,
  type = 'sine',
  duration,
  volume,
  delay = 0,
}: IToneOptions): void => {
  const context = audio.getContext();
  const output = audio.getOutput('sfx');

  if (!context || !output) return;

  const start = context.currentTime + delay;
  const end = start + duration;

  const oscillator = context.createOscillator();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);

  if (endFrequency !== undefined) {
    oscillator.frequency.exponentialRampToValueAtTime(endFrequency, end);
  }

  const envelope = context.createGain();
  envelope.gain.setValueAtTime(0, start);
  envelope.gain.linearRampToValueAtTime(volume, start + ATTACK_SEC);
  envelope.gain.exponentialRampToValueAtTime(SILENCE, end);

  oscillator.connect(envelope).connect(output);
  oscillator.start(start);
  oscillator.stop(end);
};
