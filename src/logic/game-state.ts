import { DEFAULT_DIFFICULTY, difficultySettings, ingredients, LEVEL_1_SHELF_SIZE } from '@/data';
import type { Difficulty, IGameState, IIngredient } from '@/types';
import { createStock } from './create-stock';
import { getRandomRecipe } from './recipe-generator';

export const getShelfIngredients = (): IIngredient[] => ingredients.slice(0, LEVEL_1_SHELF_SIZE);

export const createInitialState = (): IGameState => ({
  status: 'menu',
  score: 0,
  timeLeft: 0,
  lives: 0,
  activeRecipe: undefined,
  cauldronIngredients: [],
  shelfStock: {},
  difficulty: DEFAULT_DIFFICULTY,
});

export const createNewGame = (difficulty: Difficulty = DEFAULT_DIFFICULTY): IGameState => {
  const settings = difficultySettings[difficulty];
  return {
    ...createInitialState(),
    status: 'playing',
    difficulty,
    shelfStock: createStock(getShelfIngredients()),
    activeRecipe: getRandomRecipe(difficulty),
    lives: settings.lives,
    timeLeft: settings.startTimeSec,
  };
};
