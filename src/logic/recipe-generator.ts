import type { Difficulty, IRecipe } from '@/types';
import { getRecipesByDifficulty } from './recipes-by-difficulty';

export const getRandomRecipe = (difficulty: Difficulty): IRecipe => {
  const recipes = getRecipesByDifficulty(difficulty);

  const recipe = recipes[Math.floor(Math.random() * recipes.length)];

  if (!recipe) {
    throw new Error(`No recipes found for difficulty: ${difficulty}`);
  }

  return recipe;
};
