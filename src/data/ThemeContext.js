// =============================================================================
// ThemeContext — holds the active color scheme (light / dark) and exposes the
// matching palette plus a toggle. The choice is persisted so it survives an app
// restart, and defaults to the device's system appearance on first launch.
// =============================================================================

import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Appearance } from 'react-native';

import { palettes } from './theme';
import { loadThemePreference, saveThemePreference } from './storage';

export const ThemeContext = createContext(null);

const systemScheme = () => Appearance.getColorScheme?.() || 'light';

export const ThemeProvider = ({ children }) => {
  const [scheme, setScheme] = useState(systemScheme);

  // Restore a saved preference (overrides the system default) on startup.
  useEffect(() => {
    let mounted = true;
    (async () => {
      const stored = await loadThemePreference();
      if (mounted && (stored === 'light' || stored === 'dark')) {
        setScheme(stored);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const setSchemePersisted = useCallback((next) => {
    setScheme(next);
    saveThemePreference(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setScheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      saveThemePreference(next);
      return next;
    });
  }, []);

  const value = useMemo(() => {
    const isDark = scheme === 'dark';
    return {
      scheme,
      isDark,
      colors: palettes[scheme] || palettes.light,
      toggleTheme,
      setScheme: setSchemePersisted,
    };
  }, [scheme, toggleTheme, setSchemePersisted]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
