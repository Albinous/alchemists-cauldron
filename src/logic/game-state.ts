import { DEFAULT_DIFFICULTY, ingredients, LEVEL_1_SHELF_SIZE } from '@/data';
import type { IGameState, IIngredient } from '@/types';
import { createStock } from './create-stock';

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

export const createNewGame = (): IGameState => ({
  ...createInitialState(),
  status: 'playing',
  shelfStock: createStock(getShelfIngredients()),
});
