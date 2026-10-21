import { DEFAULT_DIFFICULTY, difficultySettings, ingredients } from '@/data';
import type { Difficulty, IGameState, IIngredient } from '@/types';
import { createStock } from '../logic/create-stock';
import { getRandomRecipe } from '../logic/recipe-generator';

export const getShelfIngredients = (shelfSize: number): IIngredient[] =>
  ingredients.slice(0, shelfSize);

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
    shelfStock: createStock(getShelfIngredients(settings.ingredientsOnShelf)),
    activeRecipe: getRandomRecipe(difficulty),
    lives: settings.lives,
    timeLeft: settings.startTimeSec,
  };
};
