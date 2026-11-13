import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useMediaQuery } from '@mui/material';
import { localStorageGetter, localStorageSetter } from '../utils/localStorage';

// Also read by the inline script in public/index.html
export const THEME_STORAGE_KEY = 'themeMode';

export const THEME_MODES = ['light', 'system', 'dark'] as const;
export type ThemeMode = typeof THEME_MODES[number];
export type ResolvedThemeMode = Exclude<ThemeMode, 'system'>;

interface ThemeContextType {
  mode: ThemeMode;
  resolvedMode: ResolvedThemeMode;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'system',
  resolvedMode: 'light',
  setMode: () => {},
});

export const useThemeMode = () => useContext(ThemeContext);

const readStoredMode = (): ThemeMode => {
  const stored = localStorageGetter(THEME_STORAGE_KEY);
  return THEME_MODES.includes(stored as ThemeMode)
    ? (stored as ThemeMode)
    : 'system';
};

export const ThemeModeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mode, setModeState] = useState<ThemeMode>(readStoredMode);
  const systemPrefersDark = useMediaQuery('(prefers-color-scheme: dark)', {
    noSsr: true,
  });
  const resolvedMode: ResolvedThemeMode =
    mode === 'system' ? (systemPrefersDark ? 'dark' : 'light') : mode;

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    localStorageSetter(THEME_STORAGE_KEY, next);
  }, []);

  useEffect(() => {
    // Lets plain CSS (e.g. the AG Grid overrides) target the active theme
    document.body.setAttribute('data-theme', resolvedMode);
    // Native scrollbars, form controls and the pre-render canvas
    document.documentElement.style.colorScheme = resolvedMode;
  }, [resolvedMode]);

  const value = useMemo(
    () => ({ mode, resolvedMode, setMode }),
    [mode, resolvedMode, setMode],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
