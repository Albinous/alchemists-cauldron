import { createElement } from '@/ui/dom';
import { Bar } from '../bar/bar';
import { densitySvg, magicSvg, temperatureSvg } from '@/assets';
import type { ICauldronValues, IRecipe } from '@/types';
import { BAR_SCALES } from '@/data';

import './bars.scss';
import { isInRange } from '@/logic/is-in-range';

const PARAMETER_KEYS: readonly (keyof ICauldronValues)[] = ['temperature', 'density', 'magicPower'];

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
    min: BAR_SCALES.magicPower.min,
    max: BAR_SCALES.magicPower.max,
    icon: magicSvg,
    label: 'Magic Power',
    modifier: 'magic',
  });
  private readonly barComponents = {
    temperature: this.temperature,
    density: this.density,
    magicPower: this.magic,
  };
  private readonly bars = createElement('section', {
    className: 'bars',
  });

  constructor() {
    this.bars.append(this.temperature.render(), this.density.render(), this.magic.render());
  }

  public update(values: ICauldronValues, recipe: IRecipe | undefined): void {
    this.bars.classList.add('bars--active');
    for (const key of PARAMETER_KEYS) {
      const bar = this.barComponents[key];
      bar.setValue(values[key]);
      bar.setTarget(recipe?.[key]);
      bar.setInRange(recipe !== undefined && isInRange(values[key], recipe[key]));
    }
  }

  public reset(): void {
    this.bars.classList.remove('bars--active');
    for (const key of PARAMETER_KEYS) {
      const bar = this.barComponents[key];
      bar.reset();
    }
  }

  public render(): HTMLElement {
    return this.bars;
  }
}
