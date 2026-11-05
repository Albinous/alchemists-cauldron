import { loadSettings } from '@/storage';
import { AudioEngine } from './audio-engine';

export const audio = new AudioEngine(loadSettings());
