import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { localStorageGetter, localStorageSetter } from '../utils/localStorage';

const THEME_STORAGE_KEY = 'darkMode';

interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  toggleDarkMode: () => {},
});

export const useThemeMode = () => useContext(ThemeContext);

const getSystemDarkMode = (): boolean =>
  window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;

export const ThemeModeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const stored = localStorageGetter(THEME_STORAGE_KEY);
    return stored !== null ? stored === 'true' : getSystemDarkMode();
  });

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => {
      const next = !prev;
      localStorageSetter(THEME_STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  // Keep data-theme on <body> in sync so CSS selectors (e.g. AG Grid overrides) can target it
  useEffect(() => {
    document.body.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Follow system preference changes only when the user hasn't set their own preference
  useEffect(() => {
    if (localStorageGetter(THEME_STORAGE_KEY) !== null) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setDarkMode(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
