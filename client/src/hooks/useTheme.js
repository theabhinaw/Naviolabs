import { useCallback, useEffect, useState } from 'react';

const KEY = 'navio-theme';

const systemTheme = () =>
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

function savedTheme() {
  try {
    const value = localStorage.getItem(KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

// Light / dark mode. It follows the device until the visitor picks one, then remembers the choice.
export default function useTheme() {
  const [theme, setTheme] = useState(() => {
    const fromPage = document.documentElement.getAttribute('data-theme');
    return fromPage === 'light' || fromPage === 'dark' ? fromPage : savedTheme() || systemTheme();
  });
  const [chosen, setChosen] = useState(() => savedTheme() !== null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (chosen) return undefined;
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (event) => setTheme(event.matches ? 'dark' : 'light');
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, [chosen]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(KEY, next);
      } catch {
        /* storage can be blocked, the theme still changes */
      }
      return next;
    });
    setChosen(true);
  }, []);

  return { theme, toggleTheme };
}
