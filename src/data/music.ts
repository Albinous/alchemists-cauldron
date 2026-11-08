export const MUSIC_TEMPO_BPM = 84;
export const MUSIC_BEATS_PER_BAR = 4;

// Am – F – C – G, one chord per bar (Hz)
export const MUSIC_CHORDS: readonly (readonly number[])[] = [
  [220, 261.63, 329.63],
  [174.61, 220, 261.63],
  [130.81, 164.81, 196],
  [196, 246.94, 293.66],
];

// one note per beat, 0 is a rest (Hz)
export const MUSIC_MELODY: readonly number[] = [
  440, 523.25, 659.25, 523.25, 440, 349.23, 440, 0, 392, 523.25, 659.25, 587.33, 493.88, 392,
  293.66, 0,
];
