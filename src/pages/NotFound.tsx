import { Link } from 'react-router-dom';
import { useTitle } from '../lib/useTitle';

export function NotFound() {
  useTitle('Not found');
  return (
    <div className="container page">
      <h1 className="page-title">Not found</h1>
      <p className="lede">That page or entry does not exist. It may have been deleted.</p>
      <Link to="/" className="btn btn-primary">
        Back to browse
      </Link>
    </div>
  );
}
