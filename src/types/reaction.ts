import type { Difficulty } from './difficulty';
import type { IIngredient } from './ingredient';

export interface IReaction {
  id: string;
  name: string;
  difficulty: Exclude<Difficulty, 'easy'>;
  isActive: (ingredients: IIngredient[]) => boolean;
  apply: (values: { temperature: number; density: number; magicPower: number }) => {
    temperature: number;
    density: number;
    magicPower: number;
  };
}
