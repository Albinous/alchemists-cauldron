import cauldronSvg from '@/assets/cauldron.svg?raw';
import { createContainer, createElement, createSvgFromString } from '@/ui/dom';

import './cauldron.scss';

const INTRO_TEXT =
  'Mix ingredients, match three target ranges and brew potions before time or lives run out.';

export class Cauldron {
  private readonly cauldron = createElement('section', {
    className: 'cauldron',
    attributes: { 'aria-label': 'Cauldron' },
  });
  private readonly img = createSvgFromString(cauldronSvg, 'cauldron__image');
  private readonly potFloating = createContainer('cauldron__floating');
  private readonly content = createElement('div', { className: 'cauldron__content' });

  constructor() {
    this.buildSection();
    this.renderIdle();
  }

  private buildSection(): void {
    const pot = createContainer('cauldron__pot', [this.img, this.potFloating]);
    this.cauldron.append(pot, this.content);
  }

  private renderIdle(): void {
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
