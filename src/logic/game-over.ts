import type { GameOverReason, IGameState } from '@/types';

const NAME_PATTERN = /^[\p{L}\d _-]{2,15}$/u;

export const isValidName = (name: string): boolean => NAME_PATTERN.test(name);

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
