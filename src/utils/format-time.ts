const SECONDS_PER_MINUTE = 60;

export const formatTime = (time: number): string => {
  const totalSeconds = Math.ceil(time);
  const minutes = String(Math.floor(totalSeconds / SECONDS_PER_MINUTE));
  const seconds = String(totalSeconds % SECONDS_PER_MINUTE);

  return `${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
};
