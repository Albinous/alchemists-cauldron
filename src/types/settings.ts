import type { Difficulty } from './difficulty';

export type ThemeId = 'alchemy' | 'parchment' | 'pixel';
export type AudioChannel = 'master' | 'music' | 'sfx';

export interface ISettings {
  theme: ThemeId;
  volume: Record<AudioChannel, number>; // 0-1
  isMuted: boolean;
}

export interface ISettingsHandlers {
  onSelectDifficulty: (difficulty: Difficulty) => void;
  onContinue: () => void;
  onLeaderboard: () => void;
  onSelectTheme: (theme: ThemeId) => void;
  onVolumeChange: (channel: AudioChannel, value: number) => void;
  onToggleMute: () => void;
  onNewGame: () => void;
  onClose: () => void;
}
