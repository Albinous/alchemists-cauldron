import type { ThemeId } from '@/types';

export const applyTheme = (theme: ThemeId): void => {
  document.documentElement.dataset.theme = theme;
};
