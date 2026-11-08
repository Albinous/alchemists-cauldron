import { audio, music, playSound } from '@/audio';
import {
  DANGER_TIME,
  difficultySettings,
  INGREDIENT_KEY_PATTERN,
  ingredients,
  POUR_OUT_PENALTY_SEC,
  SHORTCUTS,
} from '@/data';
import {
  addIngredient,
  applyBrew,
  canAddIngredient,
  getEndTime,
  getGameOverReason,
  getTimeLeft,
  isCauldronFull,
  isValidName,
  addEntry,
  isTopScore,
  calculateCauldronWithReactions,
  getFiredReactions,
  applyReactionEffects,
  canBrew,
  canPourOut,
  clearCauldron,
  applyTimePenalty,
} from '@/logic';
import { createInitialState, createNewGame, getShelfIngredients } from '@/state';
import {
  clearLeaderboard,
  clearSave,
  loadGame,
  loadLeaderboard,
  loadSettings,
  saveGame,
  saveLeaderboard,
  saveSettings,
} from '@/storage';
import type {
  AudioChannel,
  Difficulty,
  GameOverReason,
  IIngredient,
  ILeaderboardEntry,
  ShortcutAction,
  ThemeId,
} from '@/types';
import {
  Bars,
  createElement,
  Cauldron,
  createLayout,
  Header,
  Recipe,
  Shelf,
  Controls,
  GameOver,
  Pause,
  Leaderboard,
  Confirm,
  Help,
  Settings,
  playAnimation,
  createContainer,
  isTypingTarget,
  applyTheme,
} from '@/ui';
import { formatTime } from '@/utils';

const TICK_INTERVAL_MS = 250;

const unlockAudio = (): void => {
  audio.unlock();
};

export class App {
  private readonly header = new Header();
  private readonly shelf = new Shelf((ingredient) => {
    this.handleSelect(ingredient);
  });
  private readonly cauldron = new Cauldron((id) => this.handleDrop(id));
  private readonly recipe = new Recipe();
  private readonly bars = new Bars();
  private readonly controls = new Controls({
    onHelp: () => this.handleHelpOpen(),
    onPourOut: () => this.handlePourOut(),
    onMain: () => this.handleMain(),
    onSecondary: () => this.handleSecondary(),
  });
  private readonly gameOver = new GameOver(
    (name: string) => this.handleSubmitForm(name),
    () => this.handlePlayAgain(),
    () => this.handleLeaderboard(),
  );
  private readonly pause = new Pause(
    () => this.handleResume(),
    () => this.handleExitMenu(),
  );
  private readonly leaderboard = new Leaderboard(
    () => this.handleClearLeaderboard(),
    () => this.handleBackLeaderboard(),
  );
  private readonly clearConfirm = new Confirm(
    () => this.handleCancelClear(),
    () => this.handleClear(),
  );
  private readonly help = new Help(() => this.handleHelpClose());

  private state = createInitialState();
  private readonly settings = new Settings({
    onSelectDifficulty: (difficulty) => {
      this.handleSelectDifficulty(difficulty);
    },
    onContinue: () => this.handleContinue(),
    onNewGame: () => this.handleNewGame(),
    onLeaderboard: () => this.handleLeaderboard(),
    onSelectTheme: (theme) => this.handleSelectTheme(theme),
    onVolumeChange: (channel, value) => this.handleVolumeChange(channel, value),
    onToggleMute: () => this.handleToggleMute(),
    onClose: () => this.handleCloseSettings(),
  });
  private userSettings = loadSettings();

  private readonly layout = createContainer('game', [
    createLayout({
      header: this.header.render(),
      shelf: this.shelf.render(),
      cauldron: this.cauldron.render(),
      recipe: this.recipe.render(),
      bars: this.bars.render(),
      controls: this.controls.render(),
      footer: createElement('footer'),
    }),
  ]);
  private endTime = 0;
  private timerId: ReturnType<typeof setInterval> | undefined = undefined;
  private lastTickSecond: number | undefined;

  private handleMain(): void {
    if (this.state.status === 'menu') {
      this.startNewGame();
    } else if (this.state.status === 'playing') {
      if (canBrew(this.state)) {
        this.state.timeLeft = getTimeLeft(this.endTime, Date.now());

        const result = applyBrew(this.state);
        this.cauldron.playBrewResult(result);
        playSound(result);
        if (result === 'fail') playAnimation(this.layout, 'layout--shake');

        this.endTime = getEndTime(this.state.timeLeft, Date.now());
        saveGame(this.state);

        this.checkGameOver();
      }

      this.renderGame();
    }
  }

  private handleHelpOpen(): void {
    if (this.state.status === 'playing') {
      this.handlePause();
    }
    this.help.show();
  }

  private handleSecondary(): void {
    if (this.state.status === 'playing') {
      this.handlePause();
    } else {
      const saved = loadGame();
      if (saved) {
        const continueSummary = `${saved.difficulty} · ${formatTime(saved.timeLeft)} · ${saved.score} pts`;
        this.settings.show(this.state.difficulty, this.userSettings, continueSummary);
        return;
      }
      this.settings.show(this.state.difficulty, this.userSettings);
    }
  }

  private handleSelect(ingredient: IIngredient): void {
    if (!canAddIngredient(this.state, ingredient)) return;
    const previousCauldronIngredients = [...this.state.cauldronIngredients];
    addIngredient(this.state, ingredient);
    playSound('add');
    const firedReactions = getFiredReactions(
      previousCauldronIngredients,
      this.state.cauldronIngredients,
      this.state.difficulty,
    );

    if (firedReactions.length > 0) {
      this.state.timeLeft = getTimeLeft(this.endTime, Date.now());
      for (const reaction of firedReactions) {
        applyReactionEffects(this.state, reaction);
      }
      playSound('reaction');
      this.endTime = getEndTime(this.state.timeLeft, Date.now());
    }

    saveGame(this.state);
    this.checkGameOver();
    this.renderGame();
  }

  private handleDrop(id: string): void {
    const ingredient = ingredients.find((item) => item.id === id);
    if (!ingredient) return;
    this.handleSelect(ingredient);
  }

  private handleTick(): void {
    this.state.timeLeft = getTimeLeft(this.endTime, Date.now());
    const wholeSec = Math.ceil(this.state.timeLeft);

    this.header.setTimer(
      this.state.timeLeft,
      difficultySettings[this.state.difficulty].startTimeSec,
    );

    if (wholeSec > 0 && wholeSec <= DANGER_TIME && wholeSec !== this.lastTickSecond) {
      playSound('tick');
      this.lastTickSecond = wholeSec;
    }
    music.setFast(wholeSec <= DANGER_TIME);

    this.checkGameOver();
  }

  private handlePourOut(): void {
    if (!canPourOut(this.state)) return;
    this.state.timeLeft = getTimeLeft(this.endTime, Date.now());
    clearCauldron(this.state);
    applyTimePenalty(this.state, POUR_OUT_PENALTY_SEC);
    playSound('pour-out');
    this.endTime = getEndTime(this.state.timeLeft, Date.now());
    saveGame(this.state);
    this.checkGameOver();
    this.renderGame();
  }

  private handleHelpClose(): void {
    this.help.hide();
  }

  private handleContinue(): void {
    const saved = loadGame();
    if (saved === undefined) return;
    this.state = saved;
    this.state.status = 'paused';
    this.settings.hide();
    this.pause.show();
    this.lastTickSecond = undefined;
    this.renderGame();
  }

  private handleSelectDifficulty(difficulty: Difficulty): void {
    if (this.state.status !== 'menu') return;
    this.settings.setSelected(difficulty);
    this.state.difficulty = difficulty;
  }

  private handleSelectTheme(theme: ThemeId): void {
    if (this.userSettings.theme === theme) return;

    this.userSettings = { ...this.userSettings, theme };
    applyTheme(theme);
    saveSettings(this.userSettings);
    this.settings.setSelectedTheme(theme);
  }

  private handleVolumeChange(channel: AudioChannel, value: number): void {
    this.userSettings = {
      ...this.userSettings,
      volume: { ...this.userSettings.volume, [channel]: value },
    };
    audio.setVolume(channel, value);
    saveSettings(this.userSettings);
  }

  private handleToggleMute(): void {
    const isMuted = !this.userSettings.isMuted;
    this.userSettings = { ...this.userSettings, isMuted };
    audio.setMuted(isMuted);
    this.settings.setSound(this.userSettings);
  }

  private handleCloseSettings(): void {
    this.settings.hide();
  }

  private handleNewGame(): void {
    this.startNewGame();
    this.settings.hide();
  }

  private handlePlayAgain(): void {
    this.gameOver.hide();
    this.startNewGame();
  }

  private handleSubmitForm(name: string): void {
    const trimmedName = name.trim();
    if (!isValidName(trimmedName)) {
      this.gameOver.showNameError();
      return;
    }
    const entry: ILeaderboardEntry = {
      name: trimmedName,
      score: this.state.score,
      date: Date.now(),
      difficulty: this.state.difficulty,
    };
    const entries = addEntry(loadLeaderboard(this.state.difficulty), entry);
    saveLeaderboard(entries, this.state.difficulty);
    this.gameOver.hideForm();
    this.leaderboard.show(entries, entries.indexOf(entry));
  }

  private handleLeaderboard(): void {
    this.leaderboard.show(loadLeaderboard(this.state.difficulty));
  }

  private handlePause(): void {
    if (this.state.status !== 'playing') return;
    this.state.timeLeft = getTimeLeft(this.endTime, Date.now());
    this.state.status = 'paused';
    this.stopTimer();
    this.pause.show();
    this.renderGame();
    saveGame(this.state);
    audio.suspend();
  }

  private handleResume(): void {
    if (this.state.status !== 'paused') return;

    this.state.status = 'playing';
    this.startTimer();
    this.pause.hide();
    this.renderGame();
    saveGame(this.state);
    audio.resume();
    void music.start();
  }

  private handleExitMenu(): void {
    this.stopTimer();
    this.pause.hide();
    this.state = createInitialState(this.state.difficulty);
    music.stop();
    this.renderGame();
    clearSave();
  }

  private handleClearLeaderboard(): void {
    this.clearConfirm.show();
  }
  private handleBackLeaderboard(): void {
    this.leaderboard.hide();
  }

  private handleCancelClear(): void {
    this.clearConfirm.hide();
  }

  private handleClear(): void {
    clearLeaderboard(this.state.difficulty);
    this.clearConfirm.hide();
    this.leaderboard.show([]);
  }

  private handleKeydown(event: KeyboardEvent): void {
    if (
      isTypingTarget(event.target) ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey ||
      event.repeat
    )
      return;

    const action = SHORTCUTS[event.code];

    if (action === 'mute') {
      event.preventDefault();
      this.handleToggleMute();
      return;
    }

    if (this.state.status !== 'playing') return;

    if (this.handleIngredientKey(event.code)) {
      event.preventDefault();
      return;
    }

    if (action === undefined) return;

    event.preventDefault();
    this.runShortcut(action);
  }

  private handleIngredientKey(code: string): boolean {
    const match = INGREDIENT_KEY_PATTERN.exec(code);
    if (match === null) return false;

    const position = Number(match[1]);
    const shelfIngredients = getShelfIngredients(
      difficultySettings[this.state.difficulty].ingredientsOnShelf,
    );
    const ingredient = shelfIngredients.at(position - 1);
    if (ingredient === undefined) return false;

    this.handleSelect(ingredient);
    return true;
  }

  private runShortcut(action: ShortcutAction): void {
    switch (action) {
      case 'brew': {
        this.handleMain();
        break;
      }
      case 'pour-out': {
        this.handlePourOut();
        break;
      }
      case 'pause': {
        this.handlePause();
        break;
      }
      case 'help': {
        this.handleHelpOpen();
        break;
      }
    }
  }

  private startNewGame(): void {
    this.state = createNewGame(this.state.difficulty);
    this.startTimer();
    this.lastTickSecond = undefined;
    this.renderGame();
    saveGame(this.state);
    audio.resume();
    music.stop();
    void music.start();
  }

  private endGame(reason: GameOverReason): void {
    this.state.status = 'game-over';
    this.stopTimer();
    music.stop();

    playSound('game-over');

    this.gameOver.show(
      reason,
      this.state.score,
      isTopScore(loadLeaderboard(this.state.difficulty), this.state.score),
    );
    this.renderGame();
    clearSave();
  }

  private checkGameOver(): void {
    const gameOverReason = getGameOverReason(this.state);
    if (gameOverReason === undefined) return;
    this.endGame(gameOverReason);
  }

  private startTimer(): void {
    if (this.timerId !== undefined) return;
    this.endTime = getEndTime(this.state.timeLeft, Date.now());

    this.timerId = setInterval(() => this.handleTick(), TICK_INTERVAL_MS);
  }

  private stopTimer(): void {
    clearInterval(this.timerId);
    this.timerId = undefined;
  }

  private renderGame(): void {
    const settings = difficultySettings[this.state.difficulty];
    const { shelfStock, status } = this.state;
    const isPlaying = status === 'playing';
    const isInGame = status !== 'menu';
    const isFull = isCauldronFull(this.state, settings.maxIngredients);
    this.header.setActive(isInGame);

    this.controls.setPlaying(isInGame);

    const isMainEnabled = status === 'menu' || canBrew(this.state);
    this.controls.setMainEnabled(isMainEnabled);

    this.controls.setPourOutEnabled(canPourOut(this.state));

    const isSecondaryEnabled = status === 'menu' || status === 'playing';
    this.controls.setSecondaryEnabled(isSecondaryEnabled);

    const ingredients = getShelfIngredients(settings.ingredientsOnShelf);
    const cauldronIngredients = this.state.cauldronIngredients;

    this.shelf.setPaused(status === 'paused');
    this.cauldron.setDropEnabled(isPlaying && !isFull);

    this.cauldron.renderIngredients(cauldronIngredients, settings.maxIngredients);

    if (status === 'menu') {
      this.header.renderIdle();
      this.shelf.renderEmpty();
      this.cauldron.renderMain();
      this.recipe.renderSealed();
      this.bars.reset();
    } else {
      this.header.setScore(this.state.score);
      this.header.setTimer(this.state.timeLeft, settings.startTimeSec);
      this.header.setLives(this.state.lives, settings.lives);
      this.shelf.renderIngredients(ingredients, shelfStock, isFull || !isPlaying);
      this.recipe.showRecipe(this.state.activeRecipe);
      this.recipe.setIngredientCount(cauldronIngredients.length, settings.maxIngredients);

      const cauldronValues = calculateCauldronWithReactions(
        this.state.cauldronIngredients,
        this.state.difficulty,
      );

      this.bars.update(cauldronValues, this.state.activeRecipe);
    }
  }

  public start(): void {
    document.body.prepend(this.layout);
    document.body.append(
      this.gameOver.render(),
      this.pause.render(),
      this.leaderboard.render(),
      this.clearConfirm.render(),
      this.help.render(),
      this.settings.render(),
    );

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.handlePause();
      }
    });
    document.addEventListener('keydown', (event) => {
      this.handleKeydown(event);
    });

    document.addEventListener('pointerdown', unlockAudio, { once: true });
    document.addEventListener('keydown', unlockAudio, { once: true });
  }
}
