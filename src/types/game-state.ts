import type { Difficulty } from './difficulty';
import type { GameStatus } from './game-status';
import type { IIngredient } from './ingredient';
import type { IRecipe } from './recipe';

export interface IGameState {
  status: GameStatus;
  score: number;
  timeLeft: number;
  lives: number;
  activeRecipe: IRecipe | null;
  cauldronIngredients: IIngredient[];
  shelfStock: Record<string, number>; // ingredient id -> portions left
  difficulty?: Difficulty; // Level 2+
  lastReactionId?: string | null; // Level 3+
}
