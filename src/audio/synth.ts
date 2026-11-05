import type { INoiseOptions, IToneOptions } from '@/types';
import { audio } from './audio-engine';

const ATTACK_SEC = 0.01;
const SILENCE = 0.001; // exponential ramps cannot reach 0

// volume shape: silence → up to `volume` during `attack` → fade out by `end`
const createEnvelope = (
  context: AudioContext,
  volume: number,
  start: number,
  end: number,
  attack = ATTACK_SEC,
): GainNode => {
  const envelope = context.createGain();
  envelope.gain.setValueAtTime(0, start);
  envelope.gain.linearRampToValueAtTime(volume, start + attack);
  envelope.gain.exponentialRampToValueAtTime(SILENCE, end);
  return envelope;
};

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

  const envelope = createEnvelope(context, volume, start, end);

  oscillator.connect(envelope).connect(output);
  oscillator.start(start);
  oscillator.stop(end);
};

const noiseBuffers = new WeakMap<AudioContext, AudioBuffer>();

const getNoiseBuffer = (context: AudioContext): AudioBuffer => {
  const cached = noiseBuffers.get(context);
  if (cached) return cached;

  const buffer = context.createBuffer(1, context.sampleRate, context.sampleRate);
  const samples = buffer.getChannelData(0);
  for (let index = 0; index < samples.length; index += 1) {
    samples[index] = Math.random() * 2 - 1;
  }

  noiseBuffers.set(context, buffer);
  return buffer;
};

export const playNoise = ({
  duration,
  volume,
  filterFrom,
  filterTo,
  attack = ATTACK_SEC,
  delay = 0,
}: INoiseOptions): void => {
  const context = audio.getContext();
  const output = audio.getOutput('sfx');

  if (!context || !output) return;

  const start = context.currentTime + delay;
  const end = start + duration;

  const noise = context.createBufferSource();
  noise.buffer = getNoiseBuffer(context);
  noise.loop = true;

  const filter = context.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(filterFrom, start);
  filter.frequency.exponentialRampToValueAtTime(filterTo, end);

  const envelope = createEnvelope(context, volume, start, end, attack);

  noise.connect(filter).connect(envelope).connect(output);
  noise.start(start);
  noise.stop(end);
};
