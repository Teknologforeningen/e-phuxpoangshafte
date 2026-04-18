import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import userReducer from './reducers/authReducer';
import categoryReducer from './reducers/CategoryReducer';
import eventReducer from './reducers/EventReducer';
import siteSettingsReducer from './reducers/SiteSettingsReducer';

const reducer = combineReducers({
  auth: userReducer,
  categories: categoryReducer,
  events: eventReducer,
  siteSettings: siteSettingsReducer,
});

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));

export default store;
