import { createTheme } from '@mui/material/styles';

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
      light: '#d16a88',
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
  },
});

// Backward-compatible alias
export const theme = lightTheme;
