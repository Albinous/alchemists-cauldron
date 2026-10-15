import type { ILayoutElements } from '@/types';
import { createContainer, createElement, createZone } from '../dom';
import './layout.scss';

export const createLayout = ({
  header,
  shelf,
  cauldron,
  recipe,
  bars,
  controls,
  footer,
}: ILayoutElements): DocumentFragment => {
  const fragment = document.createDocumentFragment();

  const recipeZone = createZone('section', 'recipes', 'Recipes', recipe);
  const barsZone = createZone('section', 'Bars', 'bars', bars);
  const controlsZone = createZone('section', 'controls', 'Game controls', controls);

  const mainBoard = createElement('div', {
    className: 'main__board',
    children: [shelf, cauldron, recipeZone],
  });

  const main = createElement('main', {
    className: 'main',
    children: [createContainer('container', [mainBoard, barsZone, controlsZone])],
  });

  fragment.append(header, main, footer);

  return fragment;
};
