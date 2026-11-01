import { helpSvg, pauseSvg, pourOutSvg, settingsSvg } from '@/assets';
import type { IControlsHandlers } from '@/types';
import { createContainer, createElement, createSvgFromString } from '@/ui/dom';

import './controls.scss';

const START_LABEL = 'Start Game';
const BREW_LABEL = 'Brew';
const HELP_LABEL = 'Help';
const SETTINGS_LABEL = 'Settings';
const PAUSE_LABEL = 'Pause';
const POUR_OUT_LABEL = 'Pour Out';
const POUR_OUT_TEXT = '-10 s';

export class Controls {
  private readonly controls = createContainer('controls');
  private readonly mainButton = createElement('button', {
    className: 'controls__main',
    attributes: {
      type: 'button',
    },
  });
  private readonly mainLabel = createElement('span', {
    className: 'controls__main-label',
  });
  private readonly secondaryButton = createElement('button', {
    className: 'controls__round',
    attributes: {
      type: 'button',
    },
  });
  private readonly pourOutButton = createElement('button', {
    className: 'controls__round',
    attributes: {
      type: 'button',
      'aria-label': 'Pour out, costs 10 seconds',
    },
    children: this.createRoundContent(pourOutSvg, POUR_OUT_LABEL, POUR_OUT_TEXT),
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
    // this.pourOutButton.append(
    //   ...this.createRoundContent(pourOutSvg, POUR_OUT_LABEL, POUR_OUT_TEXT),
    // );
    this.pourOutButton.hidden = true;

    const controlsActions = createContainer('controls__actions', [this.pourOutButton, mainGlow]);
    this.controls.append(helpButton, controlsActions, this.secondaryButton);
    helpButton.addEventListener('click', handlers.onHelp);
    this.pourOutButton.addEventListener('click', handlers.onPourOut);
  }

  private createMainGlow(handlers: IControlsHandlers): HTMLElement {
    this.mainButton.append(this.mainLabel);
    const mainGlow = createContainer('controls__main-glow', [this.mainButton]);

    this.mainButton.addEventListener('click', handlers.onMain);

    return mainGlow;
  }

  private createRoundContent(iconSvg: string, label: string, extraInfo?: string): Node[] {
    const icon = createContainer('controls__round-icon', [createSvgFromString(iconSvg)]);
    const spanLabel = createElement('span', {
      className: 'controls__round-label',
      text: label,
    });

    if (extraInfo) {
      const spanInfo = createElement('span', {
        className: 'controls__round-text',
        text: extraInfo,
      });
      return [icon, spanLabel, spanInfo];
    }

    return [icon, spanLabel];
  }

  public setMainEnabled(isEnabled: boolean): void {
    this.mainButton.disabled = !isEnabled;
  }

  public setPourOutEnabled(isEnabled: boolean): void {
    this.pourOutButton.toggleAttribute('disabled', !isEnabled);
  }

  public setPlaying(isPlaying: boolean): void {
    this.mainLabel.textContent = isPlaying ? BREW_LABEL : START_LABEL;
    this.pourOutButton.hidden = !isPlaying;
    const content = isPlaying
      ? this.createRoundContent(pauseSvg, PAUSE_LABEL)
      : this.createRoundContent(settingsSvg, SETTINGS_LABEL);

    this.secondaryButton.replaceChildren(...content);
  }

  public setSecondaryEnabled(isEnabled: boolean): void {
    this.secondaryButton.disabled = !isEnabled;
  }

  public render(): HTMLElement {
    return this.controls;
  }
}
