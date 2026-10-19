import type { IRecipeRange } from '@/types';

export const isInRange = (value: number, range: IRecipeRange, tolerance = 0): boolean =>
  value >= range.min - tolerance && value <= range.max + tolerance;
