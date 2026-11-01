import type { ICauldronValues } from './cauldron-values';
import type { Difficulty } from './difficulty';
import type { IIngredient } from './ingredient';

export interface IReaction {
  id: string;
  name: string;
  difficulty: Exclude<Difficulty, 'easy'>;
  isActive: (ingredients: IIngredient[]) => boolean;
  apply: (values: ICauldronValues) => ICauldronValues;
  timePenalty?: number;
  lifePenalty?: number;
  clearsCauldron?: boolean;
}
