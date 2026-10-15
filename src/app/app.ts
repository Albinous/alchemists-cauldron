import { Bars, createElement, Cauldron, createLayout, Header, Recipe, Shelf, Controls } from '@/ui';

const handlers = {
  onHelp: () => {},
  onMain: () => {},
  onSecondary: () => {},
};

export class App {
  private readonly header = new Header();
  private readonly shelf = new Shelf();
  private readonly cauldron = new Cauldron();
  private readonly recipe = new Recipe();
  private readonly bars = new Bars();
  private readonly controls = new Controls(handlers);
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
