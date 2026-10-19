import type { GameOverReason, IGameState } from '@/types';

export const getGameOverReason = (state: IGameState): GameOverReason | undefined => {
  if (state.timeLeft <= 0) {
    return 'time-up';
  }
  if (state.lives === 0) {
    return 'no-lives';
  }
  const isShelfEmpty = Object.values(state.shelfStock).every((value) => value === 0);

  return isShelfEmpty && state.cauldronIngredients.length === 0 ? 'out-of-ingredients' : undefined;
};
