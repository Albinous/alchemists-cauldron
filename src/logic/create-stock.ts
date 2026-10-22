import type { IIngredient } from '@/types';
import { getRandomInt } from '@/utils/random-number';

const MIN_STOCK_COUNT = 2;
export const MAX_STOCK_COUNT = 15;

export const createStock = (ingredients: readonly IIngredient[]): Record<string, number> =>
  Object.fromEntries(
    ingredients.map((ingredient) => [
      ingredient.id,
      getRandomInt(MIN_STOCK_COUNT, MAX_STOCK_COUNT),
    ]),
  );
