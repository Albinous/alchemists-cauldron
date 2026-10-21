import { DEFAULT_DIFFICULTY, difficultySettings, ingredients } from '@/data';
import { createStock, getRandomRecipe } from '@/logic';
import type { Difficulty, IGameState, IIngredient } from '@/types';

export const getShelfIngredients = (shelfSize: number): IIngredient[] =>
  ingredients.slice(0, shelfSize);

export const createInitialState = (difficulty: Difficulty = DEFAULT_DIFFICULTY): IGameState => ({
  status: 'menu',
  score: 0,
  timeLeft: 0,
  lives: 0,
  activeRecipe: undefined,
  cauldronIngredients: [],
  shelfStock: {},
  difficulty,
});

export const createNewGame = (difficulty: Difficulty): IGameState => {
  const settings = difficultySettings[difficulty];
  return {
    ...createInitialState(difficulty),
    status: 'playing',
    shelfStock: createStock(getShelfIngredients(settings.ingredientsOnShelf)),
    activeRecipe: getRandomRecipe(difficulty),
    lives: settings.lives,
    timeLeft: settings.startTimeSec,
  };
};
