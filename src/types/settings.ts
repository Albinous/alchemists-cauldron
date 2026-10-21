import type { Difficulty } from './difficulty';

export interface ISettingsHandlers {
  onSelectDifficulty: (difficulty: Difficulty) => void;
  onContinue: () => void;
  onLeaderboard: () => void;
  onNewGame: () => void;
  onClose: () => void;
}
