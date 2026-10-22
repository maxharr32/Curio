import { useState } from 'react';

const PATH = 'M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z';

/** One star, filled from 0 to 1 (so 0.5 is a half star). */
export function Star({ fill, size = 20 }: { fill: number; size?: number }) {
  return (
    <span className="star" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 24 24" width={size} height={size}>
        <path d={PATH} className="star-bg" />
      </svg>
      <span className="star-fill" style={{ width: `${Math.max(0, Math.min(1, fill)) * 100}%` }}>
        <svg viewBox="0 0 24 24" width={size} height={size}>
          <path d={PATH} />
        </svg>
      </span>
    </span>
  );
}

/** A single filled star, used next to numbers on tiles. */
export function StarIcon({ size = 16 }: { size?: number }) {
  return <Star fill={1} size={size} />;
}

export function StarsDisplay({ value, size = 22 }: { value: number; size?: number }) {
  return (
    <span className="stars" role="img" aria-label={`${value.toFixed(1)} out of 5`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} fill={value - i} size={size} />
      ))}
    </span>
  );
}

/**
 * Half-star rating input. Built from native radio buttons, so it is one tab
 * stop and the arrow keys move between values.
 */
export function StarsInput({
  value,
  onChange,
  name,
  size = 36,
}: {
  value: number;
  onChange: (v: number) => void;
  name: string;
  size?: number;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const shown = hover ?? value;
  return (
    <div className="stars-input" role="radiogroup" aria-label="Your rating" onMouseLeave={() => setHover(null)}>
      {[0, 1, 2, 3, 4].map((i) => (
        <span className="star-input" key={i}>
          <Star fill={shown - i} size={size} />
          {[0.5, 1].map((h) => {
            const v = i + h;
            return (
              <label key={v} className={`half ${h === 0.5 ? 'left' : 'right'}`} onMouseEnter={() => setHover(v)}>
                <input
                  type="radio"
                  className="sr-only"
                  name={name}
                  value={v}
                  checked={value === v}
                  onChange={() => onChange(v)}
                  aria-label={`${v} ${v === 1 ? 'star' : 'stars'}`}
                />
              </label>
            );
          })}
        </span>
      ))}
    </div>
  );
}
