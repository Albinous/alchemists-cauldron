import type { Difficulty } from './difficulty';

export interface ILeaderboardEntry {
  name: string;
  score: number;
  date: number;
  difficulty: Difficulty;
}
