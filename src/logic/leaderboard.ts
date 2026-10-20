import type { ILeaderboardEntry } from '@/types';

const LEADERBOARD_SIZE = 10;

export const isTopScore = (entries: ILeaderboardEntry[], score: number): boolean => {
  const lastLeader = entries.at(-1);
  return (
    (entries.length < LEADERBOARD_SIZE || (lastLeader !== undefined && score > lastLeader.score)) &&
    score > 0
  );
};

export const addEntry = (
  entries: ILeaderboardEntry[],
  entry: ILeaderboardEntry,
): ILeaderboardEntry[] => {
  const sorted = [...entries, entry].toSorted((a, b) => {
    return a.score === b.score ? a.date - b.date : b.score - a.score;
  });
  return sorted.slice(0, LEADERBOARD_SIZE);
};
