import { difficultySettings } from '@/data';
import {
  addIngredient,
  applyBrew,
  calculateCauldron,
  canAddIngredient,
  canBrew,
  getEndTime,
  getGameOverReason,
  getTimeLeft,
  isCauldronFull,
  isValidName,
  addEntry,
  isTopScore,
} from '@/logic';
import { createInitialState, createNewGame, getShelfIngredients } from '@/state';
import {
  clearLeaderboard,
  clearSave,
  loadGame,
  loadLeaderboard,
  saveGame,
  saveLeaderboard,
} from '@/storage';
import type { Difficulty, GameOverReason, IIngredient, ILeaderboardEntry } from '@/types';
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
} from '@/ui';
import { formatTime } from '@/utils';

const TICK_INTERVAL_MS = 250;

export class App {
  private readonly header = new Header();
  private readonly shelf = new Shelf((ingredient) => {
    this.handleSelect(ingredient);
  });
  private readonly cauldron = new Cauldron();
  private readonly recipe = new Recipe();
  private readonly bars = new Bars();
  private readonly controls = new Controls({
    onHelp: () => this.handleHelpOpen(),
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
    onClose: () => this.handleCloseSettings(),
  });
  private endTime = 0;
  private timerId: ReturnType<typeof setInterval> | undefined = undefined;

  private handleMain(): void {
    if (this.state.status === 'menu') {
      this.startNewGame();
    } else if (this.state.status === 'playing') {
      if (canBrew(this.state)) {
        this.state.timeLeft = getTimeLeft(this.endTime, Date.now());

        applyBrew(this.state);
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
        this.settings.show(this.state.difficulty, continueSummary);
        return;
      }
      this.settings.show(this.state.difficulty);
    }
  }

  private handleSelect(ingredient: IIngredient): void {
    if (!canAddIngredient(this.state, ingredient)) return;
    addIngredient(this.state, ingredient);
    this.renderGame();
    saveGame(this.state);
  }

  private handleTick(): void {
    this.state.timeLeft = getTimeLeft(this.endTime, Date.now());

    this.header.setTimer(
      this.state.timeLeft,
      difficultySettings[this.state.difficulty].startTimeSec,
    );

    this.checkGameOver();
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
    this.renderGame();
  }

  private handleSelectDifficulty(difficulty: Difficulty): void {
    if (this.state.status !== 'menu') return;
    this.settings.setSelected(difficulty);
    this.state.difficulty = difficulty;
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
  }

  private handleResume(): void {
    if (this.state.status !== 'paused') return;

    this.state.status = 'playing';
    this.startTimer();
    this.pause.hide();
    this.renderGame();
    saveGame(this.state);
  }

  private handleExitMenu(): void {
    this.stopTimer();
    this.pause.hide();
    this.state = createInitialState(this.state.difficulty);
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

  private startNewGame(): void {
    this.state = createNewGame(this.state.difficulty);
    this.startTimer();
    this.renderGame();
    saveGame(this.state);
  }

  private endGame(reason: GameOverReason): void {
    this.state.status = 'game-over';
    this.stopTimer();
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
    this.header.setActive(isInGame);

    this.controls.setPlaying(isInGame);

    const isMainEnabled = status === 'menu' || canBrew(this.state);
    this.controls.setMainEnabled(isMainEnabled);

    const isSecondaryEnabled = status === 'menu' || status === 'playing';
    this.controls.setSecondaryEnabled(isSecondaryEnabled);

    const ingredients = getShelfIngredients(settings.ingredientsOnShelf);
    const cauldronIngredients = this.state.cauldronIngredients;

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
      this.shelf.renderIngredients(
        ingredients,
        shelfStock,
        isCauldronFull(this.state, settings.maxIngredients) || !isPlaying,
      );
      this.recipe.showRecipe(this.state.activeRecipe);
      this.recipe.setIngredientCount(cauldronIngredients.length, settings.maxIngredients);

      const cauldronValues = calculateCauldron(this.state.cauldronIngredients);

      this.bars.update(cauldronValues, this.state.activeRecipe);
    }
  }

  public start(): void {
    const layout = createLayout({
      header: this.header.render(),
      shelf: this.shelf.render(),
      cauldron: this.cauldron.render(),
      recipe: this.recipe.render(),
      bars: this.bars.render(),
      controls: this.controls.render(),
      footer: createElement('footer'),
    });

    document.body.prepend(layout);
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
  }
}
