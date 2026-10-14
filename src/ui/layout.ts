import type { ILayoutElements } from '@/types';

export const createLayout = ({ header, main, footer }: ILayoutElements): DocumentFragment => {
  const fragment = document.createDocumentFragment();

  fragment.append(header, main, footer);

  return fragment;
};
