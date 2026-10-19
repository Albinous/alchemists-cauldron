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
} from '@/logic';
import { createInitialState, createNewGame, getShelfIngredients } from '@/state';
import type { GameOverReason, IIngredient } from '@/types';
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
} from '@/ui';

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
    onHelp: () => {},
    onMain: () => this.handleMain(),
    onSecondary: () => {},
  });
  private readonly gameOver = new GameOver(() => this.handlePlayAgain());

  private state = createInitialState();
  private endTime = 0;
  private timerId: ReturnType<typeof setInterval> | undefined = undefined;

  private handleMain(): void {
    if (this.state.status === 'menu') {
      this.startNewGame();
    } else if (this.state.status === 'playing') {
      if (canBrew(this.state)) {
        applyBrew(this.state);
        this.endTime = getEndTime(this.state.timeLeft, Date.now());

        this.checkGameOver();
      }

      this.renderGame();
    }
  }

  private handleSelect(ingredient: IIngredient): void {
    if (!canAddIngredient(this.state, ingredient)) return;
    addIngredient(this.state, ingredient);

    this.renderGame();
  }

  private handleTick(): void {
    this.state.timeLeft = getTimeLeft(this.endTime, Date.now());

    this.header.setTimer(
      this.state.timeLeft,
      difficultySettings[this.state.difficulty].startTimeSec,
    );

    this.checkGameOver();
  }

  private handlePlayAgain(): void {
    this.gameOver.hide();
    this.startNewGame();
  }

  private startNewGame(): void {
    this.state = createNewGame();
    this.startTimer();
    this.renderGame();
  }

  private endGame(reason: GameOverReason): void {
    this.state.status = 'game-over';
    this.stopTimer();
    this.gameOver.show(reason, this.state.score);
    this.renderGame();
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
    this.header.setActive(isPlaying);

    this.header.setScore(this.state.score);
    this.header.setTimer(this.state.timeLeft, settings.startTimeSec);
    this.header.setLives(this.state.lives, settings.lives);

    this.controls.setPlaying(isPlaying);

    const isMainEnabled = status === 'menu' || canBrew(this.state);
    this.controls.setMainEnabled(isMainEnabled);

    const ingredients = getShelfIngredients(settings.ingredientsOnShelf);
    const cauldronIngredients = this.state.cauldronIngredients;

    this.shelf.renderIngredients(
      ingredients,
      shelfStock,
      isCauldronFull(this.state, settings.maxIngredients) || !isPlaying,
    );
    this.cauldron.renderIngredients(cauldronIngredients, settings.maxIngredients);
    this.recipe.showRecipe(this.state.activeRecipe);
    this.recipe.setIngredientCount(cauldronIngredients.length, settings.maxIngredients);

    const cauldronValues = calculateCauldron(this.state.cauldronIngredients);

    this.bars.update(cauldronValues, this.state.activeRecipe);
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
      gameOver: this.gameOver.render(),
    });

    document.body.prepend(layout);
  }
}
