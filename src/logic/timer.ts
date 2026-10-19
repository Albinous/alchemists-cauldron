const MS_PER_SECOND = 1000;

export const getEndTime = (timeLeft: number, now: number): number => {
  return now + timeLeft * MS_PER_SECOND;
};

export const getTimeLeft = (endtime: number, now: number): number => {
  const timeLeft = (endtime - now) / MS_PER_SECOND;
  return Math.max(timeLeft, 0);
};
