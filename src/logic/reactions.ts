import { REACTIONS } from '@/data/reactions';
import type { Difficulty, IGameState, IIngredient, IReaction } from '@/types';
import { clearCauldron } from './cauldron';
import { applyTimePenalty } from './timer';

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
    applyTimePenalty(state, reaction.timePenalty);
  }

  if (reaction.lifePenalty) {
    state.lives -= reaction.lifePenalty;
  }

  if (reaction.clearsCauldron) {
    clearCauldron(state);
  }

  state.lastReactionId = reaction.id;
};
