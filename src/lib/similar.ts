import type { Entry } from '../types';

/** Lowercase, strip accents and punctuation, drop leading articles: "The Nike® logo" -> "nike logo". */
export function normalise(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\b(the|a|an)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function bigrams(s: string): Map<string, number> {
  const map = new Map<string, number>();
  for (let i = 0; i < s.length - 1; i++) {
    const g = s.slice(i, i + 2);
    map.set(g, (map.get(g) ?? 0) + 1);
  }
  return map;
}

/** 0 to 1. Dice coefficient on letter pairs, with a boost when one name contains the other. */
export function similarity(a: string, b: string): number {
  const x = normalise(a);
  const y = normalise(b);
  if (!x || !y) return 0;
  if (x === y) return 1;
  const [short, long] = x.length <= y.length ? [x, y] : [y, x];
  if (short.length >= 3 && long.includes(short)) return 0.8;
  const bx = bigrams(x);
  const by = bigrams(y);
  let overlap = 0;
  let total = 0;
  bx.forEach((n) => (total += n));
  by.forEach((n, g) => {
    total += n;
    overlap += Math.min(n, bx.get(g) ?? 0);
  });
  return total === 0 ? 0 : (2 * overlap) / total;
}

export interface SimilarMatch {
  entry: Entry;
  score: number;
  exact: boolean;
}

/**
 * Cheap, in-browser version of the duplicate check from the plan: normalised
 * names plus fuzzy matching. Later stages (embeddings, an LLM judge) would run
 * server-side after the entry is submitted.
 */
export function findSimilar(
  name: string,
  entries: Entry[],
  opts: { excludeId?: string; threshold?: number; limit?: number } = {},
): SimilarMatch[] {
  const { excludeId, threshold = 0.6, limit = 5 } = opts;
  if (normalise(name).length < 2) return [];
  return entries
    .filter((e) => e.id !== excludeId)
    .map((entry) => {
      const score = Math.max(
        similarity(name, entry.name),
        entry.disambiguator ? similarity(name, `${entry.name} ${entry.disambiguator}`) : 0,
      );
      return { entry, score, exact: score === 1 };
    })
    .filter((m) => m.score >= threshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
