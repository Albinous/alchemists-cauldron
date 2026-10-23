import { REACTIONS } from '@/data/reactions';
import type { Difficulty, IReaction } from '@/types';

export const getReactions = (difficulty: Difficulty): readonly IReaction[] =>
  REACTIONS.filter((reaction) => reaction.difficulty === difficulty);
