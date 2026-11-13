import { createTheme, Theme } from '@mui/material/styles';

const typography = {
  fontFamily: ['"Montserrat"', 'sans-serif'].join(','),
};

export const lightTheme = createTheme({
  typography,
  palette: {
    mode: 'light',
    primary: {
      main: '#fff',
      contrastText: '#000',
    },
    secondary: {
      main: '#B20738',
      light: '#d16a88',
    },
    background: {
      default: '#F9FAFB',
      paper: '#ffffff',
    },
  },
});

export const darkTheme = createTheme({
  typography,
  palette: {
    mode: 'dark',
    primary: {
      main: '#1e293b',
      contrastText: '#f1f5f9',
    },
    secondary: {
      main: '#B20738',
      light: '#E0708F',
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
  },
});

const byMode = (light: string, dark: string) => (theme: Theme) =>
  theme.palette.mode === 'dark' ? dark : light;

// Text colours that stay readable on both light and dark surfaces.
// Usable directly as `sx` values or called with the theme in makeStyles.
export const successText = byMode('#2F855A', '#68D391');
export const errorText = byMode('#C53030', '#FC8181');
export const warningText = byMode('#C05621', '#F6AD55');

// The brand red is too dark to read as text on dark surfaces
export const accentText = (theme: Theme) =>
  theme.palette.mode === 'dark'
    ? theme.palette.secondary.light
    : theme.palette.secondary.main;
