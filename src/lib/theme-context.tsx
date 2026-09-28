'use client';

import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';

type ThemePreference = 'light' | 'dark' | 'system';
type EffectiveTheme = 'light' | 'dark';

interface ThemeContextValue {
  preference: ThemePreference;
  effectiveTheme: EffectiveTheme;
  setPreference: (pref: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function applyTheme(theme: EffectiveTheme) {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  root.classList.toggle('dark', theme === 'dark');
}

function systemTheme(): EffectiveTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Defaults to the OS/browser's light-or-dark preference (per the
 * assessment's requirement), but lets the user override it explicitly via
 * ThemeToggle, persisting that choice in localStorage. If the user has
 * never overridden it, the app keeps following system changes live.
 *
 * See the inline script in layout.tsx for how the *first* paint avoids a
 * flash of the wrong theme — this provider takes over after hydration.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [effectiveTheme, setEffectiveTheme] = useState<EffectiveTheme>('light');

  useEffect(() => {
    const stored = localStorage.getItem('themePreference') as ThemePreference | null;
    const initialPref = stored ?? 'system';
    setPreferenceState(initialPref);
    const initialEffective = initialPref === 'system' ? systemTheme() : initialPref;
    setEffectiveTheme(initialEffective);
    applyTheme(initialEffective);

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      const currentPref = (localStorage.getItem('themePreference') as ThemePreference | null) ?? 'system';
      if (currentPref === 'system') {
        const next = systemTheme();
        setEffectiveTheme(next);
        applyTheme(next);
      }
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const setPreference = useCallback((pref: ThemePreference) => {
    setPreferenceState(pref);
    localStorage.setItem('themePreference', pref);
    const next = pref === 'system' ? systemTheme() : pref;
    setEffectiveTheme(next);
    applyTheme(next);
  }, []);

  return (
    <ThemeContext.Provider value={{ preference, effectiveTheme, setPreference }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
