import { createContainer, createElement, createSvgFromString } from '@/ui/dom';
import type { GameOverReason } from '@/types';
import { GAME_OVER_REASON_LABELS } from '@/data';
import { Modal } from '../modal';

import './game-over.scss';
import { trophySvg } from '@/assets';

const TITLE_TEXT = 'Game Over';
const SCORE_LABEL = 'Final Score';
const PLAY_AGAIN_TEXT = 'Play again';
const TITLE_ID = 'game-over-title';

const FORM_LABEL = 'Enter your name';
const NAME_HINT_TEXT = '2–15 characters: letters, digits, space, _ and -';
const NAME_ERROR_TEXT = 'Use 2–15 characters: letters, digits, space, _ or -';
const NAME_ID = 'game-over-name';
const NAME_HINT_ID = 'game-over-name-hint';
const NAME_ERROR_ID = 'game-over-name-error';
const SUBMIT_TEXT = 'Submit Score';
const LEADERBOARD_TEXT = 'Leaderboard';

export class GameOver {
  private readonly reason = createElement('p', {
    className: 'game-over__reason',
  });
  private readonly finalScoreValue = createElement('span', {
    className: 'game-over__score-value',
  });
  private readonly modal: Modal;
  private readonly form = createElement('form', {
    className: 'game-over__form',
  });
  private readonly input = createElement('input', {
    className: 'game-over__input',
    attributes: {
      id: NAME_ID,
      type: 'text',
      maxlength: '15',
      autocomplete: 'off',
      'aria-describedby': `${NAME_HINT_ID} ${NAME_ERROR_ID}`,
    },
  });
  private readonly formError = createElement('p', {
    className: 'game-over__error',
    text: NAME_ERROR_TEXT,
    attributes: {
      id: NAME_ERROR_ID,
      role: 'alert',
    },
  });
  private readonly submitButton = createElement('button', {
    className: 'game-over__submit',
    text: SUBMIT_TEXT,
    attributes: {
      type: 'submit',
    },
  });

  constructor(
    onSubmitName: (name: string) => void,
    onPlayAgain: () => void,
    onLeaderboard: () => void,
  ) {
    const finalScoreLabel = createElement('span', {
      className: 'game-over__score-label',
      text: SCORE_LABEL,
    });
    const finalScore = createContainer('game-over__score', [finalScoreLabel, this.finalScoreValue]);

    this.createForm();

    const playAgainButton = createElement('button', {
      className: 'game-over__replay',
      text: PLAY_AGAIN_TEXT,
      attributes: {
        type: 'button',
      },
    });

    const leaderboardButton = createElement('button', {
      className: 'game-over__leaderboard',
      attributes: {
        type: 'button',
      },
    });

    const leaderboardIcon = createSvgFromString(trophySvg);
    leaderboardButton.append(leaderboardIcon, LEADERBOARD_TEXT);

    this.modal = new Modal({
      className: 'game-over',
      titleId: TITLE_ID,
      title: TITLE_TEXT,
      content: [this.reason, finalScore, this.form],
      actions: [playAgainButton, leaderboardButton],
    });

    playAgainButton.addEventListener('click', onPlayAgain);
    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      onSubmitName(this.input.value);
    });
    this.form.addEventListener('input', () => {
      this.hideNameError();
    });
    leaderboardButton.addEventListener('click', onLeaderboard);
  }

  private createForm(): void {
    const label = createElement('label', {
      className: 'game-over__label',
      text: FORM_LABEL,
      attributes: {
        for: NAME_ID,
      },
    });
    const hint = createElement('p', {
      className: 'game-over__hint',
      text: NAME_HINT_TEXT,
      attributes: {
        id: NAME_HINT_ID,
      },
    });
    this.formError.hidden = true;

    this.form.append(label, this.input, hint, this.formError, this.submitButton);
  }

  private hideNameError(): void {
    this.formError.hidden = true;
    this.input.removeAttribute('aria-invalid');
  }

  private resetForm(): void {
    this.input.value = '';
    this.hideNameError();
  }

  public hideForm(): void {
    this.form.hidden = true;
  }

  public showNameError(): void {
    this.formError.hidden = false;
    this.input.setAttribute('aria-invalid', 'true');
  }

  public show(reason: GameOverReason, score: number, isTopScore: boolean): void {
    this.resetForm();
    this.reason.textContent = GAME_OVER_REASON_LABELS[reason];
    this.finalScoreValue.textContent = String(score);

    this.form.hidden = !isTopScore;

    this.modal.show();
  }

  public hide(): void {
    this.modal.hide();
  }

  public render(): HTMLElement {
    return this.modal.render();
  }
}
