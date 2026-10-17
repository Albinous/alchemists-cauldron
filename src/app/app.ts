import { addIngredient, canAddIngredient } from '@/logic/add-ingredient';
import { createInitialState, createNewGame } from '@/logic/game-state';
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
      createNewGame();
    }
  }

  private handleSelect(ingredient: IIngredient): void {
    if (!canAddIngredient(this.state, ingredient)) return;
    addIngredient(this.state, ingredient);
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
