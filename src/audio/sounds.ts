import { SOUND_RECIPES } from '@/data';
import type { SoundName } from '@/types';
import { playNoise, playTone } from './synth';

export const playSound = (name: SoundName): void => {
  const steps = SOUND_RECIPES[name];
  for (const step of steps) {
    if (step.kind === 'tone') {
      playTone(step);
    } else {
      playNoise(step);
    }
  }
};
