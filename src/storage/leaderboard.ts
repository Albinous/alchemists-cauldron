import { DIFFICULTIES } from '@/data';
import type { Difficulty, ILeaderboardEntry } from '@/types';

const LEADERBOARD_KEY = 'alchemists-cauldron:leaderboard';

export const isDifficulty = (value: unknown): value is Difficulty =>
  typeof value === 'string' && (DIFFICULTIES as readonly string[]).includes(value);

const isLeaderboardEntry = (value: unknown): value is ILeaderboardEntry => {
  if (value === null || typeof value !== 'object') return false;

  const hasName = 'name' in value && typeof value.name === 'string';
  const hasScore = 'score' in value && typeof value.score === 'number';
  const hasDate = 'date' in value && typeof value.date === 'number';
  const hasDifficulty = 'difficulty' in value && isDifficulty(value.difficulty);

  return hasName && hasScore && hasDate && hasDifficulty;
};

const getLeaderboardKey = (difficulty: Difficulty): string => `${LEADERBOARD_KEY}:${difficulty}`;

export const saveLeaderboard = (entries: ILeaderboardEntry[], difficulty: Difficulty): void => {
  try {
    localStorage.setItem(getLeaderboardKey(difficulty), JSON.stringify(entries));
  } catch {
    // storage is unavailable or full — the game keeps working without saving
  }
};

export const loadLeaderboard = (difficulty: Difficulty): ILeaderboardEntry[] => {
  try {
    const value = localStorage.getItem(getLeaderboardKey(difficulty));
    if (value === null) return [];
    const data: unknown = JSON.parse(value);

    return Array.isArray(data) && data.every(isLeaderboardEntry) ? data : [];
  } catch {
    return [];
  }
};

export const clearLeaderboard = (difficulty: Difficulty): void => {
  try {
    localStorage.removeItem(getLeaderboardKey(difficulty));
  } catch {
    // storage is unavailable — nothing to clear
  }
};
