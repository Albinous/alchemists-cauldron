import type { ILayoutElements } from '@/types';
import { createContainer, createElement, createZone } from '../dom';
import './layout.scss';
import { Shelf } from '../components';

export const createLayout = ({
  header,
  cauldron,
  recipe,
  bars,
  controls,
  footer,
}: ILayoutElements): DocumentFragment => {
  const fragment = document.createDocumentFragment();

  const shelfZone = new Shelf().render();
  const cauldronZone = createZone('section', 'cauldron', 'Cauldron', cauldron);
  const recipeZone = createZone('section', 'recipes', 'Recipes', recipe);
  const barsZone = createZone('section', 'Bars', 'bars', bars);
  const controlsZone = createZone('section', 'controls', 'Game controls', controls);

  const mainBoard = createElement('div', {
    className: 'main__board',
    children: [shelfZone, cauldronZone, recipeZone],
  });

  const main = createElement('main', {
    className: 'main',
    children: [createContainer('container', [mainBoard, barsZone, controlsZone])],
  });

  fragment.append(header, main, footer);

  return fragment;
};
