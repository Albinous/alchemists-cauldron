import { Cauldron, createElement, createLayout, Header, Shelf } from '@/ui';

export class App {
  private readonly header = new Header();
  private readonly shelf = new Shelf();
  private readonly cauldron = new Cauldron();
  public start(): void {
    const layout = createLayout({
      header: this.header.render(),
      shelf: this.shelf.render(),
      cauldron: this.cauldron.render(),
      footer: createElement('footer'),
    });

    document.body.prepend(layout);
  }
}
