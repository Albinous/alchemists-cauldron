import type { ILayoutElements } from '@/types';
import { createElement, createZone } from '../dom';
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

  const main = createElement('main', {
    className: 'main',
  });

  const mainBoard = createElement('div', {
    className: 'main__board',
  });

  const shelfZone = createZone('section', 'shelf', 'Ingredient shelf', shelf);
  const cauldronZone = createZone('section', 'cauldron', 'Cauldron', cauldron);
  const recipeZone = createZone('section', 'recipes', 'Recipes', recipe);
  const barsZone = createZone('section', 'Bars', 'bars', bars);
  const controlsZone = createZone('section', 'controls', 'Game controls', controls);

  mainBoard.append(shelfZone, cauldronZone, recipeZone);
  main.append(mainBoard, barsZone, controlsZone);

  fragment.append(header, main, footer);

  return fragment;
};
