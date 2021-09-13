import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App';
import store from './store';
import { ThemeProvider } from '@material-ui/core/styles';
import { StylesProvider, jssPreset } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import * as Themes from './styles/themes';
import '@material-ui/lab/themeAugmentation';

import { create } from 'jss';

const jss = create({
  ...jssPreset(),
  // Define a custom insertion point that JSS will look for when injecting the styles into the DOM.
  insertionPoint: document.getElementById('insertion-point')!,
});

ReactDOM.render(
  <Provider store={store}>
    <StylesProvider jss={jss}>
      <ThemeProvider theme={Themes.theme}>
        <CssBaseline />
        <Router>
          <App />
        </Router>
      </ThemeProvider>
    </StylesProvider>
  </Provider>,
  document.getElementById('root'),
);
