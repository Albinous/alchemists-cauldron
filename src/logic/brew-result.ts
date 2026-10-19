import { difficultySettings, MAX_TIME } from '@/data';
import type { BrewResult, ICauldronValues, IGameState } from '@/types';
import { getRandomRecipe } from './recipe-generator';
import { isBrewSuccessful } from './check-brew';

export const applyBrew = (state: IGameState, values: ICauldronValues): BrewResult => {
  const settings = difficultySettings[state.difficulty];
  state.cauldronIngredients = [];

  const isSuccess = isBrewSuccessful(values, state.activeRecipe, settings.tolerance);

  if (isSuccess) {
    state.score += settings.scorePerBrew;
    state.timeLeft = Math.min(state.timeLeft + settings.timeBonusSec, MAX_TIME);
    state.activeRecipe = getRandomRecipe(state.difficulty);
    return 'success';
  }

  state.lives -= 1;
  return 'fail';
};
