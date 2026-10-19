import { PARAMETER_KEYS } from '@/data';
import type { ICauldronValues, IRecipe } from '@/types';
import { isInRange } from './is-in-range';

export const isBrewSuccessful = (
  values: ICauldronValues,
  recipe: IRecipe,
  tolerance: number,
): boolean => {
  return PARAMETER_KEYS.every((parameter) =>
    isInRange(values[parameter], recipe[parameter], tolerance),
  );
};
