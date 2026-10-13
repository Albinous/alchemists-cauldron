import type { Difficulty, IDifficultySettings } from '@/types';

export const difficultySettings: Readonly<Record<Difficulty, IDifficultySettings>> = {
  easy: {
    ingredientsOnShelf: 4,
    maxIngredients: 4,
    startTimeSec: 180,
    tolerance: 12,
    lives: 5,
    scorePerBrew: 100,
    timeBonusSec: 15,
    reactionsCount: 0,
  },
  medium: {
    ingredientsOnShelf: 6,
    maxIngredients: 4,
    startTimeSec: 150,
    tolerance: 8,
    lives: 3,
    scorePerBrew: 200,
    timeBonusSec: 10,
    reactionsCount: 2,
  },
  hard: {
    ingredientsOnShelf: 8,
    maxIngredients: 5,
    startTimeSec: 150,
    tolerance: 5,
    lives: 3,
    scorePerBrew: 300,
    timeBonusSec: 5,
    reactionsCount: 3,
  },
};

export const DEFAULT_DIFFICULTY: Difficulty = 'medium';
