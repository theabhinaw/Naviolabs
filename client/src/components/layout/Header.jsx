import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Logo from './Logo.jsx';
import { NAV_LINKS } from '../../data/content.js';

function ThemeToggle({ theme, onToggle }) {
  return (
    <button type="button" className="icon-btn theme-toggle" onClick={onToggle} aria-label="Dark theme" aria-pressed={theme === 'dark'}>
      <svg className="i-moon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
      <svg className="i-sun" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    </button>
  );
}

export default function Header({ theme, onToggleTheme }) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef(null);
  const closeRef = useRef(null);
  const close = () => setOpen(false);
  const { user } = useAuth();

  // While the menu is open: lock page scrolling, move focus into it and let Escape close it.
  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // If the window becomes wide while the menu is open, close it.
  useEffect(() => {
    const query = window.matchMedia('(min-width: 1021px)');
    const onChange = (event) => {
      if (event.matches) setOpen(false);
    };
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return (
    <>
      <header className="site-header">
        <div className="wrap bar">
          <Link className="brand" to="/" aria-label="Navio Labs, home">
            <Logo />
            <span>Navio Labs</span>
          </Link>
          <nav className="site-nav" aria-label="Main">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <div className="bar-actions">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            {user ? (
              <Link className="btn btn-primary btn-sm bar-cta" style={{ background: 'var(--ink)' }} to="/dashboard">
                Dashboard
              </Link>
            ) : (
              <Link className="btn btn-primary btn-sm bar-cta" to="/login">
                Log in
              </Link>
            )}
            <button
              ref={toggleRef}
              type="button"
              className="icon-btn menu-toggle"
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen(true)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* The slide-out menu sits next to the header (not inside it) so the header's blur does not clip it. */}
      <div id="mobile-menu" className={`drawer${open ? ' is-open' : ''}`} role="dialog" aria-modal="true" aria-label="Menu" aria-hidden={!open}>
        <div className="drawer-scrim" onClick={close} />
        <div className="drawer-panel">
          <div className="drawer-top">
            <Link className="brand" to="/" onClick={close} aria-label="Navio Labs, home">
              <Logo />
              <span>Navio Labs</span>
            </Link>
            <button ref={closeRef} type="button" className="icon-btn" aria-label="Close menu" onClick={close}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <nav className="drawer-nav" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} onClick={close}>
                {link.label}
              </a>
            ))}
          </nav>
          {user ? (
            <Link className="btn btn-primary" to="/dashboard" onClick={close} style={{ background: 'var(--ink)' }}>
              My Dashboard
            </Link>
          ) : (
            <Link className="btn btn-primary" to="/login" onClick={close}>
              Log in / Sign up
            </Link>
          )}
          <div className="drawer-row">
            <span>Dark theme</span>
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          </div>
        </div>
      </div>
    </>
  );
}
