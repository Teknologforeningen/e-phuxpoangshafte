import { SiteSettingsActions } from '../actions/SiteSettingsActions';
import { SiteSettingsState } from '../types';

const INITIAL_STATE: SiteSettingsState = {
  isFetched: false,
  settings: null,
};

const siteSettingsReducer = (
  state = INITIAL_STATE,
  action: SiteSettingsActions,
) => {
  switch (action.type) {
    case 'INIT_SITE_SETTINGS':
      return { isFetched: true, settings: action.settings };
    case 'UPDATE_SITE_SETTINGS':
      return { ...state, settings: action.settings };
    default:
      return state;
  }
};

export default siteSettingsReducer;
