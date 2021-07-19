import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import AuthReducer from './reducers/authReducer'
import categoryReducer from './reducers/CategoryReducer';
import eventReducer from './reducers/EventReducer';

const reducer = combineReducers({
  auth: AuthReducer,
  categories: categoryReducer,
  events: eventReducer
});

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));

export default store;
