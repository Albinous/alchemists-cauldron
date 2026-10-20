import type { ILeaderboardEntry } from '@/types';

const LEADERBOARD_SIZE = 10;

export const isTopScore = (entries: ILeaderboardEntry[], score: number): boolean => {
  const lastLeader = entries.at(-1);
  return (
    (entries.length < LEADERBOARD_SIZE || (lastLeader !== undefined && score > lastLeader.score)) &&
    score > 0
  );
};
