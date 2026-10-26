import type { ShortcutAction } from '@/types';

export const SHORTCUTS: Partial<Record<string, ShortcutAction>> = {
  KeyB: 'brew',
  KeyO: 'pour-out',
  KeyP: 'pause',
  KeyH: 'help',
};

export const INGREDIENT_KEY_PATTERN = /^(?:Digit|Numpad)([1-9])$/;
