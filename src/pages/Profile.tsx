import { useMemo, useState, type ChangeEvent, type CSSProperties } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { EntryTile } from '../components/EntryTile';
import { TYPES, TYPE_ORDER } from '../config';
import { store } from '../lib/storage';
import { useData } from '../lib/useData';
import { useTitle } from '../lib/useTitle';
import type { EntryType } from '../types';

export function Profile() {
  useTitle('Profile');
  const { entries, ratings, ratingsById } = useData();
  const [params] = useSearchParams();
  const [message, setMessage] = useState('');

  const typeParam = params.get('type');
  const selected: EntryType | null = typeParam && typeParam in TYPES ? (typeParam as EntryType) : null;

  const rated = useMemo(
    () =>
      entries
        .filter((e) => ratingsById.has(e.id))
        .sort((a, b) => {
          const ra = ratingsById.get(a.id)!;
          const rb = ratingsById.get(b.id)!;
          return rb.score - ra.score || rb.updatedAt.localeCompare(ra.updatedAt);
        }),
    [entries, ratingsById],
  );

  const perType = TYPE_ORDER.map((t) => {
    const list = rated.filter((e) => e.type === t);
    const avg = list.length ? list.reduce((sum, e) => sum + ratingsById.get(e.id)!.score, 0) / list.length : null;
    return { type: t, count: list.length, avg };
  });
  const categoriesUsed = perType.filter((p) => p.count > 0).length;
  const shown = selected ? rated.filter((e) => e.type === selected) : rated;

  function download() {
    const blob = new Blob([store.exportJson()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rateroom-data.json';
    a.click();
    URL.revokeObjectURL(url);
    setMessage('Exported rateroom-data.json.');
  }

  async function onImport(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!window.confirm('Importing replaces everything currently saved in this browser. Continue?')) return;
    const result = store.importJson(await file.text());
    setMessage(result.ok ? `Imported ${result.entries} entries and ${result.ratings} ratings.` : result.error);
  }

  function reset() {
    if (window.confirm('Reset to the sample entries? Your added entries and ratings will be removed.')) {
      store.resetToSample();
      setMessage('Reset to sample data.');
    }
  }

  return (
    <>
      <section className="profile-hero">
        <div className="container profile-hero-inner">
          <div className="avatar" aria-hidden="true">
            Y
          </div>
          <div>
            <p className="eyebrow">Local profile</p>
            <h1 className="page-title">You</h1>
            <p className="lede-on-blue">Saved in this browser only. Accounts come later.</p>
            <div className="stats">
              <div>
                <span className="stat-num">{ratings.length}</span>
                <span className="stat-label">Rated</span>
              </div>
              <div>
                <span className="stat-num">{categoriesUsed}</span>
                <span className="stat-label">{categoriesUsed === 1 ? 'Category' : 'Categories'}</span>
              </div>
              <div>
                <span className="stat-num">{entries.length}</span>
                <span className="stat-label">In catalogue</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container page">
        <h2 className="section-title">Rated in</h2>
        <p className="lede">Pick a category to see everything you have rated there.</p>
        <div className="cat-grid">
          {perType.map((p) => (
            <Link
              key={p.type}
              to={selected === p.type ? '/profile' : `/profile?type=${p.type}`}
              className={`cat-card${selected === p.type ? ' is-selected' : ''}`}
              style={{ '--c': TYPES[p.type].color } as CSSProperties}
              aria-current={selected === p.type ? 'true' : undefined}
            >
              <span className="cat-name">{TYPES[p.type].plural}</span>
              <span className="cat-count">{p.count}</span>
              <span className="cat-avg">
                {p.avg === null ? 'Nothing rated yet' : `Your average ${p.avg.toFixed(1)}`}
              </span>
            </Link>
          ))}
        </div>

        <h2 className="section-title">{selected ? `Your ${TYPES[selected].plural.toLowerCase()}` : 'Everything you have rated'}</h2>
        {shown.length > 0 ? (
          <div className="masonry">
            {shown.map((e) => (
              <EntryTile key={e.id} entry={e} mine={ratingsById.get(e.id)} to={`/entry/${e.id}`} />
            ))}
          </div>
        ) : (
          <div className="empty">
            <p className="lede">
              {selected ? `You have not rated any ${TYPES[selected].plural.toLowerCase()} yet.` : 'You have not rated anything yet.'}
            </p>
            <Link to={selected ? `/?type=${selected}` : '/'} className="btn btn-primary">
              Browse and rate
            </Link>
          </div>
        )}

        <section className="panel data-panel" aria-labelledby="data-heading">
          <h2 className="eyebrow" id="data-heading">
            Your data
          </h2>
          <p className="muted">
            Entries and ratings live in this browser. Export a copy to keep it safe or to move it to another device or a
            real back end later.
          </p>
          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={download}>
              Export JSON
            </button>
            <label className="btn btn-outline file-btn">
              Import JSON
              <input type="file" accept="application/json,.json" className="sr-only" onChange={onImport} />
            </label>
            <button type="button" className="btn btn-danger" onClick={reset}>
              Reset to sample data
            </button>
          </div>
          <p role="status" className="saved">
            {message}
          </p>
        </section>
      </div>
    </>
  );
}
