import type { ILayoutElements } from '@/types';
import { createContainer, createElement } from '../dom';
import './layout.scss';

export const createLayout = ({
  header,
  shelf,
  cauldron,
  recipe,
  bars,
  controls,
  footer,
  gameOver,
}: ILayoutElements): DocumentFragment => {
  const fragment = document.createDocumentFragment();

  const mainBoard = createElement('div', {
    className: 'main__board',
    children: [shelf, cauldron, recipe],
  });

  const main = createElement('main', {
    className: 'main',
    children: [createContainer('container', [mainBoard, bars, controls])],
  });

  fragment.append(header, main, footer, gameOver);

  return fragment;
};
