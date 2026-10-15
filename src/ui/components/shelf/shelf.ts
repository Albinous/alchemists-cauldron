import { createElement } from '@/ui/dom';
import './shelf.scss';

const EMPTY_SHELF_COUNT = 6;

export class Shelf {
  private readonly shelf = createElement('section', {
    className: 'shelf',
    attributes: { 'aria-label': 'Ingredients shelf' },
  });
  private readonly shelfList = createElement('ul', {
    className: 'shelf__list',
  });

  constructor() {
    this.buildStructure();
    this.renderEmpty();
  }

  private buildStructure(): void {
    const title = createElement('h2', {
      className: 'shelf__title',
      text: 'Ingredients',
    });
    this.shelf.append(title, this.shelfList);
  }

  private renderEmpty(): void {
    const items = Array.from({ length: EMPTY_SHELF_COUNT }, () => this.createListItem());
    this.shelfList.replaceChildren(...items);
  }

  private createListItem(): HTMLLIElement {
    return createElement('li', {
      className: 'shelf__item',
    });
  }

  public render(): HTMLElement {
    return this.shelf;
  }
}
