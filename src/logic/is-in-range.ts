import type { IRecipeRange } from '@/types';

export const isInRange = (value: number, range: IRecipeRange) =>
  value >= range.min && value <= range.max;
