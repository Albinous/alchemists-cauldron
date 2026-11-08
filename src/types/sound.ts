export interface IToneOptions {
  frequency: number;
  endFrequency?: number;
  type?: OscillatorType;
  duration: number;
  volume: number;
  delay?: number;
}

export interface INoiseOptions {
  duration: number;
  volume: number;
  filterFrom: number;
  filterTo: number;
  attack?: number;
  delay?: number;
}

export interface INoteOptions {
  frequency: number;
  start: number;
  duration: number;
  volume: number;
  attack: number;
  type: OscillatorType;
}

export type SoundName = 'add' | 'success' | 'fail' | 'reaction' | 'pour-out' | 'tick' | 'game-over';

export type SoundStep = ({ kind: 'tone' } & IToneOptions) | ({ kind: 'noise' } & INoiseOptions);
