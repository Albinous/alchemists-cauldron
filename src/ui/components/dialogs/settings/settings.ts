import {
  checkSvg,
  closeSvg,
  effectsSvg,
  musicSvg,
  settingsSvg,
  trophySvg,
  volumeSvg,
} from '@/assets';
import { Modal } from '../modal';
import { createContainer, createElement, createSvgFromString } from '@/ui/dom';
import type { AudioChannel, Difficulty, ISettings, ISettingsHandlers, ThemeId } from '@/types';
import {
  AUDIO_CHANNEL_LABELS,
  AUDIO_CHANNELS,
  DIFFICULTIES,
  difficultySettings,
  THEME_LABELS,
  THEME_NOTES,
  THEMES,
} from '@/data';

import './settings.scss';

const TITLE = {
  text: 'Settings',
  id: 'settings-title',
};

const CONTINUE = {
  label: 'Unfinished brew',
  text: 'Medium · 01:45 · 1250 pts',
  button: 'Continue Game',
};

const DIFFICULTY = {
  label: 'Difficulty',
  id: 'settings-difficulty-title',
  hint: 'Difficulty can be changed only before a game starts.',
};

const THEME = {
  label: 'Theme',
  id: 'settings-theme-title',
  preview: 'Aa',
};

const SOUND = {
  label: 'Sound',
  id: 'settings-sound-title',
  state: {
    on: 'Sound on',
    muted: 'Muted',
  },
  key: 'M',
  hintStart: 'Press ',
  hintEnd: ' during a game to mute or unmute.',
};

const ACTIONS = {
  leaderboard: 'Leaderboard',
  newGame: 'New Game',
};

const PERCENT = 100;
const VOLUME_STEP = 5;

const VOLUME_ICONS: Record<AudioChannel, string> = {
  master: volumeSvg,
  music: musicSvg,
  sfx: effectsSvg,
};

export class Settings {
  private readonly modal: Modal;
  private readonly continueBlock = createContainer('settings__continue');
  private readonly continueSummary = createElement('span', {
    className: 'settings__continue-summary',
    text: CONTINUE.text,
  });
  private readonly levelButtons = new Map<Difficulty, HTMLButtonElement>();
  private readonly themeButtons = new Map<ThemeId, HTMLButtonElement>();

  private readonly soundBlock = createContainer('settings__sound');
  private readonly muteText = createElement('span', { className: 'settings__mute-text' });
  private readonly muteButton = createElement('button', {
    className: 'settings__mute',
    attributes: {
      type: 'button',
      role: 'switch',
      'aria-checked': 'true',
    },
  });
  private readonly volumeInputs = new Map<AudioChannel, HTMLInputElement>();
  private readonly volumeValues = new Map<AudioChannel, HTMLSpanElement>();

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
      text: DIFFICULTY.hint,
    });

    const themes = this.createThemes(handlers.onSelectTheme);
    const sound = this.createSound(handlers.onVolumeChange, handlers.onToggleMute);

    const leaderboardIcon = createSvgFromString(trophySvg);
    const leaderboardButton = createElement('button', {
      className: 'settings__leaderboard',
      attributes: {
        type: 'button',
      },
    });
    leaderboardButton.append(leaderboardIcon, ACTIONS.leaderboard);

    const newGameButton = createElement('button', {
      className: 'settings__new-game',
      text: ACTIONS.newGame,
      attributes: {
        type: 'button',
      },
    });

    this.modal = new Modal({
      className: 'settings',
      title: TITLE.text,
      titleId: TITLE.id,
      content: [this.continueBlock, difficulty, hint, themes, sound, closeButton],
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
      text: DIFFICULTY.label,
      attributes: {
        id: DIFFICULTY.id,
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
        'aria-labelledby': DIFFICULTY.id,
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

    const statsElements = stats.map((stat) => this.createLevelStat(stat.label, stat.value));

    const levelStats = createElement('span', {
      className: 'settings__level-stats',
      children: statsElements,
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
      text: THEME.label,
      attributes: {
        id: THEME.id,
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
        'aria-labelledby': THEME.id,
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
      text: THEME.preview,
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

  private createSound(
    onVolumeChange: (channel: AudioChannel, value: number) => void,
    onToggleMute: () => void,
  ): HTMLDivElement {
    const title = createElement('span', {
      className: 'settings__label',
      text: SOUND.label,
      attributes: {
        id: SOUND.id,
      },
    });

    const knob = createElement('span', { className: 'settings__mute-knob' });
    const track = createElement('span', {
      className: 'settings__mute-track',
      attributes: {
        'aria-hidden': 'true',
      },
      children: [knob],
    });
    this.muteButton.append(this.muteText, track);
    this.muteButton.addEventListener('click', onToggleMute);

    const head = createContainer('settings__sound-head', [title, this.muteButton]);

    const volumeRows = AUDIO_CHANNELS.map((channel) => this.createVolume(channel, onVolumeChange));
    const volumes = createElement('div', {
      className: 'settings__volumes',
      attributes: {
        role: 'group',
        'aria-labelledby': SOUND.id,
      },
      children: volumeRows,
    });
    const muteKey = createElement('kbd', { className: 'key', text: SOUND.key });
    const soundHint = createElement('p', { className: 'settings__hint' });
    soundHint.append(SOUND.hintStart, muteKey, SOUND.hintEnd);

    this.soundBlock.append(head, volumes, soundHint);
    return this.soundBlock;
  }

  private createVolume(
    channel: AudioChannel,
    onVolumeChange: (channel: AudioChannel, value: number) => void,
  ): HTMLDivElement {
    const inputId = `volume-${channel}`;

    const icon = createElement('span', {
      className: 'settings__volume-icon',
      attributes: {
        'aria-hidden': 'true',
      },
      children: [createSvgFromString(VOLUME_ICONS[channel])],
    });
    const label = createElement('label', {
      className: 'settings__volume-label',
      text: AUDIO_CHANNEL_LABELS[channel],
      attributes: {
        for: inputId,
      },
    });
    const input = createElement('input', {
      className: 'settings__volume-range',
      attributes: {
        type: 'range',
        id: inputId,
        min: '0',
        max: String(PERCENT),
        step: String(VOLUME_STEP),
      },
    });
    const value = createElement('span', { className: 'settings__volume-value' });

    this.volumeInputs.set(channel, input);
    this.volumeValues.set(channel, value);

    input.addEventListener('input', () => {
      const volume = Number(input.value) / PERCENT;
      this.updateVolumeLabel(channel, volume);
      onVolumeChange(channel, volume);
    });

    return createContainer('settings__volume', [icon, label, input, value]);
  }

  private updateVolumeLabel(channel: AudioChannel, volume: number): void {
    const percent = Math.round(volume * PERCENT);
    const value = this.volumeValues.get(channel);
    const input = this.volumeInputs.get(channel);
    if (!value || !input) return;

    value.textContent = `${percent}%`;

    input.style.setProperty('--fill', `${percent}%`);
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

  public setSound(settings: ISettings): void {
    for (const channel of AUDIO_CHANNELS) {
      const input = this.volumeInputs.get(channel);
      if (input) input.value = String(Math.round(settings.volume[channel] * PERCENT));
      this.updateVolumeLabel(channel, settings.volume[channel]);
    }

    this.muteButton.setAttribute('aria-checked', String(!settings.isMuted));
    this.muteText.textContent = settings.isMuted ? SOUND.state.muted : SOUND.state.on;
    this.soundBlock.classList.toggle('settings__sound--muted', settings.isMuted);
  }

  public show(difficulty: Difficulty, settings: ISettings, continueSummary?: string): void {
    this.setSelected(difficulty);
    this.setSelectedTheme(settings.theme);
    this.setSound(settings);
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
