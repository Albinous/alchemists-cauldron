import type { IBarConfig } from '@/types';
import { createContainer, createElement, createSvgFromString } from '@/ui/dom';
import { clamp, formatNumber } from '@/utils';

import './bar.scss';

const INITIAL_VALUE = 0;
const TICKS_COUNT = 5;

export class Bar {
  private config: IBarConfig;
  private readonly bar = createContainer('bar');
  private readonly min: number;
  private readonly max: number;
  private readonly value = createElement('span', {
    className: 'bar__value',
  });
  private readonly marker = createElement('span', {
    className: 'bar__marker',
  });

  constructor(config: IBarConfig) {
    this.config = config;
    this.min = config.min;
    this.max = config.max;
    this.buildStructure();
    this.reset();
  }

  private buildStructure(): void {
    const icon = createSvgFromString(this.config.icon, 'bar__icon');
    const barInfo = this.createBarInfo();

    this.bar.classList.add(`bar--${this.config.modifier}`);

    this.bar.replaceChildren(icon, barInfo);
  }

  private createBarInfo(): HTMLElement {
    const container = createContainer('bar__info');
    const header = this.createBarHeader();
    const range = this.createRange();

    container.append(header, range);
    return container;
  }

  private createBarHeader(): HTMLElement {
    const container = createContainer('bar__header');
    const labelName = createElement('span', {
      className: 'bar__label',
      text: this.config.label,
    });
    container.append(labelName, this.value);

    return container;
  }

  private createRange(): HTMLElement {
    const zeroLine = this.createZeroLine();
    const range = createContainer('bar__range-track', [zeroLine, this.marker]);
    const ticksArray = this.createTicksValues();
    const ticks = ticksArray.map((tickValue) => this.createTick(tickValue));
    const ticksContainer = createContainer('bar__range-ticks', [...ticks]);
    const container = createContainer('bar__range', [range, ticksContainer]);

    return container;
  }

  private createZeroLine(): HTMLElement {
    const zero = createElement('span', { className: 'bar__zero' });
    zero.style.left = `${this.toPercent(0)}%`;
    return zero;
  }

  private createTicksValues(): number[] {
    const stepPerTick = (this.max - this.min) / (TICKS_COUNT - 1);

    return Array.from(
      { length: TICKS_COUNT },
      (_, index: number) => this.min + index * stepPerTick,
    );
  }

  private createTick(value: number): HTMLElement {
    const tick = createElement('span', {
      className: 'bar__range-tick',
      text: formatNumber(value),
    });

    tick.style.left = `${this.toPercent(value)}%`;

    return tick;
  }

  private toPercent(value: number): number {
    return ((value - this.min) / (this.max - this.min)) * 100;
  }

  public setValue(value: number): void {
    this.value.textContent = formatNumber(value);
    const position =
      value > this.max || value < this.min
        ? clamp(value, this.min, this.max)
        : this.toPercent(value);
    this.marker.style.setProperty('--marker-position', `${position}%`);
  }

  public reset(): void {
    this.setValue(INITIAL_VALUE);
  }

  public render(): HTMLElement {
    return this.bar;
  }
}
