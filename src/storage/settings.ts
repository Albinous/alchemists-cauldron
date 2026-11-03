import { AUDIO_CHANNELS, DEFAULT_SETTINGS, THEMES } from '@/data';
import type { AudioChannel, ISettings, ThemeId } from '@/types';

const SETTINGS_KEY = 'alchemists-cauldron:settings';

const createDefaultSettings = (): ISettings => {
  return structuredClone(DEFAULT_SETTINGS);
};

const isThemeId = (value: unknown): value is ThemeId => {
  return typeof value === 'string' && (THEMES as readonly string[]).includes(value);
};

const isVolume = (value: unknown): value is number => {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1;
};

const readTheme = (value: unknown, fallback: ThemeId): ThemeId => {
  return isThemeId(value) ? value : fallback;
};

const readVolume = (value: unknown, fallback: number): number => {
  return isVolume(value) ? value : fallback;
};

const readVolumes = (
  value: unknown,
  fallback: Record<AudioChannel, number>,
): Record<AudioChannel, number> => {
  const volumes = { ...fallback };
  if (value === null || typeof value !== 'object') return volumes;

  const record = value as Partial<Record<AudioChannel, unknown>>;

  for (const channel of AUDIO_CHANNELS) {
    volumes[channel] = readVolume(record[channel], fallback[channel]);
  }

  return volumes;
};

const isMuted = (value: unknown, isMutedFallback: boolean): boolean => {
  return typeof value === 'boolean' ? value : isMutedFallback;
};

export const saveSettings = (settings: ISettings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // storage is unavailable or full — the game keeps working without saving
  }
};

export const loadSettings = (): ISettings => {
  try {
    const value = localStorage.getItem(SETTINGS_KEY);
    const defaults = createDefaultSettings();
    if (value === null) return defaults;
    const data: unknown = JSON.parse(value);

    if (data === null || typeof data !== 'object') {
      return defaults;
    }

    const saved = data as Partial<ISettings>;

    return {
      theme: readTheme(saved.theme, defaults.theme),
      volume: readVolumes(saved.volume, defaults.volume),
      isMuted: isMuted(saved.isMuted, defaults.isMuted),
    };
  } catch {
    return createDefaultSettings();
  }
};
