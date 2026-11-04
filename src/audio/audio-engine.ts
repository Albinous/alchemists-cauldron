import { AUDIO_CHANNELS } from '@/data';
import { type AudioChannel, type ISettings } from '@/types';

const VOLUME_SMOOTHING_SEC = 0.02;

export class AudioEngine {
  private context: AudioContext | undefined;
  private readonly gains = new Map<AudioChannel, GainNode>();
  private readonly volumes: Record<AudioChannel, number>;
  private isMuted: boolean;

  constructor(settings: ISettings) {
    this.volumes = { ...settings.volume };
    this.isMuted = settings.isMuted;
  }

  private applyVolume(channel: AudioChannel, isInstant = false): void {
    const gain = this.gains.get(channel);
    if (!gain || !this.context) return;

    const target = channel === 'master' && this.isMuted ? 0 : this.volumes[channel];

    if (isInstant) {
      gain.gain.setValueAtTime(target, this.context.currentTime);
    } else {
      gain.gain.setTargetAtTime(target, this.context.currentTime, VOLUME_SMOOTHING_SEC);
    }
  }

  public unlock(): void {
    if (this.context) {
      if (this.context.state === 'suspended') void this.context.resume();
      return;
    }

    this.context = new AudioContext();

    for (const channel of AUDIO_CHANNELS) {
      this.gains.set(channel, this.context.createGain());
    }

    const master = this.gains.get('master');
    const music = this.gains.get('music');
    const sfx = this.gains.get('sfx');

    if (!master || !music || !sfx) return;

    sfx.connect(master);
    music.connect(master);
    master.connect(this.context.destination);

    for (const channel of AUDIO_CHANNELS) {
      this.applyVolume(channel, true);
    }

    // temporary check: remove after testing
    const beep = this.context.createOscillator();
    beep.connect(sfx);
    beep.start();
    beep.stop(this.context.currentTime + 0.2);
  }
}
