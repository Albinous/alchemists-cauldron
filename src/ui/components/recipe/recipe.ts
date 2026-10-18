import { createContainer, createElement, createSvgFromString } from '@/ui/dom';
import sealSvg from '@/assets/seal.svg?raw';
import './recipe.scss';

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

    this.recipe.append(seal, label, this.title, this.content);
  }

  private renderSealed(): void {
    const hint = createElement('p', {
      className: 'recipe__hint',
      text: HINT_TEXT,
    });
    this.title.textContent = SEALED_TITLE;

    this.content.replaceChildren(hint);
    this.recipe.classList.add('recipe--sealed');
  }

  private createCounterDot(isFilled: boolean): HTMLElement {
    return createElement('span', {
      className: isFilled ? `recipe__dot recipe__dot--filled` : 'recipe__dot',
    });
  }

  public setIngredientCount(count: number, max: number): void {
    const counterLabel = createElement('span', {
      className: 'recipe__counter-label',
      text: COUNTER_LABEL,
    });
    const counterValue = createElement('span', {
      className: 'recipe__counter-value',
      text: `${count} / ${max}`,
    });

    const counter = createContainer('recipe__counter', [counterLabel, counterValue]);

    const counterDotsArray = Array.from({ length: max }, (_, index) =>
      this.createCounterDot(index < count),
    );
    const counterDots = createElement('div', {
      className: 'recipe__dots',
      attributes: {
        'aria-hidden': true,
      },
      children: counterDotsArray,
    });

    const container = createContainer('recipe__ingredients', [counter, counterDots]);

    this.content.replaceChildren(container);
  }

  public render(): HTMLElement {
    return this.recipe;
  }
}
