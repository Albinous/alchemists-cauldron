import type { IBarConfig } from '@/types';
import { createContainer, createElement, createSvgFromString } from '@/ui/dom';
import { formatNumber } from '@/utils';

const INITIAL_VALUE = 0;
const SCALE_MIN = -80;
const SCALE_MAX = 80;
const TICKS = [SCALE_MIN, SCALE_MIN / 2, 0, SCALE_MAX / 2, SCALE_MAX];

export class Bar {
  private readonly bar = createContainer('bar');
  private readonly value = createElement('span', {
    className: 'bar__value',
    text: String(INITIAL_VALUE),
  });
  private readonly marker = createElement('span', {
    className: 'bar__marker',
  });

  constructor(config: IBarConfig) {
    this.buildStructure(config);
  }

  private buildStructure(config: IBarConfig): void {
    const icon = createSvgFromString(config.icon, 'bar__icon');
    const barInfo = this.createBarInfo(config.label);

    this.bar.classList.add(`bar--${config.modifier}`);

    this.bar.replaceChildren(icon, barInfo);
  }

  private createBarInfo(label: string): HTMLElement {
    const container = createContainer('bar__info');
    const header = this.createBarHeader(label);
    const range = this.createRange();

    container.append(header, range);
    return container;
  }

  private createBarHeader(label: string) {
    const container = createContainer('bar__header');
    const labelName = createElement('span', {
      className: 'bar__label',
      text: label,
    });
    container.append(labelName, this.value);

    return container;
  }

  private createRange(): HTMLElement {
    const zeroLine = createContainer('bar__zero');
    const range = createContainer('bar__range-track', [zeroLine, this.marker]);
    const ticks = TICKS.map((tickValue) => this.createTick(tickValue));
    const ticksContainer = createContainer('bar__range-ticks', [...ticks]);
    const container = createContainer('bar__range', [range, ticksContainer]);

    return container;
  }

  private createTick(value: number) {
    return createElement('span', {
      className: 'bar__range-tick',
      text: formatNumber(value),
    });
  }

  public render(): HTMLElement {
    return this.bar;
  }
}
