import type { Difficulty, ICauldronValues, IIngredient } from '@/types';
import { getReactions } from './reactions';
import { PARAMETER_KEYS } from '@/data';

export const calculateCauldron = (ingredients: readonly IIngredient[]): ICauldronValues => {
  const values: ICauldronValues = {
    temperature: 0,
    density: 0,
    magicPower: 0,
  };

  for (const ingredient of ingredients) {
    values.temperature += ingredient.temperature;
    values.density += ingredient.density;
    values.magicPower += ingredient.magicPower;
  }

  return values;
};

export const calculateCauldronWithReactions = (
  ingredients: IIngredient[],
  difficulty: Difficulty,
): ICauldronValues => {
  const baseValues = calculateCauldron(ingredients);
  const activeReactions = getReactions(difficulty).filter((reaction) =>
    reaction.isActive(ingredients),
  );

  let values = baseValues;

  for (const activeReaction of activeReactions) {
    values = activeReaction.apply(values);
  }

  for (const key of PARAMETER_KEYS) {
    values[key] = Math.round(values[key]);
  }

  return values;
};
