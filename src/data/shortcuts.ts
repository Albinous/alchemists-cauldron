import type { ShortcutAction } from '@/types';

export const SHORTCUTS: Partial<Record<string, ShortcutAction>> = {
  KeyB: 'brew',
  KeyO: 'pour-out',
  KeyP: 'pause',
  KeyH: 'help',
  KeyM: 'mute',
};

export const INGREDIENT_KEY_PATTERN = /^(?:Digit|Numpad)([1-9])$/;

export const SHORTCUT_HINTS = [
  { keys: ['1', '9'], action: 'Add an ingredient' },
  { keys: ['B'], action: 'Brew' },
  { keys: ['O'], action: 'Pour Out, −10 s' },
  { keys: ['P'], action: 'Pause' },
  { keys: ['H'], action: 'Help' },
  { keys: ['M'], action: 'Sound on / off' },
  { keys: ['Esc'], action: 'Resume from pause' },
];
