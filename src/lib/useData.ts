import { useMemo, useSyncExternalStore } from 'react';
import { store } from './storage';
import type { Rating } from '../types';

export function useData() {
  const data = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  const ratingsById = useMemo(() => {
    const map = new Map<string, Rating>();
    data.ratings.forEach((r) => map.set(r.entryId, r));
    return map;
  }, [data.ratings]);
  return { entries: data.entries, ratings: data.ratings, ratingsById };
}
