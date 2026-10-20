import { createElement } from '@/ui/dom';
import { Modal } from '../modal';

import './pause.scss';

const TITLE_TEXT = 'Game Paused';
const TITLE_ID = 'pause';
const RESUME_TEXT = 'Resume';
const EXIT_MENU_TEXT = 'Exit To Menu';

export class Pause {
  private readonly modal: Modal;
  private readonly onResume: () => void;
  private readonly onExitMenu: () => void;

  constructor(onResume: () => void, onExitMenu: () => void) {
    this.onResume = onResume;
    this.onExitMenu = onExitMenu;

    const resumeButton = createElement('button', {
      className: 'pause__resume',
      text: RESUME_TEXT,
    });
    const exitMenuButton = createElement('button', {
      className: 'pause__exit',
      text: EXIT_MENU_TEXT,
    });

    this.modal = new Modal({
      className: 'pause',
      title: TITLE_TEXT,
      titleId: TITLE_ID,
      content: [],
      actions: [resumeButton, exitMenuButton],
      onCancel: onResume,
    });

    resumeButton.addEventListener('click', this.onResume);
    exitMenuButton.addEventListener('click', this.onExitMenu);
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
