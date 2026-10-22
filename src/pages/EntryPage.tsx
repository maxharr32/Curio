import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Cover } from '../components/Cover';
import { StarsDisplay, StarsInput } from '../components/Stars';
import { TYPES } from '../config';
import { formatScore, scoreOf } from '../lib/score';
import { store } from '../lib/storage';
import { useData } from '../lib/useData';
import { useTitle } from '../lib/useTitle';
import type { Entry, Rating } from '../types';
import { NotFound } from './NotFound';

export function EntryPage() {
  const { id } = useParams();
  const { entries, ratingsById } = useData();
  const entry = entries.find((e) => e.id === id);
  useTitle(entry?.name);
  if (!entry) return <NotFound />;
  return <EntryView key={entry.id} entry={entry} mine={ratingsById.get(entry.id)} />;
}

function EntryView({ entry, mine }: { entry: Entry; mine?: Rating }) {
  const navigate = useNavigate();
  const type = TYPES[entry.type];
  const { avg, count } = scoreOf(entry, mine);

  const [score, setScore] = useState(mine?.score ?? 0);
  const [review, setReview] = useState(mine?.review ?? '');
  const [saved, setSaved] = useState(false);

  const facts = type.fields.filter((f) => entry.fields[f.key]);
  const added = new Date(entry.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  function saveRating() {
    if (score <= 0) return;
    store.setRating(entry.id, score, review);
    setSaved(true);
  }

  function removeRating() {
    store.removeRating(entry.id);
    setScore(0);
    setReview('');
    setSaved(false);
  }

  function deleteEntry() {
    if (window.confirm(`Delete “${entry.name}” and your rating? This cannot be undone.`)) {
      store.deleteEntry(entry.id);
      navigate('/');
    }
  }

  return (
    <div className="container page">
      <p>
        <Link to="/" className="back-link">
          ← Browse
        </Link>
      </p>

      <div className="entry-layout">
        <div className="entry-cover">
          <Cover entry={entry} size="hero" />
        </div>

        <div className="entry-main">
          <div className="badge-row">
            <span className="badge badge-solid" style={{ background: type.color }}>
              {type.label}
            </span>
            <span className="badge badge-light">{entry.status === 'verified' ? 'Verified' : 'Unverified'}</span>
          </div>

          <h1 className="entry-title">
            {entry.name}
            {entry.disambiguator ? <span className="entry-dis"> ({entry.disambiguator})</span> : null}
          </h1>

          {entry.description ? <p className="entry-desc">{entry.description}</p> : <p className="muted">No description yet.</p>}

          {facts.length > 0 ? (
            <dl className="facts">
              {facts.map((f) => (
                <div key={f.key}>
                  <dt>{f.label}</dt>
                  <dd>{entry.fields[f.key]}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          {entry.tags.length > 0 ? (
            <ul className="tags" aria-label="Tags">
              {entry.tags.map((t) => (
                <li key={t}>
                  <Link to={`/?q=${encodeURIComponent(t)}`}>#{t}</Link>
                </li>
              ))}
            </ul>
          ) : null}

          {entry.sourceUrl ? (
            <p>
              <a href={entry.sourceUrl} target="_blank" rel="noopener noreferrer">
                Source ↗
              </a>
            </p>
          ) : null}

          <section className="panel" aria-labelledby="community-heading">
            <h2 className="eyebrow" id="community-heading">
              Community score
            </h2>
            {avg === null ? (
              <p className="muted">Nobody has rated this yet. Be the first.</p>
            ) : (
              <p className="score-line">
                <span className="score-big">{formatScore(avg)}</span>
                <StarsDisplay value={avg} />
                <span className="muted">
                  {count} {count === 1 ? 'rating' : 'ratings'}
                </span>
              </p>
            )}
          </section>

          <section className="panel" aria-labelledby="your-heading">
            <h2 className="eyebrow" id="your-heading">
              Your rating
            </h2>
            <StarsInput
              name={`rating-${entry.id}`}
              value={score}
              onChange={(v) => {
                setScore(v);
                setSaved(false);
              }}
            />
            <p className="muted">{score > 0 ? `${score.toFixed(1)} out of 5` : 'Tap a star. Left half of a star is a half point.'}</p>
            <div className="field">
              <label htmlFor="review">Review (optional)</label>
              <textarea
                id="review"
                rows={3}
                value={review}
                onChange={(e) => {
                  setReview(e.target.value);
                  setSaved(false);
                }}
              />
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn-primary" onClick={saveRating} disabled={score <= 0}>
                {mine ? 'Update rating' : 'Save rating'}
              </button>
              {mine ? (
                <button type="button" className="btn btn-outline" onClick={removeRating}>
                  Remove rating
                </button>
              ) : null}
              <span role="status" className="saved">
                {saved ? 'Saved' : ''}
              </span>
            </div>
          </section>

          <div className="form-actions">
            <Link to={`/entry/${entry.id}/edit`} className="btn btn-outline">
              Edit entry
            </Link>
            <button type="button" className="btn btn-danger" onClick={deleteEntry}>
              Delete entry
            </button>
          </div>
          <p className="hint">Added {added}</p>
        </div>
      </div>
    </div>
  );
}
