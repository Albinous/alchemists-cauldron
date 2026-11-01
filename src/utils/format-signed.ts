export const formatSigned = (value: number): string =>
  value < 0 ? `−${Math.abs(value)}` : value > 0 ? `+${value}` : String(value);
