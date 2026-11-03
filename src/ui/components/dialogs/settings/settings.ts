import { checkSvg, closeSvg, settingsSvg, trophySvg } from '@/assets';
import { Modal } from '../modal';
import { createContainer, createElement, createSvgFromString } from '@/ui/dom';
import { type ThemeId, type Difficulty, type ISettingsHandlers } from '@/types';
import { DIFFICULTIES, difficultySettings, THEME_LABELS, THEME_NOTES, THEMES } from '@/data';

import './settings.scss';

const TITLE_TEXT = 'Settings';
const TITLE_ID = 'settings-title';
const CONTINUE = {
  label: 'Unfinished brew',
  text: 'Medium · 01:45 · 1250 pts',
  button: 'Continue Game',
};
const DIFFICULTY_LABEL = 'Difficulty';
const DIFFICULTY_ID = 'settings-difficulty-title';
const HINT_TEXT = 'Difficulty can be changed only before a game starts.';
const LEADERBOARD_TEXT = 'Leaderboard';
const NEW_GAME_TEXT = 'New Game';
const THEME_LABEL = 'Theme';
const THEME_PANEL_TEXT = 'Aa';
const THEME_ID = 'settings-theme-title';

export class Settings {
  private readonly modal: Modal;
  private readonly continueBlock = createContainer('settings__continue');
  private readonly continueSummary = createElement('span', {
    className: 'settings__continue-summary',
    text: CONTINUE.text,
  });
  private readonly levelButtons = new Map<Difficulty, HTMLButtonElement>();
  private readonly themeButtons = new Map<ThemeId, HTMLButtonElement>();

  constructor(handlers: ISettingsHandlers) {
    const closeIcon = createSvgFromString(closeSvg);
    const closeButton = createElement('button', {
      className: 'settings__close',
      attributes: {
        'aria-label': 'Close',
        type: 'button',
      },
      children: [closeIcon],
    });

    this.createContinue(handlers.onContinue);
    this.continueBlock.hidden = true;

    const difficulty = this.createDifficulty(handlers.onSelectDifficulty);
    const hint = createElement('p', {
      className: 'settings__hint',
      text: HINT_TEXT,
    });

    const themes = this.createThemes(handlers.onSelectTheme);

    const leaderboardIcon = createSvgFromString(trophySvg);
    const leaderboardButton = createElement('button', {
      className: 'settings__leaderboard',
      attributes: {
        type: 'button',
      },
    });
    leaderboardButton.append(leaderboardIcon, LEADERBOARD_TEXT);

    const newGameButton = createElement('button', {
      className: 'settings__new-game',
      text: NEW_GAME_TEXT,
      attributes: {
        type: 'button',
      },
    });

    this.modal = new Modal({
      className: 'settings',
      title: TITLE_TEXT,
      titleId: TITLE_ID,
      content: [this.continueBlock, difficulty, hint, themes, closeButton],
      actions: [leaderboardButton, newGameButton],
      icon: settingsSvg,
      onCancel: handlers.onClose,
    });

    closeButton.addEventListener('click', handlers.onClose);
    leaderboardButton.addEventListener('click', handlers.onLeaderboard);
    newGameButton.addEventListener('click', handlers.onNewGame);
  }

  private createContinue(onContinue: () => void): void {
    const continueLabel = createElement('span', {
      className: 'settings__continue-label',
      text: CONTINUE.label,
    });
    const continueInfo = createContainer('settings__continue-info', [
      continueLabel,
      this.continueSummary,
    ]);
    const continueButton = createElement('button', {
      className: 'settings__continue-button',
      text: CONTINUE.button,
      attributes: {
        type: 'button',
      },
    });
    continueButton.addEventListener('click', onContinue);

    this.continueBlock.append(continueInfo, continueButton);
  }

  private createDifficulty(onSelectDifficulty: (difficulty: Difficulty) => void): HTMLDivElement {
    const difficultyLabel = createElement('span', {
      className: 'settings__label',
      text: DIFFICULTY_LABEL,
      attributes: {
        id: DIFFICULTY_ID,
      },
    });

    const levelsButtons = DIFFICULTIES.map((levelName, index) => {
      const levelButton = this.createLevel(levelName, index, onSelectDifficulty);
      this.levelButtons.set(levelName, levelButton);
      return levelButton;
    });
    const levels = createElement('div', {
      className: 'settings__levels',
      attributes: {
        role: 'group',
        'aria-labelledby': DIFFICULTY_ID,
      },
      children: levelsButtons,
    });
    const difficulty = createContainer('settings__difficulty', [difficultyLabel, levels]);
    return difficulty;
  }

  private createLevel(
    name: Difficulty,
    difficultyIndex: number,
    onSelectDifficulty: (difficulty: Difficulty) => void,
  ): HTMLButtonElement {
    const levelName = createElement('span', {
      className: 'settings__level-name',
      text: name,
    });
    const checkIcon = createSvgFromString(checkSvg);
    const levelCheck = createElement('span', {
      className: 'settings__level-check',
      attributes: {
        'aria-hidden': 'true',
      },
      children: [checkIcon],
    });
    const levelHead = createElement('span', {
      className: 'settings__level-head',
      children: [levelName, levelCheck],
    });

    const pipsArray = Array.from({ length: DIFFICULTIES.length }, (_, pipIndex) =>
      createElement('span', {
        className:
          pipIndex < difficultyIndex + 1 ? 'settings__pip settings__pip--on' : 'settings__pip',
      }),
    );

    const pips = createElement('span', {
      className: 'settings__level-pips',
      attributes: {
        'aria-hidden': 'true',
      },
      children: pipsArray,
    });
    const stats = this.createStats(name);

    const button = createElement('button', {
      className: 'settings__level',
      attributes: {
        type: 'button',
        'aria-pressed': 'false',
      },
      children: [levelHead, pips, stats],
    });

    button.addEventListener('click', () => {
      onSelectDifficulty(name);
    });

    return button;
  }

  private createStats(difficulty: Difficulty): HTMLSpanElement {
    const settings = difficultySettings[difficulty];
    const stats = [
      { label: 'Shelf', value: String(settings.ingredientsOnShelf) },
      { label: 'Cauldron', value: String(settings.maxIngredients) },
      { label: 'Time', value: `${settings.startTimeSec} s` },
      { label: 'Tolerance', value: `±${settings.tolerance}` },
      { label: 'Lives', value: String(settings.lives) },
    ];

    const statsElemets = stats.map((stat) => this.createLevelStat(stat.label, stat.value));

    const levelStats = createElement('span', {
      className: 'settings__level-stats',
      children: statsElemets,
    });

    return levelStats;
  }

  private createLevelStat(label: string, value: string): HTMLElement {
    const statLabel = createElement('span', {
      className: 'settings__stat-label',
      text: label,
    });
    const statValue = createElement('span', {
      className: 'settings__stat-value',
      text: value,
    });
    const container = createElement('span', {
      className: 'settings__level-stat',
      children: [statLabel, statValue],
    });

    return container;
  }

  private createThemes(onSelectTheme: (theme: ThemeId) => void): HTMLDivElement {
    const title = createElement('span', {
      className: 'settings__label',
      text: THEME_LABEL,
      attributes: {
        id: THEME_ID,
      },
    });
    const themeButtons = THEMES.map((theme) => {
      const themeButton = this.createThemeButton(
        theme,
        THEME_LABELS[theme],
        THEME_NOTES[theme],
        onSelectTheme,
      );
      this.themeButtons.set(theme, themeButton);

      return themeButton;
    });

    const options = createElement('div', {
      className: 'settings__theme-options',
      attributes: {
        role: 'group',
        'aria-labelledby': THEME_ID,
      },
      children: themeButtons,
    });
    const container = createContainer('settings__themes', [title, options]);

    return container;
  }

  private createThemeButton(
    id: ThemeId,
    label: string,
    note: string,
    onSelectTheme: (theme: ThemeId) => void,
  ): HTMLButtonElement {
    const panel = createElement('span', {
      className: 'theme-option__panel',
      text: THEME_PANEL_TEXT,
    });

    const optionAccent = createElement('span', {
      className: 'theme-option__accent',
    });
    const optionLine = createElement('span', {
      className: 'theme-option__line',
    });
    const optionLineShort = createElement('span', {
      className: 'theme-option__line theme-option__line--short',
    });
    const lines = createElement('span', {
      className: 'theme-option__lines',
      children: [optionAccent, optionLine, optionLineShort],
    });

    const preview = createElement('span', {
      className: 'theme-option__preview',
      attributes: {
        'data-theme': id,
        'aria-hidden': 'true',
      },
      children: [panel, lines],
    });

    const name = createElement('span', {
      className: 'theme-option__name',
      text: label,
    });
    const checkIcon = createSvgFromString(checkSvg);
    const check = createElement('span', {
      className: 'theme-option__check',
      attributes: {
        'aria-hidden': 'true',
      },
      children: [checkIcon],
    });
    const head = createElement('span', {
      className: 'theme-option__head',
      children: [name, check],
    });

    const optionNote = createElement('span', {
      className: 'theme-option__note',
      text: note,
    });

    const button = createElement('button', {
      className: 'theme-option',
      attributes: {
        type: 'button',
        'aria-pressed': 'false',
        'data-theme-id': id,
      },
      children: [preview, head, optionNote],
    });

    button.addEventListener('click', () => {
      onSelectTheme(id);
    });

    return button;
  }

  public setSelected(difficulty: Difficulty): void {
    for (const [difficultyName, button] of this.levelButtons) {
      button.setAttribute('aria-pressed', String(difficultyName === difficulty));
    }
  }

  public setSelectedTheme(theme: ThemeId): void {
    for (const [themeName, button] of this.themeButtons) {
      button.setAttribute('aria-pressed', String(themeName === theme));
    }
  }

  public show(selected: Difficulty, theme: ThemeId, continueSummary?: string): void {
    this.setSelected(selected);
    this.setSelectedTheme(theme);
    this.modal.show();
    if (continueSummary === undefined) {
      this.continueBlock.hidden = true;
      return;
    }

    this.continueBlock.hidden = false;
    this.continueSummary.textContent = continueSummary;
  }

  public hide(): void {
    this.modal.hide();
  }

  public render(): HTMLElement {
    return this.modal.render();
  }
}
