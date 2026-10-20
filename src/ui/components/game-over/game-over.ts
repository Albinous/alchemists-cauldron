import { createContainer, createElement } from '@/ui/dom';
import type { GameOverReason } from '@/types';
import { GAME_OVER_REASON_LABELS } from '@/data';

import './game-over.scss';
import { Modal } from '../modal';

const TITLE_TEXT = 'Game Over';
const SCORE_LABEL = 'Final Score';
const PLAY_AGAIN_TEXT = 'Play again';
const TITLE_ID = 'game-over-title';

export class GameOver {
  private readonly reason = createElement('p', {
    className: 'game-over__reason',
  });
  private readonly finalScoreValue = createElement('span', {
    className: 'game-over__score-value',
  });
  private readonly modal: Modal;
  private readonly onPlayAgain: () => void;

  constructor(onPlayAgain: () => void) {
    this.onPlayAgain = onPlayAgain;

    const finalScoreLabel = createElement('span', {
      className: 'game-over__score-label',
      text: SCORE_LABEL,
    });
    const finalScore = createContainer('game-over__score', [finalScoreLabel, this.finalScoreValue]);

    const playAgainButton = createElement('button', {
      className: 'game-over__replay',
      text: PLAY_AGAIN_TEXT,
      attributes: {
        type: 'button',
      },
    });
    playAgainButton.addEventListener('click', this.onPlayAgain);

    this.modal = new Modal({
      className: 'game-over',
      titleId: TITLE_ID,
      title: TITLE_TEXT,
      content: [this.reason, finalScore],
      actions: [playAgainButton],
    });
  }

  public show(reason: GameOverReason, score: number): void {
    this.reason.textContent = GAME_OVER_REASON_LABELS[reason];
    this.finalScoreValue.textContent = String(score);

    this.modal.show();
  }

  public hide(): void {
    this.modal.hide();
  }

  public render(): HTMLElement {
    return this.modal.render();
  }
}
