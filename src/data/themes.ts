import type { AudioChannel, ISettings, ThemeId } from '@/types';

export const THEMES: ThemeId[] = ['alchemy', 'parchment', 'pixel'];
export const THEME_LABELS: Record<ThemeId, string> = {
  alchemy: 'Alchemy',
  parchment: 'Parchment',
  pixel: 'Pixel',
};

export const AUDIO_CHANNELS: readonly AudioChannel[] = ['master', 'music', 'sfx'];

export const DEFAULT_SETTINGS: ISettings = {
  theme: 'alchemy',
  volume: {
    master: 0.8,
    music: 0.4,
    sfx: 0.7,
  },
  isMuted: false,
};

export const THEME_NOTES: Record<ThemeId, string> = {
  alchemy: 'Dark workshop',
  parchment: 'Old recipe book',
  pixel: 'Arcade neon',
};
