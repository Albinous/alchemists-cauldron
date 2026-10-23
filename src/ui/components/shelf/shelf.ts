import { createElement, createSvgFromString } from '@/ui/dom';
import type { ICauldronValues, IIngredient } from '@/types';
import { PARAMETER_KEYS, PARAMETER_LABELS } from '@/data';
import { formatSigned } from '@/utils';

import './shelf.scss';
import './tooltip.scss';

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
    const ingredientLabels = createElement('span', {
      className: 'ingredient__labels',
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
    button.setAttribute('draggable', String(stock > 0));

    button.addEventListener('click', () => {
      this.onSelect(ingredient);
    });

    button.addEventListener('dragstart', (event) => {
      event.dataTransfer?.setData('text/plain', ingredient.id);
      if (event.dataTransfer) event.dataTransfer.effectAllowed = 'copy';
    });

    const ingredientElement = this.createListItem();

    const tooltip = createElement('span', {
      className: 'tooltip',
      attributes: {
        role: 'tooltip',
      },
    });

    for (const key of PARAMETER_KEYS) {
      tooltip.append(this.createIngredientTooltip(key, PARAMETER_LABELS[key], ingredient[key]));
      tooltip.setAttribute('id', `tooltip-${key}`);
      button.setAttribute('aria-describedby', `tooltip-${key}`);
    }

    ingredientElement.append(button, tooltip);

    return ingredientElement;
  }

  private createIngredientTooltip(
    type: keyof ICauldronValues,
    labelName: string,
    value: number,
  ): HTMLSpanElement {
    const tooltipLabel = createElement('span', {
      className: 'tooltip__label',
      text: labelName,
    });
    const tooltipValue = createElement('span', {
      className: 'tooltip__value',
      text: formatSigned(value),
    });
    const tooltip = createElement('span', {
      className: `tooltip__row tooltip__row--${type}`,
      children: [tooltipLabel, tooltipValue],
    });

    return tooltip;
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
