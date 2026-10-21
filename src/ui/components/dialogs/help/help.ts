import { bookSvg } from '@/assets';
import { Modal } from '../modal';
import { createContainer, createElement } from '@/ui/dom';
import { PARAMETER_KEYS, PARAMETER_LABELS } from '@/data';

import './help.scss';

const TITLE_TEXT = 'How to Play';
const TITLE_ID = 'help-title';
const STEPS = [
  {
    title: 'Pick ingredients',
    text: 'Click a card on the shelf to drop it into the cauldron. Every ingredient changes three values:',
  },
  {
    title: 'Hit the targets',
    text: 'Move all three markers into the green zones of the recipe. A bar glows when its value is in range.',
  },
  {
    title: 'Brew',
    text: 'A good potion gives score, extra time and a new recipe. A failed one costs a life. Used ingredients never come back.',
  },
] as const;

const NOTE_TEXT =
  'The game ends when time runs out, lives reach zero, or the shelf and cauldron are empty. Press Pause to take a break.';

const CLOSE_TEXT = 'Got it';

export class Help {
  private readonly modal: Modal;

  constructor(onClose: () => void) {
    const helpStepElements = STEPS.map((step, index) => this.createHelpStep(step, index + 1));
    const helpSteps = createElement('ol', {
      className: 'help__steps',
      children: helpStepElements,
    });
    const note = createElement('p', {
      className: 'help__note',
      text: NOTE_TEXT,
    });
    const closeButton = createElement('button', {
      className: 'help__close',
      text: CLOSE_TEXT,
      attributes: {
        type: 'button',
      },
    });

    this.modal = new Modal({
      className: 'help',
      title: TITLE_TEXT,
      titleId: TITLE_ID,
      content: [helpSteps, note],
      actions: [closeButton],
      onCancel: onClose,
      icon: bookSvg,
    });

    closeButton.addEventListener('click', onClose);
  }

  private createHelpStep(step: (typeof STEPS)[number], position: number): HTMLElement {
    const helpStepNumber = createElement('span', {
      className: 'help__step-number',
      text: String(position),
      attributes: {
        'aria-hidden': 'true',
      },
    });
    const helpStepTitle = createElement('span', {
      className: 'help__step-title',
      text: step.title,
    });
    const helpStepText = createElement('span', {
      className: 'help__step-text',
      text: step.text,
    });
    const helpStepContent = createContainer('help__step-body', [helpStepTitle, helpStepText]);
    const helpStep = createElement('li', {
      className: 'help__step',
      children: [helpStepNumber, helpStepContent],
    });

    if (position === 1) {
      const tags = this.createHelpStepTags();
      helpStepContent.append(tags);
    }

    return helpStep;
  }

  private createHelpStepTags(): HTMLElement {
    const helpStepTags = createContainer('help__tags');
    for (const key of PARAMETER_KEYS) {
      helpStepTags.append(
        createElement('span', {
          className: `help__tag help__tag--${key}`,
          text: PARAMETER_LABELS[key],
        }),
      );
    }
    return helpStepTags;
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
