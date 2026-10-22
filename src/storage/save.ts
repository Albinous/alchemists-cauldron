import type { IGameState, ISavedGame } from '@/types';
import { isDifficulty } from './leaderboard';
import { ingredients, recipes } from '@/data';
import { MAX_STOCK_COUNT } from '@/logic';

const GAME_STATE_KEY = 'alchemists-cauldron:game-state';

const isNonNegativeNumber = (value: unknown): value is number =>
  typeof value === 'number' && value >= 0;

const isKnownRecipe = (value: unknown): boolean => {
  return (
    value !== null &&
    typeof value === 'object' &&
    'name' in value &&
    typeof value.name === 'string' &&
    recipes.some((recipe) => recipe.name === value.name)
  );
};

const isKnownIngredientId = (value: unknown): value is string =>
  typeof value === 'string' && ingredients.some((ingredient) => ingredient.id === value);

const isValidStock = (value: unknown): value is Record<string, number> =>
  value !== null &&
  typeof value === 'object' &&
  !Array.isArray(value) &&
  Object.entries(value).every(
    ([id, count]) =>
      isKnownIngredientId(id) &&
      typeof count === 'number' &&
      Number.isSafeInteger(count) &&
      count >= 0 &&
      count <= MAX_STOCK_COUNT,
  );

const isValidSave = (value: unknown): value is ISavedGame => {
  if (value === null || typeof value !== 'object') return false;

  const hasStatus =
    'status' in value &&
    typeof value.status === 'string' &&
    (value.status === 'playing' || value.status === 'paused');
  const hasDifficulty = 'difficulty' in value && isDifficulty(value.difficulty);
  const hasScore = 'score' in value && isNonNegativeNumber(value.score);
  const hasTimeLeft = 'timeLeft' in value && isNonNegativeNumber(value.timeLeft);
  const hasLives = 'lives' in value && isNonNegativeNumber(value.lives);
  const hasRecipe = 'activeRecipe' in value && isKnownRecipe(value.activeRecipe);
  const hasCauldron =
    'cauldronIngredients' in value &&
    Array.isArray(value.cauldronIngredients) &&
    value.cauldronIngredients.every(isKnownIngredientId);
  const hasShelfStock = 'shelfStock' in value && isValidStock(value.shelfStock);

  return (
    hasStatus &&
    hasDifficulty &&
    hasScore &&
    hasTimeLeft &&
    hasLives &&
    hasRecipe &&
    hasCauldron &&
    hasShelfStock
  );
};

const toGameState = (savedState: ISavedGame): IGameState => {
  const cauldronIngredients = savedState.cauldronIngredients.flatMap((id) => {
    const ingredient = ingredients.find((item) => item.id === id);
    return ingredient ? [ingredient] : [];
  });
  const activeRecipe = recipes.find((recipe) => recipe.name === savedState.activeRecipe?.name);

  const state = {
    ...savedState,
    cauldronIngredients,
    activeRecipe,
  };

  return state;
};

export const saveGame = (state: IGameState): void => {
  try {
    if (state.activeRecipe === undefined) return;
    const savedState: ISavedGame = {
      ...state,
      cauldronIngredients: state.cauldronIngredients.map((ingredient) => ingredient.id),
    };
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(savedState));
  } catch {
    // storage is unavailable or full — the game keeps working without saving
  }
};

export const loadGame = (): IGameState | undefined => {
  try {
    const value = localStorage.getItem(GAME_STATE_KEY);
    if (value === null) return undefined;

    const data: unknown = JSON.parse(value);

    if (!isValidSave(data)) {
      clearSave();
      return undefined;
    }

    return toGameState(data);
  } catch {
    clearSave();
    return undefined;
  }
};

export const clearSave = (): void => {
  try {
    localStorage.removeItem(GAME_STATE_KEY);
  } catch {
    // storage is unavailable — nothing to clear
  }
};
