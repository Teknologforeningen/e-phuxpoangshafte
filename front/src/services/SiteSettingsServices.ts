import axios from 'axios';
import { SiteSettings } from '../types';

const baseUrl = '/api/site-settings';

export const getSiteSettings = async (): Promise<SiteSettings> => {
  const response = await axios.get(baseUrl);
  return response.data as SiteSettings;
};

export const updateSiteSettings = async (
  settings: Partial<Omit<SiteSettings, 'id'>>,
): Promise<SiteSettings> => {
  const response = await axios.put(baseUrl, settings);
  return response.data as SiteSettings;
};
