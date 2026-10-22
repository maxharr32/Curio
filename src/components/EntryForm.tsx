import { useEffect, useId, useMemo, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { DESCRIPTION_MAX, MAX_TAGS, TYPES, TYPE_ORDER } from '../config';
import { findSimilar, normalise } from '../lib/similar';
import { useData } from '../lib/useData';
import type { Entry, EntryStatus, EntryType, NewEntry } from '../types';
import { EntryTile } from './EntryTile';

interface Props {
  initial?: Entry;
  prefillName?: string;
  prefillType?: EntryType;
  submitLabel: string;
  onSubmit: (entry: NewEntry) => void;
  onCancel: () => void;
}

function isHttpUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

function parseTags(text: string): string[] {
  const seen = new Set<string>();
  text
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)
    .forEach((t) => seen.add(t));
  return [...seen].slice(0, MAX_TAGS);
}

function useDebounced<T>(value: T, ms: number): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children}
      {hint ? (
        <p className="hint" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="error" id={`${id}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

const describedBy = (id: string, hint?: string, error?: string) =>
  [hint ? `${id}-hint` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ') || undefined;

export function EntryForm({ initial, prefillName, prefillType, submitLabel, onSubmit, onCancel }: Props) {
  const uid = useId();
  const { entries } = useData();

  const [type, setType] = useState<EntryType>(initial?.type ?? prefillType ?? 'brand');
  const [name, setName] = useState(initial?.name ?? prefillName ?? '');
  const [disambiguator, setDisambiguator] = useState(initial?.disambiguator ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? '');
  const [sourceUrl, setSourceUrl] = useState(initial?.sourceUrl ?? '');
  const [tagsText, setTagsText] = useState(initial?.tags.join(', ') ?? '');
  const [fields, setFields] = useState<Record<string, string>>(initial?.fields ?? {});
  const [status, setStatus] = useState<EntryStatus>(initial?.status ?? 'unverified');
  const [submitted, setSubmitted] = useState(false);

  const errors: Record<string, string> = {};
  if (!name.trim()) errors.name = 'Give it a name.';
  if (description.length > DESCRIPTION_MAX) errors.description = `Keep it under ${DESCRIPTION_MAX} characters.`;
  if (imageUrl.trim() && !isHttpUrl(imageUrl.trim())) errors.imageUrl = 'Use a full link starting with https://';
  if (sourceUrl.trim() && !isHttpUrl(sourceUrl.trim())) errors.sourceUrl = 'Use a full link starting with https://';
  const shown = submitted ? errors : {};

  // Cheap duplicate check while typing. Skipped when editing and the name has not changed.
  const unchanged = initial ? normalise(initial.name) === normalise(name) : false;
  const similar = useMemo(
    () => (unchanged ? [] : findSimilar(name, entries, { excludeId: initial?.id })),
    [name, entries, initial?.id, unchanged],
  );

  const tags = parseTags(tagsText);
  const trimmedImage = imageUrl.trim();
  const previewImage = useDebounced(isHttpUrl(trimmedImage) ? trimmedImage : undefined, 600);
  const draft: Entry = {
    id: 'preview',
    type,
    name: name.trim(),
    disambiguator: disambiguator.trim() || undefined,
    description: description.trim(),
    imageUrl: previewImage,
    tags,
    fields: {},
    status,
    sample: initial?.sample,
    createdAt: '',
    updatedAt: '',
  };

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    const first = (['name', 'description', 'imageUrl', 'sourceUrl'] as const).find((k) => errors[k]);
    if (first) {
      document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    const kept: Record<string, string> = {};
    TYPES[type].fields.forEach((f) => {
      const v = (fields[f.key] ?? '').trim();
      if (v) kept[f.key] = v;
    });
    onSubmit({
      type,
      name: name.trim(),
      disambiguator: disambiguator.trim() || undefined,
      description: description.trim(),
      imageUrl: trimmedImage || undefined,
      sourceUrl: sourceUrl.trim() || undefined,
      tags,
      fields: kept,
      status,
      sample: initial?.sample,
    });
  }

  const id = (key: string) => `${uid}-${key}`;

  return (
    <form className="form-layout" onSubmit={handleSubmit} noValidate>
      <div className="form-main">
        <fieldset className="type-picker">
          <legend>Type</legend>
          <div className="type-options">
            {TYPE_ORDER.map((t) => (
              <label key={t} className="type-option" style={{ '--c': TYPES[t].color } as CSSProperties}>
                <input
                  type="radio"
                  className="sr-only"
                  name={id('type')}
                  value={t}
                  checked={type === t}
                  onChange={() => setType(t)}
                />
                <span>{TYPES[t].label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <Field id={id('name')} label="Name" error={shown.name}>
          <input
            id={id('name')}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={Boolean(shown.name)}
            aria-describedby={describedBy(id('name'), undefined, shown.name)}
            autoComplete="off"
            required
          />
        </Field>

        {similar.length > 0 ? (
          <div className="notice" role="status">
            <p>
              <strong>{similar[0].exact ? 'This name already exists.' : 'Something similar already exists.'}</strong>{' '}
              If it is the same thing, rate or improve that entry instead of adding a duplicate.
            </p>
            <ul>
              {similar.map((m) => (
                <li key={m.entry.id}>
                  <Link to={`/entry/${m.entry.id}`} target="_blank" rel="noopener noreferrer">
                    {m.entry.name}
                    {m.entry.disambiguator ? ` (${m.entry.disambiguator})` : ''}
                  </Link>{' '}
                  <span className="muted">
                    {TYPES[m.entry.type].label} · {m.exact ? 'exact match' : `${Math.round(m.score * 100)}% similar`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <Field
          id={id('disambiguator')}
          label="Disambiguator (optional)"
          hint="A word that tells similar things apart, like “film”, “element” or “1989”."
        >
          <input
            id={id('disambiguator')}
            type="text"
            value={disambiguator}
            onChange={(e) => setDisambiguator(e.target.value)}
            aria-describedby={describedBy(id('disambiguator'), 'x')}
            autoComplete="off"
          />
        </Field>

        <Field
          id={id('description')}
          label="Description"
          hint={`${description.length} / ${DESCRIPTION_MAX}. One or two plain sentences, in your own words.`}
          error={shown.description}
        >
          <textarea
            id={id('description')}
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            aria-invalid={Boolean(shown.description)}
            aria-describedby={describedBy(id('description'), 'x', shown.description)}
          />
        </Field>

        <div className="field-grid">
          {TYPES[type].fields.map((f) => (
            <Field key={f.key} id={id(`f-${f.key}`)} label={f.label}>
              <input
                id={id(`f-${f.key}`)}
                type="text"
                value={fields[f.key] ?? ''}
                placeholder={f.placeholder}
                onChange={(e) => setFields({ ...fields, [f.key]: e.target.value })}
                autoComplete="off"
              />
            </Field>
          ))}
        </div>

        <Field
          id={id('tags')}
          label="Tags"
          hint={`Up to ${MAX_TAGS}, separated by commas. ${tags.length ? `Saved as: ${tags.join(', ')}` : ''}`}
        >
          <input
            id={id('tags')}
            type="text"
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
            aria-describedby={describedBy(id('tags'), 'x')}
            autoComplete="off"
          />
        </Field>

        <Field
          id={id('imageUrl')}
          label="Image link (optional)"
          hint="Link only, nothing is uploaded. Only use images you are allowed to show, such as openly licensed ones from Wikimedia Commons. Without one you get a coloured letter tile."
          error={shown.imageUrl}
        >
          <input
            id={id('imageUrl')}
            type="url"
            inputMode="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://"
            aria-invalid={Boolean(shown.imageUrl)}
            aria-describedby={describedBy(id('imageUrl'), 'x', shown.imageUrl)}
          />
        </Field>

        <Field id={id('sourceUrl')} label="Source link (optional)" hint="Where the facts came from." error={shown.sourceUrl}>
          <input
            id={id('sourceUrl')}
            type="url"
            inputMode="url"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            placeholder="https://"
            aria-invalid={Boolean(shown.sourceUrl)}
            aria-describedby={describedBy(id('sourceUrl'), 'x', shown.sourceUrl)}
          />
        </Field>

        {initial ? (
          <Field id={id('status')} label="Status">
            <select id={id('status')} value={status} onChange={(e) => setStatus(e.target.value as EntryStatus)}>
              <option value="unverified">Unverified</option>
              <option value="verified">Verified</option>
            </select>
          </Field>
        ) : null}

        {submitted && Object.keys(errors).length > 0 ? (
          <p className="error" role="alert">
            Fix the highlighted fields and try again.
          </p>
        ) : null}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {submitLabel}
          </button>
          <button type="button" className="btn btn-outline" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>

      <aside className="preview" aria-label="Preview">
        <p className="eyebrow">Preview</p>
        <EntryTile entry={draft} />
        <p className="hint">This is how it looks in the feed. New entries start as Unverified.</p>
      </aside>
    </form>
  );
}
