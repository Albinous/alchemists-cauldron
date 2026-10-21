import type { ILeaderboardEntry } from '@/types';

const LEADERBOARD_KEY = 'alchemists-cauldron:leaderboard';

const isLeaderboardEntry = (value: unknown): value is ILeaderboardEntry => {
  if (value === null || typeof value !== 'object') return false;

  const hasName = 'name' in value && typeof value.name === 'string';
  const hasScore = 'score' in value && typeof value.score === 'number';
  const hasDate = 'date' in value && typeof value.date === 'number';

  return hasName && hasScore && hasDate;
};

export const saveLeaderboard = (entries: ILeaderboardEntry[]): void => {
  try {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
  } catch {
    // storage is unavailable or full — the game keeps working without saving
  }
};

export const loadLeaderboard = (): ILeaderboardEntry[] => {
  try {
    const value = localStorage.getItem(LEADERBOARD_KEY);
    if (value === null) return [];
    const data: unknown = JSON.parse(value);

    return Array.isArray(data) && data.every(isLeaderboardEntry) ? data : [];
  } catch {
    return [];
  }
};

export const clearLeaderboard = (): void => {
  try {
    localStorage.removeItem(LEADERBOARD_KEY);
  } catch {
    // storage is unavailable — nothing to clear
  }
};
