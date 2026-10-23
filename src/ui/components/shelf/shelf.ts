import { createElement, createSvgFromString } from '@/ui/dom';
import type { ICauldronValues, IIngredient } from '@/types';
import { PARAMETER_KEYS, PARAMETER_LABELS } from '@/data';
import { formatSigned } from '@/utils';

import './shelf.scss';
import './tooltip.scss';

const EMPTY_SHELF_COUNT = 6;
const TOOLTIP_GAP = 12;

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
    const info = createElement('span', {
      className: 'ingredient__info',
      children: [ingredientName],
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
        'aria-describedby': `tooltip-${ingredient.id}`,
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
        id: `tooltip-${ingredient.id}`,
      },
    });

    for (const key of PARAMETER_KEYS) {
      tooltip.append(this.createIngredientTooltip(key, PARAMETER_LABELS[key], ingredient[key]));
    }
    this.updateTooltipSide(ingredientElement, tooltip);

    ingredientElement.append(button, tooltip);

    const placeTooltip = (): void => this.updateTooltipSide(ingredientElement, tooltip);
    ingredientElement.addEventListener('mouseenter', placeTooltip);
    ingredientElement.addEventListener('focusin', placeTooltip);

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

  private updateTooltipSide(ingredient: HTMLLIElement, tooltip: HTMLSpanElement): void {
    const ingredientRect = ingredient.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    const canFitRight = window.innerWidth - ingredientRect.right >= tooltipRect.width + TOOLTIP_GAP;
    const canFitLeft = ingredientRect.left >= tooltipRect.width + TOOLTIP_GAP;
    const isStacked = !canFitRight && !canFitLeft;
    const isLeft = !canFitRight && canFitLeft;

    const spaceBelow =
      window.innerHeight - (isStacked ? ingredientRect.bottom : ingredientRect.top);
    const isUp = spaceBelow < tooltipRect.height + (isStacked ? TOOLTIP_GAP : 0);

    tooltip.classList.toggle('tooltip--left', isLeft);
    tooltip.classList.toggle('tooltip--stacked', isStacked);
    tooltip.classList.toggle('tooltip--up', isUp);
  }

  public setPaused(isPaused: boolean): void {
    this.shelf.classList.toggle('shelf--paused', isPaused);
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
