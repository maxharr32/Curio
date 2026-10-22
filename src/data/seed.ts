import type { DataFile, Entry, EntryType } from '../types';

/**
 * Sample entries so the UI has something to show.
 * Descriptions are written fresh and kept short. Scores are made up for UI work,
 * so check facts before relying on them. There are deliberately no images:
 * entries without one get a coloured letter tile.
 */
const AT = '2026-10-22T09:00:00.000Z';

interface Seed {
  id: string;
  type: EntryType;
  name: string;
  disambiguator?: string;
  description: string;
  tags: string[];
  fields: Record<string, string>;
  sample: { avg: number; count: number };
}

const seeds: Seed[] = [
  {
    id: 'seed-ikea',
    type: 'brand',
    name: 'IKEA',
    description: 'Swedish home furnishings company known for flat-pack furniture and its blue and yellow identity.',
    tags: ['furniture', 'retail'],
    fields: { founded: '1943', country: 'Sweden' },
    sample: { avg: 4.4, count: 38 },
  },
  {
    id: 'seed-muji',
    type: 'brand',
    name: 'Muji',
    description: 'Japanese retailer of plain, unbranded household goods, clothing and stationery.',
    tags: ['retail', 'minimal'],
    fields: { founded: '1980', country: 'Japan' },
    sample: { avg: 4.1, count: 21 },
  },
  {
    id: 'seed-lego',
    type: 'brand',
    name: 'Lego',
    description: 'Danish toy maker built around interlocking plastic bricks.',
    tags: ['toys'],
    fields: { founded: '1932', country: 'Denmark' },
    sample: { avg: 4.7, count: 52 },
  },
  {
    id: 'seed-patagonia',
    type: 'brand',
    name: 'Patagonia',
    description: 'American outdoor clothing company with a mountain skyline logo.',
    tags: ['clothing', 'outdoor'],
    fields: { founded: '1973', country: 'United States' },
    sample: { avg: 4.2, count: 17 },
  },
  {
    id: 'seed-sherlock-holmes',
    type: 'character',
    name: 'Sherlock Holmes',
    description: 'Detective of 221B Baker Street, known for deerstalker, pipe and sharp deduction.',
    tags: ['detective', 'literature'],
    fields: { appearsIn: 'A Study in Scarlet', creator: 'Arthur Conan Doyle' },
    sample: { avg: 4.7, count: 44 },
  },
  {
    id: 'seed-alice',
    type: 'character',
    name: 'Alice',
    disambiguator: 'Wonderland',
    description: 'The curious girl who follows a white rabbit down a hole in Lewis Carroll’s story.',
    tags: ['literature', 'fantasy'],
    fields: { appearsIn: 'Alice’s Adventures in Wonderland', creator: 'Lewis Carroll' },
    sample: { avg: 4.3, count: 29 },
  },
  {
    id: 'seed-dracula',
    type: 'character',
    name: 'Dracula',
    description: 'The vampire count at the centre of Bram Stoker’s 1897 novel.',
    tags: ['horror', 'literature'],
    fields: { appearsIn: 'Dracula', creator: 'Bram Stoker' },
    sample: { avg: 3.9, count: 26 },
  },
  {
    id: 'seed-robin-hood',
    type: 'character',
    name: 'Robin Hood',
    description: 'Legendary English outlaw who takes from the rich to give to the poor.',
    tags: ['folklore'],
    fields: { appearsIn: 'English ballads', creator: 'Folklore' },
    sample: { avg: 3.8, count: 15 },
  },
  {
    id: 'seed-penguin-books',
    type: 'logo',
    name: 'Penguin Books',
    description: 'A small penguin mark on the spines and covers of the British publisher’s paperbacks.',
    tags: ['publishing', 'mark'],
    fields: { owner: 'Penguin Books', year: '1935', designer: 'Edward Young' },
    sample: { avg: 4.5, count: 19 },
  },
  {
    id: 'seed-fedex',
    type: 'logo',
    name: 'FedEx',
    description: 'Wordmark with an arrow hidden in the space between the E and the x.',
    tags: ['wordmark', 'logistics'],
    fields: { owner: 'FedEx', year: '1994', designer: 'Lindon Leader' },
    sample: { avg: 4.3, count: 33 },
  },
  {
    id: 'seed-olympic-rings',
    type: 'logo',
    name: 'Olympic rings',
    description: 'Five interlocking rings representing the continents, used by the Olympic movement.',
    tags: ['sport', 'symbol'],
    fields: { owner: 'International Olympic Committee', year: '1913', designer: 'Pierre de Coubertin' },
    sample: { avg: 4.0, count: 24 },
  },
  {
    id: 'seed-nasa-worm',
    type: 'logo',
    name: 'NASA worm',
    description: 'A red wordmark with a stylised, bar-less A, used from 1975 to 1992 and again from 2020.',
    tags: ['wordmark', 'space'],
    fields: { owner: 'NASA', year: '1975', designer: 'Danne & Blackburn' },
    sample: { avg: 4.5, count: 31 },
  },
  {
    id: 'seed-braun-et66',
    type: 'product',
    name: 'Braun ET66',
    disambiguator: 'calculator',
    description: 'Pocket calculator with a grid of colour-coded keys, a classic of minimal product design.',
    tags: ['calculator', 'minimal'],
    fields: { designer: 'Dieter Rams and Dietrich Lubs', year: '1987', maker: 'Braun' },
    sample: { avg: 4.8, count: 28 },
  },
  {
    id: 'seed-panton-chair',
    type: 'product',
    name: 'Panton Chair',
    description: 'Stackable cantilever chair moulded from a single piece of plastic.',
    tags: ['chair', 'furniture'],
    fields: { designer: 'Verner Panton', year: '1967', maker: 'Vitra' },
    sample: { avg: 4.2, count: 18 },
  },
  {
    id: 'seed-anglepoise',
    type: 'product',
    name: 'Anglepoise lamp',
    description: 'Desk lamp with a spring-balanced jointed arm that holds any position.',
    tags: ['lighting', 'desk'],
    fields: { designer: 'George Carwardine', year: '1935', maker: 'Anglepoise' },
    sample: { avg: 4.3, count: 22 },
  },
  {
    id: 'seed-polaroid-onestep',
    type: 'product',
    name: 'Polaroid OneStep',
    description: 'Point-and-shoot instant camera that prints a photo as you take it.',
    tags: ['camera', 'instant'],
    fields: { year: '1977', maker: 'Polaroid' },
    sample: { avg: 4.1, count: 20 },
  },
];

/** Interleave types (brand, character, logo, product, brand, ...) so the masonry feed mixes colours. */
function interleave(list: Seed[]): Seed[] {
  const order: EntryType[] = ['brand', 'character', 'logo', 'product'];
  const groups = order.map((t) => list.filter((s) => s.type === t));
  const out: Seed[] = [];
  const longest = Math.max(...groups.map((g) => g.length));
  for (let i = 0; i < longest; i++) groups.forEach((g) => g[i] && out.push(g[i]));
  return out;
}

export function seedData(): DataFile {
  const entries: Entry[] = interleave(seeds).map((s) => ({
    ...s,
    status: 'verified',
    createdAt: AT,
    updatedAt: AT,
  }));
  return { version: 1, entries, ratings: [] };
}
