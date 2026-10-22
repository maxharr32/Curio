import type { Entry, Rating } from '../types';

export interface Score {
  avg: number | null;
  count: number;
}

/**
 * Community score = the placeholder sample score plus your own rating.
 * When there is a real back end, all ratings live in one table and this
 * becomes a simple average.
 */
export function scoreOf(entry: Entry, mine?: Rating): Score {
  const sampleCount = entry.sample?.count ?? 0;
  const sampleTotal = (entry.sample?.avg ?? 0) * sampleCount;
  const count = sampleCount + (mine ? 1 : 0);
  if (count === 0) return { avg: null, count: 0 };
  return { avg: (sampleTotal + (mine?.score ?? 0)) / count, count };
}

export function formatScore(avg: number | null): string {
  return avg === null ? '–' : avg.toFixed(1);
}
