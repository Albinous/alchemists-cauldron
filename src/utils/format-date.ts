const padTwoDigits = (value: number): string => {
  return String(value).padStart(2, '0');
};

export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hour = date.getHours();
  const minute = date.getMinutes();

  return `${padTwoDigits(day)}.${padTwoDigits(month)}.${year} ${padTwoDigits(hour)}:${padTwoDigits(minute)}`;
};
