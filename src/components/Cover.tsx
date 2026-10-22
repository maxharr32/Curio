import { useState } from 'react';
import { TYPES } from '../config';
import type { Entry } from '../types';

type CoverEntry = Pick<Entry, 'type' | 'name' | 'imageUrl'>;

/**
 * Shows the entry's image if it has one and it loads. Otherwise a block of the
 * type's colour with a big letter, which is also the plan's fallback when no
 * licensed image exists.
 */
export function Cover({
  entry,
  size = 'tile',
  height,
}: {
  entry: CoverEntry;
  size?: 'tile' | 'hero';
  height?: number;
}) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const showImage = Boolean(entry.imageUrl) && failedUrl !== entry.imageUrl;
  const letter = entry.name.trim().charAt(0).toUpperCase() || '?';

  return (
    <div className={`cover cover-${size}`} style={{ background: TYPES[entry.type].color, height }}>
      {showImage ? (
        <img
          src={entry.imageUrl}
          alt={size === 'hero' ? entry.name : ''}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setFailedUrl(entry.imageUrl ?? null)}
        />
      ) : (
        <span className="cover-letter" aria-hidden="true">
          {letter}
        </span>
      )}
    </div>
  );
}
