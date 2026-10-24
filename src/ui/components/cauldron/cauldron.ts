import cauldronSvg from '@/assets/cauldron.svg?raw';
import { createContainer, createElement, createSvgFromString, playAnimation } from '@/ui/dom';

import './cauldron.scss';
import type { BrewResult, IIngredient } from '@/types';

const INTRO_TEXT =
  'Mix ingredients, match three target ranges and brew potions before time or lives run out.';

const EMPTY_SLOT_TEXT = '—';

export class Cauldron {
  private readonly cauldron = createElement('section', {
    className: 'cauldron',
    attributes: { 'aria-label': 'Cauldron' },
  });
  private readonly pot = createContainer('cauldron__pot');
  private readonly img = createSvgFromString(cauldronSvg, 'cauldron__image');
  private readonly potFloating = createContainer('cauldron__floating');
  private readonly content = createElement('div', { className: 'cauldron__content' });
  private isDropEnabled = false;

  constructor(onDropIngredient: (id: string) => void) {
    this.buildStructure(onDropIngredient);
    this.renderMain();
  }

  private buildStructure(onDropIngredient: (id: string) => void): void {
    this.pot.append(this.img, this.potFloating);
    this.cauldron.append(this.pot, this.content);

    this.cauldron.addEventListener('dragover', (event) => {
      if (!this.isDropEnabled) return;
      event.preventDefault();
      this.cauldron.classList.add('cauldron--drop-target');
    });

    this.cauldron.addEventListener('dragleave', (event) => {
      if (event.relatedTarget instanceof Node && this.cauldron.contains(event.relatedTarget))
        return;
      this.cauldron.classList.remove('cauldron--drop-target');
    });

    this.cauldron.addEventListener('drop', (event) => {
      event.preventDefault();
      this.cauldron.classList.remove('cauldron--drop-target');
      const id = event.dataTransfer?.getData('text/plain');
      if (id) onDropIngredient(id);
    });
  }

  private createSlot(ingredient: IIngredient | undefined, position: number): HTMLElement {
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

  private createFloatingIcon(ingredient: IIngredient, index: number): SVGSVGElement {
    const icon = createSvgFromString(ingredient.icon, 'cauldron__float-icon');
    icon.style.setProperty('--float-index', String(index));
    icon.style.color = ingredient.color;
    return icon;
  }

  public setDropEnabled(isEnabled: boolean): void {
    this.isDropEnabled = isEnabled;
  }

  public renderIngredients(ingredients: IIngredient[], max: number): void {
    this.cauldron.classList.add('cauldron--active');

    const slots = Array.from({ length: max }, (_, index) => {
      return this.createSlot(ingredients[index], index + 1);
    });

    const icons = ingredients.map((ingredient, index) =>
      this.createFloatingIcon(ingredient, index),
    );

    const ingredientsList = createElement('ol', {
      className: 'cauldron__list',
      children: slots,
    });

    this.content.replaceChildren(ingredientsList);
    this.potFloating.replaceChildren(...icons);
  }

  public renderMain(): void {
    const textIntro = createElement('p', {
      className: 'cauldron__intro',
      text: INTRO_TEXT,
    });

    this.content.replaceChildren(textIntro);
    this.cauldron.classList.remove('cauldron--active');
  }

  public playBrewResult(brewResult: BrewResult): void {
    playAnimation(this.pot, `cauldron__pot--${brewResult}`);
  }

  public render(): HTMLElement {
    return this.cauldron;
  }
}
