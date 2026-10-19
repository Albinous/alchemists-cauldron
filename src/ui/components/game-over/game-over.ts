import { emblemSvg } from '@/assets';
import { createContainer, createElement, createSvgFromString } from '@/ui/dom';
import type { GameOverReason } from '@/types';
import { GAME_OVER_REASON_LABELS } from '@/data';

import './game-over.scss';

const TITLE_TEXT = 'Game Over';
const SCORE_LABEL = 'Final Score';
const PLAY_AGAIN_TEXT = 'Play again';
const TITLE_ID = 'game-over-title';

export class GameOver {
  private readonly gameOver = createElement('dialog', {
    className: 'game-over',
    attributes: {
      'aria-labelledby': TITLE_ID,
    },
  });
  private readonly reason = createElement('p', {
    className: 'game-over__reason',
  });
  private readonly finalScoreValue = createElement('span', {
    className: 'game-over__score-value',
  });
  private readonly onPlayAgain: () => void;

  constructor(onPlayAgain: () => void) {
    this.onPlayAgain = onPlayAgain;

    this.buildStructure();
    this.gameOver.addEventListener('cancel', (event) => event.preventDefault());
  }

  private buildStructure(): void {
    const emblemIcon = createSvgFromString(emblemSvg);
    const emblem = createContainer('game-over__emblem', [emblemIcon]);
    const title = createElement('h2', {
      className: 'game-over__title',
      text: TITLE_TEXT,
      attributes: {
        id: TITLE_ID,
      },
    });
    const line = this.createLine();
    const line2 = this.createLine();
    const gem = createElement('span', {
      className: 'game-over__divider-gem',
    });
    const divider = createElement('span', {
      className: 'game-over__divider',
      attributes: {
        'aria-hidden': 'true',
      },
      children: [line, gem, line2],
    });

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
    const actions = createContainer('game-over__actions', [playAgainButton]);

    const container = createContainer('game-over__panel', [
      emblem,
      title,
      divider,
      this.reason,
      finalScore,
      actions,
    ]);

    playAgainButton.addEventListener('click', this.onPlayAgain);

    this.gameOver.append(container);
  }

  private createLine(): HTMLSpanElement {
    return createElement('span', {
      className: 'game-over__divider-line',
    });
  }

  public show(reason: GameOverReason, score: number): void {
    this.reason.textContent = GAME_OVER_REASON_LABELS[reason];
    this.finalScoreValue.textContent = String(score);

    this.gameOver.showModal();
  }

  public hide(): void {
    this.gameOver.close();
  }

  public render(): HTMLElement {
    return this.gameOver;
  }
}
