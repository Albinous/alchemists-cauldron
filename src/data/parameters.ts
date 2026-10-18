import type { ICauldronValues } from '@/types';

export const PARAMETER_LABELS: Record<keyof ICauldronValues, string> = {
  temperature: 'Temperature',
  density: 'Density',
  magicPower: 'Magic Power',
};

export const PARAMETER_KEYS: readonly (keyof ICauldronValues)[] = [
  'temperature',
  'density',
  'magicPower',
];
