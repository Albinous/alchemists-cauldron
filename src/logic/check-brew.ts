import { PARAMETER_KEYS } from '@/data';
import type { ICauldronValues, IRecipe } from '@/types';
import { isInRange } from './is-in-range';

export const isBrewSuccessful = (
  values: ICauldronValues,
  recipe: IRecipe | undefined,
  tolerance: number,
): boolean => {
  return recipe === undefined
    ? false
    : PARAMETER_KEYS.every((parameter) =>
        isInRange(values[parameter], recipe[parameter], tolerance),
      );
};
