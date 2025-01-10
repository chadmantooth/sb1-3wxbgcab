// Time-related utilities
export function getMsElapsed(startTime: number): number {
  return Date.now() - startTime;
}

export function getLastDayTimestamp(): Date {
  return new Date(Date.now() - 24 * 60 * 60 * 1000);
}