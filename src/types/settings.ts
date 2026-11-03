import type { Difficulty } from './difficulty';

export interface ISettingsHandlers {
  onSelectDifficulty: (difficulty: Difficulty) => void;
  onContinue: () => void;
  onLeaderboard: () => void;
  onNewGame: () => void;
  onClose: () => void;
}

export type ThemeId = 'alchemy' | 'parchment' | 'pixel';
export type AudioChannel = 'master' | 'music' | 'sfx';

export interface ISettings {
  theme: ThemeId;
  volume: Record<AudioChannel, number>; // 0-1
  isMuted: boolean;
}
