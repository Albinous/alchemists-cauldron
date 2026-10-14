import './header.scss';
import { createContainer, createElement } from '@/ui/dom';

const INITIAL_SCORE_VALUE = 0;
const INITIAL_TIMER_VALUE = '00:00';

export class Header {
  private readonly scoreValue = createElement('span', {
    className: 'stats-item__value',
    text: `${INITIAL_SCORE_VALUE}`,
  });
  private readonly timerValue = createElement('span', {
    className: 'stats-item__value',
    text: INITIAL_TIMER_VALUE,
  });
  private readonly timeBarFill = createElement('div', {
    className: 'stats__bar-fill',
  });
  private readonly livesValue = createElement('div', {
    className: 'stats-item__value',
    text: 'hearts',
  });
  private createHeader(): HTMLElement {
    const header = createElement('header', {
      className: 'header',
      children: [
        createElement('div', {
          className: 'container',
          children: [
            createContainer('header-wrapper', [
              createElement('h1', {
                className: 'header-title',
                text: `Alchemist's Cauldron`,
              }),
              this.createStats(),
            ]),
          ],
        }),
      ],
    });

    return header;
  }

  private createStats(): HTMLDivElement {
    const statsBar = createElement('div', {
      className: 'stats__bar',
      children: [this.timeBarFill],
    });

    const score = this.createStat('Score', this.scoreValue);
    const timer = this.createStat('Time', this.timerValue, statsBar);
    const lives = this.createStat('Lives', this.livesValue);

    const container = createContainer('stats', [
      score,
      createElement('div', { className: 'stats__divider' }),
      timer,
      createElement('div', { className: 'stats__divider' }),
      lives,
    ]);

    return container;
  }

  private createStat(
    label: string,
    valueElement: HTMLElement,
    extra?: HTMLElement,
  ): HTMLDivElement {
    const container = createContainer('stats-item');
    const statsLabel = createElement('span', {
      className: 'stats-item__label',
      text: label,
    });

    container.append(statsLabel, valueElement);

    if (extra) {
      container.append(extra);
    }

    return container;
  }

  public setScore(score: number) {
    this.scoreValue.textContent = String(score);
  }

  public setTimer(time: string, barFill: number) {
    this.timerValue.textContent = time;
    this.timeBarFill.style.width = `${barFill}%`;
  }

  public setLives(lives: number) {
    this.livesValue.textContent = String(lives);
  }

  public render(): HTMLElement {
    const element = this.createHeader();

    return element;
  }
}
