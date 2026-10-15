import { helpSvg, pauseSvg, settingsSvg } from '@/assets';
import type { IControlsHandlers } from '@/types';
import { createContainer, createElement, createSvgFromString } from '@/ui/dom';

import './controls.scss';

const START_LABEL = 'Start Game';
const BREW_LABEL = 'Brew';
const HELP_LABEL = 'Help';
const SETTINGS_LABEL = 'Settings';
const PAUSE_LABEL = 'Pause';

export class Controls {
  private readonly controls = createContainer('controls');
  private readonly mainLabel = createElement('span', {
    className: 'controls__main-label',
  });
  private readonly secondaryButton = createElement('button', {
    className: 'controls__round',
    attributes: {
      type: 'button',
    },
  });

  constructor(handlers: IControlsHandlers) {
    this.buildStructure(handlers);

    this.secondaryButton.addEventListener('click', handlers.onSecondary);

    this.setPlaying(false);
  }

  private buildStructure(handlers: IControlsHandlers): void {
    const helpButton = createElement('button', {
      className: 'controls__round',
      attributes: {
        type: 'button',
      },
      children: this.createRoundContent(helpSvg, HELP_LABEL),
    });

    const mainGlow = this.createMainGlow(handlers);

    this.controls.append(helpButton, mainGlow, this.secondaryButton);
    helpButton.addEventListener('click', handlers.onHelp);
  }

  private createMainGlow(handlers: IControlsHandlers): HTMLElement {
    const mainButton = createElement('button', {
      className: 'controls__main',
      attributes: {
        type: 'button',
      },
      children: [this.mainLabel],
    });
    const mainGlow = createContainer('controls__main-glow', [mainButton]);

    mainButton.addEventListener('click', handlers.onMain);

    return mainGlow;
  }

  private createRoundContent(iconSvg: string, label: string): Node[] {
    const icon = createContainer('controls__round-icon', [createSvgFromString(iconSvg)]);
    const spanLabel = createElement('span', {
      className: 'controls__round-label',
      text: label,
    });

    return [icon, spanLabel];
  }

  public setPlaying(isPlaying: boolean): void {
    this.mainLabel.textContent = isPlaying ? BREW_LABEL : START_LABEL;
    const content = isPlaying
      ? this.createRoundContent(pauseSvg, PAUSE_LABEL)
      : this.createRoundContent(settingsSvg, SETTINGS_LABEL);

    this.secondaryButton.replaceChildren(...content);
  }

  public render(): HTMLElement {
    return this.controls;
  }
}
