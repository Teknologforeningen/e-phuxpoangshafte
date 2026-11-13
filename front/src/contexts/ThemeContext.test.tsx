import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import {
  THEME_STORAGE_KEY,
  ThemeModeProvider,
  useThemeMode,
} from './ThemeContext';

const mockSystemPrefersDark = (initial: boolean) => {
  let matches = initial;
  const listeners = new Set<() => void>();
  const add = (listener: () => void) => listeners.add(listener);
  const remove = (listener: () => void) => listeners.delete(listener);
  window.matchMedia = ((media: string) => ({
    get matches() {
      return matches;
    },
    media,
    addListener: add,
    removeListener: remove,
    addEventListener: (_: string, listener: () => void) => add(listener),
    removeEventListener: (_: string, listener: () => void) => remove(listener),
  })) as unknown as typeof window.matchMedia;

  return (next: boolean) => {
    matches = next;
    act(() => listeners.forEach(listener => listener()));
  };
};

const Probe = () => {
  const { mode, resolvedMode, setMode } = useThemeMode();
  return (
    <button onClick={() => setMode('light')}>{`${mode}/${resolvedMode}`}</button>
  );
};

const renderProbe = () =>
  render(
    <ThemeModeProvider>
      <Probe />
    </ThemeModeProvider>,
  );

describe('ThemeModeProvider', () => {
  afterEach(() => {
    localStorage.clear();
    delete (window as { matchMedia?: unknown }).matchMedia;
  });

  it('defaults to system and follows OS changes live', () => {
    const setSystemPrefersDark = mockSystemPrefersDark(false);
    renderProbe();
    expect(screen.getByRole('button').textContent).toBe('system/light');

    setSystemPrefersDark(true);
    expect(screen.getByRole('button').textContent).toBe('system/dark');
    expect(document.body.getAttribute('data-theme')).toBe('dark');
  });

  it('keeps and persists an explicit choice regardless of the OS', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    const setSystemPrefersDark = mockSystemPrefersDark(false);
    renderProbe();
    expect(screen.getByRole('button').textContent).toBe('dark/dark');

    fireEvent.click(screen.getByRole('button'));
    setSystemPrefersDark(true);
    expect(screen.getByRole('button').textContent).toBe('light/light');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
  });

  it('falls back to system for an unknown stored value', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'true');
    mockSystemPrefersDark(true);
    renderProbe();
    expect(screen.getByRole('button').textContent).toBe('system/dark');
  });
});
