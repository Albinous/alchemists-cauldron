import { Cauldron, createElement, createLayout, Header, Recipe, Shelf } from '@/ui';

export class App {
  private readonly header = new Header();
  private readonly shelf = new Shelf();
  private readonly cauldron = new Cauldron();
  private readonly recipe = new Recipe();
  public start(): void {
    const layout = createLayout({
      header: this.header.render(),
      shelf: this.shelf.render(),
      cauldron: this.cauldron.render(),
      recipe: this.recipe.render(),
      footer: createElement('footer'),
    });

    document.body.prepend(layout);
  }
}
