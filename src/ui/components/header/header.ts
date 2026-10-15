import { createHeartIcon } from '@/ui/icons';
import './header.scss';
import { createContainer, createElement } from '@/ui/dom';

const INITIAL_SCORE_VALUE = 0;
const INITIAL_TIMER_VALUE = '00:00';

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
    text: '—',
  });

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
    const timer = this.createStat('Time', this.timerValue, 'time', statsBar);
    const lives = this.createStat('Lives', this.livesValue, 'lives');

    this.stats.append(score, this.createStatDivider(), timer, this.createStatDivider(), lives);

    return this.stats;
  }

  private createStat(
    label: string,
    valueElement: Element,
    additionalClass?: string,
    extra?: HTMLElement,
  ): HTMLDivElement {
    const container = createContainer(
      additionalClass ? `stats__item stats__item--${additionalClass}` : 'stats__item',
    );
    const statsLabel = createElement('span', {
      className: 'stats__item-label',
      text: label,
    });

    container.append(statsLabel, valueElement);

    if (extra) {
      container.append(extra);
    }

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

  public setTimer(time: string, barFill: number): void {
    this.timerValue.textContent = time;
    this.timeBarFill.style.width = `${barFill}%`;
  }

  public setLives(lives: number, maxLives: number): void {
    const hearts = Array.from({ length: maxLives }, (_, index) => createHeartIcon(index >= lives));
    this.livesValue.replaceChildren(...hearts);
    this.livesValue.setAttribute('aria-label', `Lives: ${lives} of ${maxLives}`);
  }

  public render(): HTMLElement {
    const element = this.createHeader();

    return element;
  }
}
