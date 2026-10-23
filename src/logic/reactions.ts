import { REACTIONS } from '@/data/reactions';
import type { Difficulty, IGameState, IIngredient, IReaction } from '@/types';

export const getReactions = (difficulty: Difficulty): readonly IReaction[] =>
  REACTIONS.filter((reaction) => reaction.difficulty === difficulty);

export const getFiredReactions = (
  before: IIngredient[],
  after: IIngredient[],
  difficulty: Difficulty,
): IReaction[] => {
  const reactionsByDifficulty = getReactions(difficulty);
  return reactionsByDifficulty.filter(
    (reaction) => !reaction.isActive(before) && reaction.isActive(after),
  );
};

export const applyReactionEffects = (state: IGameState, reaction: IReaction): void => {
  if (reaction.timePenalty) {
    state.timeLeft = Math.max(0, state.timeLeft - reaction.timePenalty);
  }

  if (reaction.lifePenalty) {
    state.lives -= reaction.lifePenalty;
  }

  if (reaction.clearsCauldron) {
    state.cauldronIngredients = [];
  }

  state.lastReactionId = reaction.id;
};
