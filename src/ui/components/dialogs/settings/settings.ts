import { checkSvg, closeSvg, settingsSvg, trophySvg } from '@/assets';
import { Modal } from '../modal';
import { createContainer, createElement, createSvgFromString } from '@/ui/dom';
import type { Difficulty, ISettingsHandlers } from '@/types';
import { DIFFICULTIES, difficultySettings } from '@/data';

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

export class Settings {
  private readonly modal: Modal;
  private readonly continueBlock = createContainer('settings__continue');
  private readonly continueSummary = createElement('span', {
    className: 'settings__continue-summary',
    text: CONTINUE.text,
  });
  private readonly levelButtons = new Map<Difficulty, HTMLButtonElement>();

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
      content: [this.continueBlock, difficulty, hint, closeButton],
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
      className: 'settings__stat__label',
      text: label,
    });
    const statValue = createElement('span', {
      className: 'settings__stat__value',
      text: value,
    });
    const container = createElement('span', {
      className: 'settings__level-stat',
      children: [statLabel, statValue],
    });

    return container;
  }

  public setSelected(difficulty: Difficulty): void {
    for (const [difficultyName, button] of this.levelButtons) {
      button.setAttribute('aria-pressed', String(difficultyName === difficulty));
    }
  }

  public show(selected: Difficulty, continueSummary?: string): void {
    this.setSelected(selected);
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
