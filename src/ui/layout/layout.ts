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

  const controlsZone = createZone('section', 'controls', 'Game controls', controls);

  const mainBoard = createElement('div', {
    className: 'main__board',
    children: [shelf, cauldron, recipe],
  });

  const main = createElement('main', {
    className: 'main',
    children: [createContainer('container', [mainBoard, bars, controlsZone])],
  });

  fragment.append(header, main, footer);

  return fragment;
};
