import type { EntryType } from './types';

/** Change the name here and it updates everywhere in the UI. */
export const APP_NAME = 'Rateroom';

export interface FieldDef {
  key: string;
  label: string;
  placeholder?: string;
}

export interface TypeDef {
  label: string;
  plural: string;
  /** Bright colour used for this type's tiles, tags and highlights. */
  color: string;
  /** Template fields: what an entry of this type asks for. */
  fields: FieldDef[];
}

/**
 * Entry types and their templates. To add a type: add it to EntryType in
 * types.ts, then add a definition here and to TYPE_ORDER.
 */
export const TYPES: Record<EntryType, TypeDef> = {
  brand: {
    label: 'Brand',
    plural: 'Brands',
    color: '#FFE600',
    fields: [
      { key: 'founded', label: 'Founded', placeholder: '1943' },
      { key: 'country', label: 'Country', placeholder: 'Sweden' },
    ],
  },
  character: {
    label: 'Character',
    plural: 'Characters',
    color: '#FF2E93',
    fields: [
      { key: 'appearsIn', label: 'Appears in', placeholder: 'Title of the book, show or game' },
      { key: 'creator', label: 'Created by', placeholder: 'Author or studio' },
    ],
  },
  logo: {
    label: 'Logo',
    plural: 'Logos',
    color: '#B8FF1F',
    fields: [
      { key: 'owner', label: 'Owner', placeholder: 'Company or organisation' },
      { key: 'year', label: 'Year', placeholder: '1935' },
      { key: 'designer', label: 'Designed by', placeholder: 'Person or studio' },
    ],
  },
  product: {
    label: 'Product',
    plural: 'Products',
    color: '#00E5FF',
    fields: [
      { key: 'designer', label: 'Designed by', placeholder: 'Person or studio' },
      { key: 'year', label: 'Year', placeholder: '1987' },
      { key: 'maker', label: 'Made by', placeholder: 'Manufacturer' },
    ],
  },
};

export const TYPE_ORDER: EntryType[] = ['brand', 'character', 'logo', 'product'];

export const DESCRIPTION_MAX = 280;
export const MAX_TAGS = 8;
