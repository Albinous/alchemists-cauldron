import type { Difficulty } from './difficulty';
import type { IRecipeRange } from './recipe-range';

export interface IRecipe {
  id: string;
  name: string;
  difficulty: Difficulty;
  temperature: IRecipeRange;
  density: IRecipeRange;
  magicPower: IRecipeRange;
}
