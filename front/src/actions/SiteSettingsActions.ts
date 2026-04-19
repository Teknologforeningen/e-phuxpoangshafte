import { SiteSettings } from '../types';

export type SiteSettingsActions = InitSiteSettings | UpdateSiteSettings;

interface InitSiteSettings {
  type: 'INIT_SITE_SETTINGS';
  settings: SiteSettings;
}

export const initSiteSettings = (settings: SiteSettings): InitSiteSettings => {
  return {
    type: 'INIT_SITE_SETTINGS',
    settings,
  };
};

interface UpdateSiteSettings {
  type: 'UPDATE_SITE_SETTINGS';
  settings: SiteSettings;
}

export const updateSiteSettings = (
  settings: SiteSettings,
): UpdateSiteSettings => {
  return {
    type: 'UPDATE_SITE_SETTINGS',
    settings,
  };
};
