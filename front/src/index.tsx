import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import App from './App';
import store from './store'
import { ThemeProvider } from '@material-ui/core/styles';
import * as Themes from './styles/themes';
import '@material-ui/lab/themeAugmentation';

ReactDOM.render(
  <Provider store = {store}>
    <ThemeProvider theme={Themes.theme}>
      <Router>
        <App />
      </Router>
    </ThemeProvider>
  </Provider>,
  document.getElementById('root'),
);
