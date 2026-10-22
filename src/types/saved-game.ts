import type { Difficulty } from './difficulty';
import type { GameStatus } from './game-status';
import type { IRecipe } from './recipe';

export interface ISavedGame {
  difficulty: Difficulty;
  score: number;
  timeLeft: number;
  lives: number;
  activeRecipe: IRecipe | undefined;
  cauldronIngredients: string[]; // ingredient ids, not objects
  shelfStock: Record<string, number>;
  status: GameStatus;
}
