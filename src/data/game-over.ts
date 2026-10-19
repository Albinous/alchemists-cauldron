import type { GameOverReason } from '@/types';

export const GAME_OVER_REASON_LABELS: Record<GameOverReason, string> = {
  'time-up': "Time's up",
  'no-lives': 'No lives left',
  'out-of-ingredients': 'Out of ingredients',
};
