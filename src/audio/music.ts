import { MUSIC_BEATS_PER_BAR, MUSIC_CHORDS, MUSIC_MELODY, MUSIC_TEMPO_BPM } from '@/data';
import { audio } from './audio-engine';
import type { INoteOptions } from '@/types';

const SEC_PER_MINUTE = 60;
const PAD_VOLUME = 0.07;
const PAD_ATTACK_SEC = 0.4;
const MELODY_VOLUME = 0.12;
const MELODY_ATTACK_SEC = 0.02;
const MELODY_NOTE_LENGTH = 0.9; // part of a beat, leaves a small gap between notes
const SILENCE = 0.001;
const NORMAL_RATE = 1;
const FAST_RATE = 1.15;
const RATE_SMOOTHING_SEC = 0.3;

const addNote = (context: BaseAudioContext, options: INoteOptions): void => {
  const { frequency, start, duration, volume, attack, type } = options;
  const end = start + duration;

  const oscillator = context.createOscillator();
  oscillator.type = type;
  oscillator.frequency.value = frequency;

  const gain = context.createGain();
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(volume, start + attack);
  gain.gain.exponentialRampToValueAtTime(SILENCE, end);

  oscillator.connect(gain).connect(context.destination);
  oscillator.start(start);
  oscillator.stop(end);
};

// plays the whole loop once into a buffer, without sound
const renderLoop = async (sampleRate: number): Promise<AudioBuffer> => {
  const beatSec = SEC_PER_MINUTE / MUSIC_TEMPO_BPM;
  const barSec = beatSec * MUSIC_BEATS_PER_BAR;
  const loopSec = barSec * MUSIC_CHORDS.length;
  const offline = new OfflineAudioContext(1, Math.ceil(loopSec * sampleRate), sampleRate);

  for (const [bar, chord] of MUSIC_CHORDS.entries()) {
    for (const frequency of chord) {
      addNote(offline, {
        frequency,
        start: bar * barSec,
        duration: barSec,
        volume: PAD_VOLUME,
        attack: PAD_ATTACK_SEC,
        type: 'triangle',
      });
    }
  }

  for (const [beat, frequency] of MUSIC_MELODY.entries()) {
    if (frequency === 0) continue;
    addNote(offline, {
      frequency,
      start: beat * beatSec,
      duration: beatSec * MELODY_NOTE_LENGTH,
      volume: MELODY_VOLUME,
      attack: MELODY_ATTACK_SEC,
      type: 'sine',
    });
  }

  return offline.startRendering();
};

class MusicPlayer {
  private buffer: AudioBuffer | undefined;
  private source: AudioBufferSourceNode | undefined;
  private isPlaying = false;
  private isFast = false;

  public async start(): Promise<void> {
    const context = audio.getContext();
    const output = audio.getOutput('music');
    if (context === undefined || output === undefined || this.isPlaying) return;

    this.isPlaying = true;
    this.buffer ??= await renderLoop(context.sampleRate);
    if (!this.isPlaying) return; // stopped while the loop was rendering

    const source = context.createBufferSource();
    source.buffer = this.buffer;
    source.loop = true;
    source.connect(output);
    source.start();
    this.source = source;
  }

  public stop(): void {
    this.isPlaying = false;
    this.isFast = false;
    this.source?.stop();
    this.source?.disconnect();
    this.source = undefined;
  }

  public setFast(isFast: boolean): void {
    const context = audio.getContext();
    if (context === undefined || this.source === undefined || this.isFast === isFast) return;

    this.isFast = isFast;
    this.source.playbackRate.setTargetAtTime(
      isFast ? FAST_RATE : NORMAL_RATE,
      context.currentTime,
      RATE_SMOOTHING_SEC,
    );
  }
}

export const music = new MusicPlayer();
