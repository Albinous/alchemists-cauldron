import { createElement } from '@/ui/dom';
import { Modal } from '../modal';
import { trashSvg } from '@/assets';

import './confirm.scss';

const TITLE_TEXT = 'Clear the leaderboard?';
const TITLE_ID = 'confirm-title';
const WARNING_TEXT = 'All saved results will be erased. This cannot be undone.';
const CANCEL_TEXT = 'Cancel';
const CLEAR_TEXT = 'Clear';

export class Confirm {
  private readonly modal: Modal;

  constructor(onCancel: () => void, onClear: () => void) {
    const warningText = createElement('p', {
      className: 'confirm__warning',
      text: WARNING_TEXT,
    });

    const cancelButton = createElement('button', {
      className: 'confirm__cancel',
      text: CANCEL_TEXT,
      attributes: {
        type: 'button',
      },
    });

    const clearButton = createElement('button', {
      className: 'confirm__clear',
      text: CLEAR_TEXT,
      attributes: {
        type: 'button',
      },
    });

    this.modal = new Modal({
      className: 'confirm',
      title: TITLE_TEXT,
      titleId: TITLE_ID,
      content: [warningText],
      actions: [cancelButton, clearButton],
      onCancel: onCancel,
      icon: trashSvg,
    });

    cancelButton.addEventListener('click', onCancel);
    clearButton.addEventListener('click', onClear);
  }

  public show(): void {
    this.modal.show();
  }

  public hide(): void {
    this.modal.hide();
  }

  public render(): HTMLElement {
    return this.modal.render();
  }
}
