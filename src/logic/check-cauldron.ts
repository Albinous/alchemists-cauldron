import type { IGameState } from '@/types';

export const isCauldronFull = (state: Readonly<IGameState>, max: number): boolean => {
  return state.cauldronIngredients.length >= max;
};
