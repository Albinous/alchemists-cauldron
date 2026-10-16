import { MAX_CAULDRON_COUNT } from '@/data';
import type { IGameState } from '@/types';

export const isCauldronFull = (state: Readonly<IGameState>): boolean => {
  return state.cauldronIngredients.length >= MAX_CAULDRON_COUNT;
};
