import { TYPES } from '../config';
import { seedData } from '../data/seed';
import type { DataFile, Entry, NewEntry, Rating } from '../types';

/**
 * The only file that knows where data lives. Today: this browser's localStorage.
 * To move to a real back end (Supabase, an API), keep these method names and
 * replace the insides. Pages and components never touch localStorage directly.
 */
const KEY = 'rateroom:v1';

type Listener = () => void;
const listeners = new Set<Listener>();

function isEntry(x: unknown): x is Entry {
  if (!x || typeof x !== 'object') return false;
  const e = x as Record<string, unknown>;
  return (
    typeof e.id === 'string' &&
    typeof e.name === 'string' &&
    typeof e.type === 'string' &&
    e.type in TYPES
  );
}

function isRating(x: unknown): x is Rating {
  if (!x || typeof x !== 'object') return false;
  const r = x as Record<string, unknown>;
  return typeof r.entryId === 'string' && typeof r.score === 'number';
}

/** Returns a clean DataFile, or null if the input does not look like one. */
function parse(text: string): DataFile | null {
  try {
    const raw = JSON.parse(text) as Partial<DataFile>;
    if (!raw || !Array.isArray(raw.entries) || !Array.isArray(raw.ratings)) return null;
    const entries = raw.entries.filter(isEntry).map((e) => ({
      ...e,
      description: typeof e.description === 'string' ? e.description : '',
      tags: Array.isArray(e.tags) ? e.tags.filter((t) => typeof t === 'string') : [],
      fields: e.fields && typeof e.fields === 'object' ? e.fields : {},
      status: e.status === 'verified' ? ('verified' as const) : ('unverified' as const),
    }));
    const ids = new Set(entries.map((e) => e.id));
    const ratings = raw.ratings.filter(isRating).filter((r) => ids.has(r.entryId));
    return { version: 1, entries, ratings };
  } catch {
    return null;
  }
}

function load(): DataFile {
  try {
    const text = localStorage.getItem(KEY);
    if (text) {
      const data = parse(text);
      if (data) return data;
    }
  } catch {
    /* storage unavailable: fall through to sample data */
  }
  return seedData();
}

let state: DataFile = load();

function commit(next: DataFile) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* private window or full storage: keep working in memory */
  }
  listeners.forEach((l) => l());
}

const now = () => new Date().toISOString();
const newId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `e-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const store = {
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  getSnapshot(): DataFile {
    return state;
  },

  addEntry(input: NewEntry): Entry {
    const entry: Entry = { ...input, id: newId(), createdAt: now(), updatedAt: now() };
    commit({ ...state, entries: [entry, ...state.entries] });
    return entry;
  },

  updateEntry(id: string, patch: Partial<NewEntry>) {
    commit({
      ...state,
      entries: state.entries.map((e) => (e.id === id ? { ...e, ...patch, updatedAt: now() } : e)),
    });
  },

  deleteEntry(id: string) {
    commit({
      ...state,
      entries: state.entries.filter((e) => e.id !== id),
      ratings: state.ratings.filter((r) => r.entryId !== id),
    });
  },

  setRating(entryId: string, score: number, review: string) {
    const rating: Rating = { entryId, score, review: review.trim(), updatedAt: now() };
    commit({ ...state, ratings: [rating, ...state.ratings.filter((r) => r.entryId !== entryId)] });
  },

  removeRating(entryId: string) {
    commit({ ...state, ratings: state.ratings.filter((r) => r.entryId !== entryId) });
  },

  exportJson(): string {
    return JSON.stringify(state, null, 2);
  },

  importJson(text: string): { ok: true; entries: number; ratings: number } | { ok: false; error: string } {
    const data = parse(text);
    if (!data) return { ok: false, error: 'That file is not a valid export.' };
    commit(data);
    return { ok: true, entries: data.entries.length, ratings: data.ratings.length };
  },

  resetToSample() {
    commit(seedData());
  },
};
