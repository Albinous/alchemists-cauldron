import { createContainer, createElement, createSvgFromString } from '@/ui/dom';
import sealSvg from '@/assets/seal.svg?raw';
import './recipe.scss';
import type { IRecipe, IRecipeRange } from '@/types';
import { formatNumber } from '@/utils';
import { PARAMETER_KEYS, PARAMETER_LABELS } from '@/data';

const SEALED_TITLE = 'Still sealed';
const RECIPE_LABEL = 'Recipe of the hour';
const HINT_TEXT = 'Break the seal by starting a game, and your first recipe will appear here.';
const COUNTER_LABEL = 'Ingredients';

export class Recipe {
  private readonly recipe = createElement('aside', {
    className: 'recipe',
  });
  private readonly title = createElement('h2', {
    className: 'recipe__title',
  });
  private readonly content = createContainer('recipe__content');
  private readonly ingredientsCount = createContainer('recipe__ingredients');

  constructor() {
    this.buildStructure();
    this.renderSealed();
  }

  private buildStructure(): void {
    const seal = createSvgFromString(sealSvg, 'recipe__seal');
    const label = createElement('span', {
      className: 'recipe__label',
      text: RECIPE_LABEL,
    });

    this.recipe.append(seal, label, this.title, this.content, this.ingredientsCount);
  }

  private createRanges(recipe: IRecipe): HTMLElement {
    const container = createElement('dl', {
      className: 'recipe__ranges',
    });
    for (const key of PARAMETER_KEYS) {
      container.append(this.createRange(PARAMETER_LABELS[key], recipe[key], key));
    }

    return container;
  }

  private createRange(label: string, range: IRecipeRange, modifier: string): HTMLDivElement {
    const rangeLabel = createElement('dt', {
      className: 'recipe__range-label',
      text: label,
    });
    const rangeValue = createElement('dd', {
      className: 'recipe__range-value',
      text: `${formatNumber(range.min)}–${formatNumber(range.max)}`,
    });
    const container = createContainer(`recipe__range recipe__range--${modifier}`, [
      rangeLabel,
      rangeValue,
    ]);

    return container;
  }

  private createCounterDot(isFilled: boolean): HTMLElement {
    return createElement('span', {
      className: isFilled ? `recipe__dot recipe__dot--filled` : 'recipe__dot',
    });
  }

  public showRecipe(recipe: IRecipe | undefined): void {
    if (recipe === undefined) {
      this.renderSealed();
      return;
    }
    this.title.textContent = recipe.name;
    const recipeRanges = this.createRanges(recipe);
    this.content.replaceChildren(recipeRanges);
    this.recipe.classList.remove('recipe--sealed');
  }

  public setIngredientCount(count: number, max: number): void {
    this.ingredientsCount.hidden = false;
    const counterLabel = createElement('span', {
      className: 'recipe__counter-label',
      text: COUNTER_LABEL,
    });
    const counterValue = createElement('span', {
      className: 'recipe__counter-value',
      text: `${count} / ${max}`,
    });

    const counter = createContainer('recipe__counter', [counterLabel, counterValue]);

    this.ingredientsCount.classList.toggle('recipe__ingredients--full', count === max);

    const counterDotsArray = Array.from({ length: max }, (_, index) =>
      this.createCounterDot(index < count),
    );
    const counterDots = createElement('div', {
      className: 'recipe__dots',
      attributes: {
        'aria-hidden': 'true',
      },
      children: counterDotsArray,
    });

    this.ingredientsCount.replaceChildren(counter, counterDots);
  }

  public renderSealed(): void {
    const hint = createElement('p', {
      className: 'recipe__hint',
      text: HINT_TEXT,
    });
    this.title.textContent = SEALED_TITLE;

    this.content.replaceChildren(hint);
    this.ingredientsCount.hidden = true;
    this.recipe.classList.add('recipe--sealed');
  }

  public render(): HTMLElement {
    return this.recipe;
  }
}
