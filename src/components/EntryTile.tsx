import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { TYPES } from '../config';
import { formatScore, scoreOf } from '../lib/score';
import type { Entry, Rating } from '../types';
import { Cover } from './Cover';
import { StarIcon } from './Stars';

const HEIGHTS = [180, 220, 260, 300];

/** Stable pseudo-random height so the masonry feed looks varied but never jumps around. */
function heightFor(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return HEIGHTS[h % HEIGHTS.length];
}

export function EntryTile({ entry, mine, to }: { entry: Entry; mine?: Rating; to?: string }) {
  const type = TYPES[entry.type];
  const { avg, count } = scoreOf(entry, mine);

  const inner = (
    <>
      <div className="tile-cover">
        <Cover entry={entry} height={heightFor(entry.id)} />
        <span className="badge tile-badge">{type.label}</span>
      </div>
      <div className="tile-body">
        <h3 className="tile-name">
          {entry.name || 'Untitled'}
          {entry.disambiguator ? <span className="tile-dis"> ({entry.disambiguator})</span> : null}
        </h3>
        <p className="tile-meta">
          <StarIcon size={15} />
          <strong>{formatScore(avg)}</strong>
          <span>{count === 0 ? 'Not rated yet' : `${count} ${count === 1 ? 'rating' : 'ratings'}`}</span>
        </p>
        {mine ? <p className="tile-mine">You rated it {mine.score.toFixed(1)}</p> : null}
        {entry.description ? <p className="tile-desc">{entry.description}</p> : null}
      </div>
    </>
  );

  const style = { '--c': type.color } as CSSProperties;
  return to ? (
    <Link className="tile" to={to} style={style}>
      {inner}
    </Link>
  ) : (
    <div className="tile" style={style}>
      {inner}
    </div>
  );
}
