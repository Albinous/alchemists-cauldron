import { createHeartIcon } from '@/ui/icons';
import './header.scss';
import { createContainer, createElement } from '@/ui/dom';
import { formatTime } from '@/utils';

const INITIAL_SCORE_VALUE = 0;
const INITIAL_TIMER_VALUE = '00:00';
const INITIAL_LIVES_VALUE = '—';
const DANGER_TIME = 15;

export class Header {
  private readonly stats = createElement('div', {
    className: 'stats stats--inactive',
  });
  private readonly scoreValue = createElement('span', {
    className: 'stats__item-value',
    text: `${INITIAL_SCORE_VALUE}`,
  });
  private readonly timerValue = createElement('span', {
    className: 'stats__item-value',
    text: INITIAL_TIMER_VALUE,
  });
  private readonly timeBarFill = createElement('div', {
    className: 'stats__bar-fill',
  });
  private readonly livesValue = createElement('div', {
    className: 'stats__item-value stats__item-hearts',
    text: INITIAL_LIVES_VALUE,
    attributes: {
      'aria-label': 'Lives: —',
    },
  });
  private readonly timer = this.createStat('Time', this.timerValue, 'time');

  private createHeader(): HTMLElement {
    const title = createElement('h1', {
      className: 'header__title',
      text: `Alchemist's Cauldron`,
    });
    const stats = this.createStats();
    const wrapper = createContainer('header__wrapper', [title, stats]);
    const header = createElement('header', {
      className: 'header',
      children: [
        createElement('div', {
          className: 'container',
          children: [wrapper],
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
    const lives = this.createStat('Lives', this.livesValue, 'lives');

    this.timer.append(statsBar);
    this.stats.append(score, this.createStatDivider(), this.timer, this.createStatDivider(), lives);

    return this.stats;
  }

  private createStat(
    label: string,
    valueElement: Element,
    additionalClass?: string,
  ): HTMLDivElement {
    const container = createContainer(
      additionalClass ? `stats__item stats__item-${additionalClass}` : 'stats__item',
    );
    const statsLabel = createElement('span', {
      className: 'stats__item-label',
      text: label,
    });

    container.append(statsLabel, valueElement);

    return container;
  }

  private createStatDivider(): HTMLDivElement {
    return createElement('div', { className: 'stats__divider' });
  }

  public setActive(isActive: boolean): void {
    this.stats.classList.toggle('stats--inactive', !isActive);
  }

  public setScore(score: number): void {
    this.scoreValue.textContent = String(score);
  }

  public setTimer(timeLeft: number, maxTime: number): void {
    this.timerValue.textContent = formatTime(timeLeft);
    this.timeBarFill.style.width = `${(timeLeft / maxTime) * 100}%`;

    this.timer.classList.toggle('stats__item-time--low', timeLeft <= DANGER_TIME && timeLeft > 0);
  }

  public setLives(lives: number, maxLives: number): void {
    const hearts = Array.from({ length: maxLives }, (_, index) => createHeartIcon(index >= lives));
    this.livesValue.replaceChildren(...hearts);
    this.livesValue.setAttribute('aria-label', `Lives: ${lives} of ${maxLives}`);
  }

  public renderIdle(): void {
    this.scoreValue.textContent = String(INITIAL_SCORE_VALUE);
    this.timerValue.textContent = INITIAL_TIMER_VALUE;
    this.timeBarFill.style.width = '0';
    this.livesValue.textContent = INITIAL_LIVES_VALUE;
    this.livesValue.setAttribute('aria-label', 'Lives: —');
  }

  public render(): HTMLElement {
    const element = this.createHeader();

    return element;
  }
}
