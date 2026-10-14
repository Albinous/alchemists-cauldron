import { createElement, createLayout, Header } from '@/ui';

export class App {
  public render(): void {
    const header = new Header().render();
    const footer = createElement('footer');
    const layout = createLayout({ header, footer });

    document.body.prepend(layout);
  }
}
