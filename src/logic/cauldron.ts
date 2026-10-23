import type { IGameState } from '@/types';

export const clearCauldron = (state: IGameState): void => {
  state.cauldronIngredients = [];
};

export const canUseCauldron = (state: IGameState): boolean =>
  state.status === 'playing' && state.cauldronIngredients.length > 0;

export const canBrew = (state: IGameState): boolean => canUseCauldron(state);
export const canPourOut = (state: IGameState): boolean => canUseCauldron(state);
