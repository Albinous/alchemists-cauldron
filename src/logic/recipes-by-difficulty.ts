import { recipes } from '@/data';
import type { Difficulty, IRecipe } from '@/types';

export const getRecipesByDifficulty = (difficulty: Difficulty): IRecipe[] => {
  return recipes.filter((recipe) => recipe.difficulty === difficulty);
};
