import { createElement } from '@/ui/dom';
import { Bar } from '../bar/bar';
import { densitySvg, magicSvg, temperatureSvg } from '@/assets';
import './bars.scss';

export class Bars {
  private readonly temperature = new Bar({
    icon: temperatureSvg,
    label: 'Temperature',
    modifier: 'temperature',
  });
  private readonly density = new Bar({
    icon: densitySvg,
    label: 'Density',
    modifier: 'density',
  });
  private readonly magic = new Bar({
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
