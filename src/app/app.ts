import { difficultySettings } from '@/data';
import {
  addIngredient,
  applyBrew,
  calculateCauldron,
  canAddIngredient,
  canBrew,
  isCauldronFull,
} from '@/logic';
import { createInitialState, createNewGame, getShelfIngredients } from '@/state';
import type { IIngredient } from '@/types';
import { Bars, createElement, Cauldron, createLayout, Header, Recipe, Shelf, Controls } from '@/ui';

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

  private state = createInitialState();

  private handleMain(): void {
    if (this.state.status === 'menu') {
      this.state = createNewGame();
      this.renderGame();
    } else if (this.state.status === 'playing') {
      if (canBrew(this.state)) {
        applyBrew(this.state);
      }

      this.renderGame();
    } else {
      createInitialState();
      this.bars.reset();
    }
  }

  private handleSelect(ingredient: IIngredient): void {
    if (!canAddIngredient(this.state, ingredient)) return;
    addIngredient(this.state, ingredient);

    this.renderGame();
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

    const isMainEnabled = this.state.status === 'menu' || canBrew(this.state);
    this.controls.setMainEnabled(isMainEnabled);

    const ingredients = getShelfIngredients(settings.ingredientsOnShelf);
    const cauldronIngredients = this.state.cauldronIngredients;

    this.shelf.renderIngredients(
      ingredients,
      shelfStock,
      isCauldronFull(this.state, settings.maxIngredients),
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
    });

    document.body.prepend(layout);
  }
}
