import { createElement, createSvgFromString } from '@/ui/dom';
import './shelf.scss';
import type { IIngredient } from '@/types';
import { formatNumber } from '@/utils';

const EMPTY_SHELF_COUNT = 6;

export class Shelf {
  private readonly shelf = createElement('section', {
    className: 'shelf',
  });
  private readonly shelfList = createElement('ul', {
    className: 'shelf__list',
  });
  private readonly onSelect: (ingredient: IIngredient) => void;

  constructor(onSelect: (ingredient: IIngredient) => void) {
    this.buildStructure();
    this.renderEmpty();

    this.onSelect = onSelect;
  }

  private buildStructure(): void {
    const title = createElement('h2', {
      className: 'shelf__title',
      text: 'Ingredients',
    });
    this.shelf.append(title, this.shelfList);
  }

  private createListItem(): HTMLLIElement {
    return createElement('li', {
      className: 'shelf__item',
    });
  }

  private createIngredient(
    ingredient: IIngredient,
    stock: number,
    isLocked: boolean,
  ): HTMLLIElement {
    const icon = createSvgFromString(ingredient.icon, 'ingredient__icon');
    icon.style.color = ingredient.color;

    const ingredientName = createElement('span', {
      className: 'ingredient__name',
      text: ingredient.name,
    });
    const temperature = this.createIngredientLabel(
      'temperature',
      `T${formatNumber(ingredient.temperature)}`,
    );
    const density = this.createIngredientLabel('density', `D${formatNumber(ingredient.density)}`);
    const magicPower = this.createIngredientLabel(
      'magic',
      `MP${formatNumber(ingredient.magicPower)}`,
    );
    const ingredientLabels = createElement('span', {
      className: 'ingredient__labels',
      children: [temperature, density, magicPower],
    });
    const info = createElement('span', {
      className: 'ingredient__info',
      children: [ingredientName, ingredientLabels],
    });

    const ingredientStock = createElement('span', {
      className: 'ingredient__stock',
      text: String(stock),
    });

    const button = createElement('button', {
      className: 'ingredient',
      attributes: {
        type: 'button',
        disabled: isLocked || stock === 0,
        'aria-label': `${ingredient.name}, ${stock} left`,
      },
      children: [icon, info, ingredientStock],
    });

    button.classList.toggle('ingredient--empty', stock === 0);

    button.addEventListener('click', () => {
      this.onSelect(ingredient);
    });

    const ingredientElement = this.createListItem();

    ingredientElement.append(button);

    return ingredientElement;
  }

  private createIngredientLabel(
    type: 'temperature' | 'density' | 'magic',
    labelName: string,
  ): HTMLSpanElement {
    return createElement('span', {
      className: `ingredient__label ingredient__label--${type}`,
      text: labelName,
    });
  }

  public renderIngredients(
    ingredients: readonly IIngredient[],
    stock: Readonly<Record<string, number>>,
    isLocked: boolean,
  ): void {
    const items = ingredients.map((ingredient) =>
      this.createIngredient(ingredient, stock[ingredient.id] ?? 0, isLocked),
    );

    this.shelfList.replaceChildren(...items);
  }

  public renderEmpty(): void {
    const items = Array.from({ length: EMPTY_SHELF_COUNT }, () => this.createListItem());
    this.shelfList.replaceChildren(...items);
  }

  public render(): HTMLElement {
    return this.shelf;
  }
}
