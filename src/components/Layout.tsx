import { useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { APP_NAME } from '../config';

export function Layout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="logo">
            <span className="logo-mark" aria-hidden="true" />
            {APP_NAME}
          </Link>
          <nav className="main-nav" aria-label="Main">
            <NavLink to="/" end>
              Browse
            </NavLink>
            <NavLink to="/profile">Profile</NavLink>
          </nav>
          <Link to="/add" className="btn btn-primary">
            + Add entry
          </Link>
        </div>
      </header>
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <span>
            Prototype. Everything you add is saved in this browser only. Names, logos and characters belong to their
            owners.
          </span>
        </div>
      </footer>
    </>
  );
}
