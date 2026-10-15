import { createElement } from '@/ui/dom';
import { Bar } from '../bar/bar';
import { densitySvg, magicSvg, temperatureSvg } from '@/assets';
import './bars.scss';

export const BAR_SCALES = {
  temperature: { min: -80, max: 80 },
  density: { min: -60, max: 60 },
  magic: { min: 0, max: 80 },
} as const;

export class Bars {
  private readonly temperature = new Bar({
    min: BAR_SCALES.temperature.min,
    max: BAR_SCALES.temperature.max,
    icon: temperatureSvg,
    label: 'Temperature',
    modifier: 'temperature',
  });
  private readonly density = new Bar({
    min: BAR_SCALES.density.min,
    max: BAR_SCALES.density.max,
    icon: densitySvg,
    label: 'Density',
    modifier: 'density',
  });
  private readonly magic = new Bar({
    min: BAR_SCALES.magic.min,
    max: BAR_SCALES.magic.max,
    icon: magicSvg,
    label: 'Magic',
    modifier: 'magic',
  });
  private readonly bars = createElement('section', {
    className: 'bars',
  });

  constructor() {
    this.bars.append(this.temperature.render(), this.density.render(), this.magic.render());
  }

  public render(): HTMLElement {
    return this.bars;
  }
}
