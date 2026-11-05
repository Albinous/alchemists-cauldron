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

export type SoundName = 'add' | 'success' | 'fail' | 'reaction' | 'pour-out' | 'tick' | 'game-over';

export type SoundStep = ({ kind: 'tone' } & IToneOptions) | ({ kind: 'noise' } & INoiseOptions);
