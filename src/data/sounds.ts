import type { SoundName, SoundStep } from '@/types';

export const SOUND_RECIPES: Record<SoundName, readonly SoundStep[]> = {
  // a bubble: pitch slides up
  add: [{ kind: 'tone', frequency: 300, endFrequency: 800, duration: 0.15, volume: 0.25 }],

  // a rising major chord C–E–G and a high C
  success: [
    { kind: 'tone', type: 'triangle', frequency: 523, duration: 0.2, volume: 0.2 },
    { kind: 'tone', type: 'triangle', frequency: 659, duration: 0.2, volume: 0.2, delay: 0.1 },
    { kind: 'tone', type: 'triangle', frequency: 784, duration: 0.2, volume: 0.2, delay: 0.2 },
    { kind: 'tone', type: 'triangle', frequency: 1047, duration: 0.45, volume: 0.2, delay: 0.3 },
  ],

  // an explosion and a low thud under it
  fail: [
    { kind: 'noise', duration: 0.6, volume: 0.45, filterFrom: 2500, filterTo: 80 },
    { kind: 'tone', frequency: 110, endFrequency: 45, duration: 0.4, volume: 0.4 },
  ],

  // a shimmer: two slightly detuned notes beat against each other
  reaction: [
    { kind: 'tone', frequency: 880, duration: 0.5, volume: 0.12 },
    { kind: 'tone', frequency: 892, duration: 0.5, volume: 0.12 },
    { kind: 'tone', frequency: 1320, duration: 0.35, volume: 0.08, delay: 0.08 },
  ],

  // water going down the drain: the noise swells and gets duller
  'pour-out': [
    { kind: 'noise', duration: 0.8, volume: 0.3, filterFrom: 1500, filterTo: 200, attack: 0.2 },
  ],

  // a short dry tick
  tick: [{ kind: 'tone', type: 'square', frequency: 1200, duration: 0.04, volume: 0.06 }],

  // a falling minor phrase
  'game-over': [
    { kind: 'tone', frequency: 392, duration: 0.3, volume: 0.2 },
    { kind: 'tone', frequency: 330, duration: 0.3, volume: 0.2, delay: 0.25 },
    { kind: 'tone', frequency: 262, duration: 0.6, volume: 0.2, delay: 0.5 },
  ],
};
