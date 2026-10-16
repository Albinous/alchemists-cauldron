import type { IGameState, IIngredient } from '@/types';
import { isCauldronFull } from './check-cauldron';

export const canAddIngredient = (state: IGameState, ingredient: Readonly<IIngredient>): boolean => {
  const stock = state.shelfStock[ingredient.id] ?? 0;
  return !isCauldronFull && stock > 0;
};

export const addIngredient = (state: IGameState, ingredient: IIngredient): void => {
  if (!canAddIngredient(state, ingredient)) return;
  state.cauldronIngredients.push(ingredient);
  state.shelfStock[ingredient.id] -= 1;
};
