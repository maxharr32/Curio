export type EntryType = 'brand' | 'character' | 'logo' | 'product';
export type EntryStatus = 'unverified' | 'verified';

export interface Entry {
  id: string;
  type: EntryType;
  name: string;
  /** Short label that tells similar things apart, e.g. "film" or "element". */
  disambiguator?: string;
  description: string;
  /** Link only. Nothing is uploaded or hosted by this prototype. */
  imageUrl?: string;
  sourceUrl?: string;
  tags: string[];
  /** Template fields for this type (see config.ts), e.g. { founded: '1943' }. */
  fields: Record<string, string>;
  status: EntryStatus;
  /** Placeholder community score so the UI has something to show. Not real data. */
  sample?: { avg: number; count: number };
  createdAt: string;
  updatedAt: string;
}

export type NewEntry = Omit<Entry, 'id' | 'createdAt' | 'updatedAt'>;

export interface Rating {
  entryId: string;
  /** 0.5 to 5 in half steps. */
  score: number;
  review: string;
  updatedAt: string;
}

/** The whole local database, and the shape of an export file. */
export interface DataFile {
  version: 1;
  entries: Entry[];
  ratings: Rating[];
}
