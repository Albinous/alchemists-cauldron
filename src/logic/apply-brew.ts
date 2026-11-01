import { difficultySettings } from '@/data';
import type { BrewResult, IGameState } from '@/types';
import { getRandomRecipe } from './recipe-generator';
import { isBrewSuccessful } from './check-brew';
import { calculateCauldronWithReactions } from './cauldron-values';
import { clearCauldron } from './cauldron';

export const applyBrew = (state: IGameState): BrewResult => {
  const settings = difficultySettings[state.difficulty];
  const cauldronValues = calculateCauldronWithReactions(
    state.cauldronIngredients,
    state.difficulty,
  );
  const isSuccess = isBrewSuccessful(cauldronValues, state.activeRecipe, settings.tolerance);

  clearCauldron(state);

  if (isSuccess) {
    state.score += settings.scorePerBrew;
    state.timeLeft = Math.min(state.timeLeft + settings.timeBonusSec, settings.startTimeSec);
    state.activeRecipe = getRandomRecipe(state.difficulty);
    return 'success';
  }

  state.lives -= 1;
  return 'fail';
};
