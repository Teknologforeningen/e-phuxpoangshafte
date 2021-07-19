import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import App from './App';
import store from './store'
import { MuiThemeProvider } from '@material-ui/core';
import * as Themes from './styles/themes';

ReactDOM.render(
  <Provider store = {store}>
    <MuiThemeProvider theme={Themes.theme}>
      <Router>
        <App />
      </Router>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root'),
);
