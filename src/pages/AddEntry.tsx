import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { EntryForm } from '../components/EntryForm';
import { TYPES } from '../config';
import { store } from '../lib/storage';
import { useData } from '../lib/useData';
import { useTitle } from '../lib/useTitle';
import type { EntryType } from '../types';
import { NotFound } from './NotFound';

export function AddEntry() {
  useTitle('Add entry');
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const typeParam = params.get('type');
  const prefillType = typeParam && typeParam in TYPES ? (typeParam as EntryType) : undefined;

  return (
    <div className="container page">
      <h1 className="page-title">Add an entry</h1>
      <p className="lede">Search first so nothing is added twice. Fill in what you know, others can improve it later.</p>
      <EntryForm
        prefillName={params.get('name') ?? ''}
        prefillType={prefillType}
        submitLabel="Add entry"
        onSubmit={(data) => {
          const entry = store.addEntry(data);
          navigate(`/entry/${entry.id}`);
        }}
        onCancel={() => navigate(-1)}
      />
    </div>
  );
}

export function EditEntry() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { entries } = useData();
  const entry = entries.find((e) => e.id === id);
  useTitle(entry ? `Edit ${entry.name}` : undefined);
  if (!entry) return <NotFound />;

  return (
    <div className="container page">
      <h1 className="page-title">Edit entry</h1>
      <EntryForm
        key={entry.id}
        initial={entry}
        submitLabel="Save changes"
        onSubmit={(data) => {
          store.updateEntry(entry.id, data);
          navigate(`/entry/${entry.id}`);
        }}
        onCancel={() => navigate(`/entry/${entry.id}`)}
      />
    </div>
  );
}
