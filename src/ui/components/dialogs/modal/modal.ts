import { emblemSvg } from '@/assets';
import type { IModalOptions } from '@/types';
import { createContainer, createElement, createSvgFromString } from '@/ui/dom';

import './modal.scss';

const CLOSED_BY_CODE = 'code';

const preventClose = (event: Event): void => {
  event.preventDefault();
};

const createDividerLine = (): HTMLSpanElement =>
  createElement('span', { className: 'modal__divider-line' });

export class Modal {
  private readonly dialog = createElement('dialog', { className: 'modal' });

  constructor(options: IModalOptions) {
    this.dialog.classList.add(options.className);
    this.dialog.setAttribute('aria-labelledby', options.titleId);
    this.buildStructure(options);
    this.dialog.addEventListener('cancel', (event) => {
      preventClose(event);
      options.onCancel?.();
    });
    this.dialog.addEventListener('close', () => {
      if (this.dialog.returnValue === CLOSED_BY_CODE) return;

      if (options.onCancel) {
        options.onCancel();
      } else {
        this.dialog.showModal();
      }
    });
  }

  private buildStructure(options: IModalOptions): void {
    const emblemIcon = createSvgFromString(options.icon ?? emblemSvg);
    const emblem = createContainer('modal__emblem', [emblemIcon]);
    const title = createElement('h2', {
      className: 'modal__title',
      text: options.title,
      attributes: {
        id: options.titleId,
      },
    });
    const line = createDividerLine();
    const line2 = createDividerLine();
    const gem = createElement('span', {
      className: 'modal__divider-gem',
    });
    const divider = createElement('span', {
      className: 'modal__divider',
      attributes: {
        'aria-hidden': true,
      },
    });
    divider.append(line, gem, line2);

    const content = createContainer('modal__content', options.content);
    const actions = createContainer('modal__actions', options.actions);

    const container = createContainer('modal__panel', [emblem, title, divider, content, actions]);

    this.dialog.append(container);
  }

  public show(): void {
    if (this.dialog.open) return;
    this.dialog.returnValue = '';
    this.dialog.showModal();
  }

  public hide(): void {
    this.dialog.close(CLOSED_BY_CODE);
  }

  public render(): HTMLElement {
    return this.dialog;
  }
}
