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
