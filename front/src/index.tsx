import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App';
import store from './store';
import { ThemeProvider } from '@mui/material/styles';
import { StylesProvider, jssPreset } from '@mui/styles';
import CssBaseline from '@mui/material/CssBaseline';
import * as Themes from './styles/themes';
import '@mui/lab/themeAugmentation';
import { ThemeModeProvider, useThemeMode } from './contexts/ThemeContext';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import './styles/global.css';
import './styles/admin-grid.css';
import { create } from 'jss';

const jss = create({
  ...jssPreset(),
  // Define a custom insertion point that JSS will look for when injecting the styles into the DOM.
  insertionPoint: document.getElementById('insertion-point')!,
});

const AppWithTheme: React.FC = () => {
  const { darkMode } = useThemeMode();
  const activeTheme = darkMode ? Themes.darkTheme : Themes.lightTheme;
  return (
    <StylesProvider jss={jss}>
      <ThemeProvider theme={activeTheme}>
        <CssBaseline />
        <Router>
          <App />
        </Router>
      </ThemeProvider>
    </StylesProvider>
  );
};

ReactDOM.render(
  <Provider store={store}>
    <ThemeModeProvider>
      <AppWithTheme />
    </ThemeModeProvider>
  </Provider>,
  document.getElementById('root'),
);
