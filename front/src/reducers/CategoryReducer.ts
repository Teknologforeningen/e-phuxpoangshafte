import { CategoryActions } from '../actions';
import { CategoryState } from '../types';

const INITIAL_STATE: CategoryState = {
  isFetched: false,
  categories: []
};

const categoryReducer = (state = INITIAL_STATE, action: CategoryActions) => {
  switch (action.type) {
    case 'INIT_CATEGORIES':
      return { isFecthed: action.isFetched, categories: action.categories };
    case 'ADD_CATEGORY':{
      const newState: CategoryState = {
        ...state,
         categories: [
           ...state.categories,
           action.category]}
      return newState
    }
    default:
      return state;
  }
};

export default categoryReducer;
