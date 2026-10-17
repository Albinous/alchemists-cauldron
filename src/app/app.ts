import { MAX_CAULDRON_COUNT } from '@/data';
import { isCauldronFull } from '@/logic';
import { addIngredient, canAddIngredient } from '@/logic/add-ingredient';
import { createInitialState, createNewGame, getShelfIngredients } from '@/logic/game-state';
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
    } else {
      createInitialState();
    }
  }

  private handleSelect(ingredient: IIngredient): void {
    if (!canAddIngredient(this.state, ingredient)) return;
    addIngredient(this.state, ingredient);

    this.renderGame();
  }

  private renderGame(): void {
    const { shelfStock, status } = this.state;
    const isPlaying = status === 'playing';
    this.header.setActive(isPlaying);
    this.controls.setPlaying(isPlaying);

    const ingredients = getShelfIngredients();
    this.shelf.renderIngredients(ingredients, shelfStock, isCauldronFull(this.state));
    this.cauldron.renderIngredients(this.state.cauldronIngredients, MAX_CAULDRON_COUNT);
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
