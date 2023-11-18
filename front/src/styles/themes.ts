import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  typography: {
    fontFamily: ['"Montserrat"', 'sans-serif'].join(','),
  },
  palette: {
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
    },
  },
});
