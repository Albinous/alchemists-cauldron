import type { IGameState } from '@/types';

export const canBrew = (state: IGameState): boolean => {
  return state.status === 'playing' && state.cauldronIngredients.length > 0;
};
