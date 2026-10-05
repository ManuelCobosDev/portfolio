/** Whole years elapsed since `date`, with a minimum of 1. */
export function fullYearsSince(date: string, now: Date = new Date()): number {
  const start = new Date(date);
  let years = now.getFullYear() - start.getFullYear();
  const monthDiff = now.getMonth() - start.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < start.getDate())) {
    years -= 1;
  }
  return Math.max(1, years);
}
