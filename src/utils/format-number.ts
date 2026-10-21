export const formatNumber = (value: number): string =>
  value < 0 ? `−${Math.abs(value)}` : String(value);
