import cauldronSvg from '@/assets/cauldron.svg?raw';
import { createContainer, createElement, createSvgFromString } from '@/ui/dom';

import './cauldron.scss';
import type { IIngredient } from '@/types';

const INTRO_TEXT =
  'Mix ingredients, match three target ranges and brew potions before time or lives run out.';

const EMPTY_SLOT_TEXT = '—';

export class Cauldron {
  private readonly cauldron = createElement('section', {
    className: 'cauldron',
    attributes: { 'aria-label': 'Cauldron' },
  });
  private readonly img = createSvgFromString(cauldronSvg, 'cauldron__image');
  private readonly potFloating = createContainer('cauldron__floating');
  private readonly content = createElement('div', { className: 'cauldron__content' });

  constructor(onDropIngredient: (id: string) => void) {
    this.buildStructure(onDropIngredient);
    this.renderMain();
  }

  private buildStructure(onDropIngredient: (id: string) => void): void {
    const pot = createContainer('cauldron__pot', [this.img, this.potFloating]);
    this.cauldron.append(pot, this.content);

    this.cauldron.addEventListener('dragover', (event) => {
      event.preventDefault();
      this.cauldron.classList.add('cauldron--drop-target');
    });

    this.cauldron.addEventListener('dragleave', () => {
      this.cauldron.classList.remove('cauldron--drop-target');
    });

    this.cauldron.addEventListener('drop', (event) => {
      event.preventDefault();
      this.cauldron.classList.remove('cauldron--drop-target');
      const id = event.dataTransfer?.getData('text/plain');
      if (id) onDropIngredient(id);
    });
  }

  private createSlot(ingredient: IIngredient, position: number): HTMLElement {
    const isEmpty = ingredient === undefined;
    const slotNumber = createElement('span', {
      className: 'cauldron__slot-number',
      text: String(position),
    });
    const slotName = createElement('span', {
      className: 'cauldron__slot-name',
      text: isEmpty ? EMPTY_SLOT_TEXT : ingredient.name,
    });
    const cauldronSlot = createElement('li', {
      className: isEmpty ? `cauldron__slot cauldron__slot--empty` : 'cauldron__slot',
      children: [slotNumber, slotName],
    });

    return cauldronSlot;
  }

  public renderIngredients(ingredient: IIngredient[], max: number): void {
    this.cauldron.classList.add('cauldron--active');

    const slots = Array.from({ length: max }, (_, index) => {
      return this.createSlot(ingredient[index] ?? undefined, index + 1);
    });

    const ingredientsList = createElement('ol', {
      className: 'cauldron__list',
      children: slots,
    });

    this.content.replaceChildren(ingredientsList);
  }

  public renderMain(): void {
    const textIntro = createElement('p', {
      className: 'cauldron__intro',
      text: INTRO_TEXT,
    });

    this.content.replaceChildren(textIntro);
    this.cauldron.classList.remove('cauldron--active');
  }

  public render(): HTMLElement {
    return this.cauldron;
  }
}
