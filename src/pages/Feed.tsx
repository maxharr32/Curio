import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { EntryTile } from '../components/EntryTile';
import { TYPES, TYPE_ORDER } from '../config';
import { normalise } from '../lib/similar';
import { scoreOf } from '../lib/score';
import { useData } from '../lib/useData';
import { useTitle } from '../lib/useTitle';
import type { EntryType } from '../types';

type SortKey = 'new' | 'top' | 'az';
const SORTS: { key: SortKey; label: string }[] = [
  { key: 'new', label: 'Newest' },
  { key: 'top', label: 'Top rated' },
  { key: 'az', label: 'A to Z' },
];

export function Feed() {
  useTitle();
  const { entries, ratingsById } = useData();
  const [params, setParams] = useSearchParams();

  const typeParam = params.get('type');
  const type: EntryType | null = typeParam && typeParam in TYPES ? (typeParam as EntryType) : null;
  const q = params.get('q') ?? '';
  const sortParam = params.get('sort');
  const sort: SortKey = SORTS.some((s) => s.key === sortParam) ? (sortParam as SortKey) : 'new';

  function setParam(key: string, value: string | null) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  }

  const shown = useMemo(() => {
    const needle = normalise(q);
    let list = entries.filter((e) => !type || e.type === type);
    if (needle) {
      list = list.filter((e) =>
        normalise(
          [e.name, e.disambiguator, e.description, e.tags.join(' '), Object.values(e.fields).join(' ')]
            .filter(Boolean)
            .join(' '),
        ).includes(needle),
      );
    }
    const avg = (id: string) => {
      const e = entries.find((x) => x.id === id);
      return e ? (scoreOf(e, ratingsById.get(id)).avg ?? -1) : -1;
    };
    const sorted = [...list];
    if (sort === 'top') sorted.sort((a, b) => avg(b.id) - avg(a.id));
    else if (sort === 'az') sorted.sort((a, b) => a.name.localeCompare(b.name));
    else sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return sorted;
  }, [entries, ratingsById, type, q, sort]);

  const addHref = `/add?${new URLSearchParams({ ...(q ? { name: q } : {}), ...(type ? { type } : {}) }).toString()}`;

  return (
    <div className="container page">
      <h1 className="page-title">Browse</h1>
      <p className="lede">Everything in the catalogue. Rate what you know, add what is missing.</p>

      <div className="toolbar">
        <div className="chips" role="group" aria-label="Filter by type">
          <button type="button" className="chip" aria-pressed={!type} onClick={() => setParam('type', null)}>
            All
          </button>
          {TYPE_ORDER.map((t) => (
            <button
              key={t}
              type="button"
              className="chip"
              aria-pressed={type === t}
              onClick={() => setParam('type', type === t ? null : t)}
            >
              {TYPES[t].plural}
            </button>
          ))}
        </div>
        <div className="toolbar-right">
          <label className="sr-only" htmlFor="q">
            Search the catalogue
          </label>
          <input
            id="q"
            type="search"
            className="search"
            placeholder="Search names, tags, creators"
            value={q}
            onChange={(e) => setParam('q', e.target.value)}
          />
          <label className="sr-only" htmlFor="sort">
            Sort by
          </label>
          <select id="sort" className="select" value={sort} onChange={(e) => setParam('sort', e.target.value)}>
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="count" aria-live="polite">
        {shown.length} {shown.length === 1 ? 'entry' : 'entries'}
        {q ? (
          <>
            {' '}
            · Can’t find it? <Link to={addHref}>Add “{q}”</Link>
          </>
        ) : null}
      </p>

      {shown.length > 0 ? (
        <div className="masonry">
          {shown.map((e) => (
            <EntryTile key={e.id} entry={e} mine={ratingsById.get(e.id)} to={`/entry/${e.id}`} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2 className="section-title">Nothing here yet</h2>
          <p className="lede">
            {q ? `No entries match “${q}”.` : 'No entries in this category yet.'} Be the first to add it.
          </p>
          <Link to={addHref} className="btn btn-primary">
            + Add entry
          </Link>
        </div>
      )}
    </div>
  );
}
