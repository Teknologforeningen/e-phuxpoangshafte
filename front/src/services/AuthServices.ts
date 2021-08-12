import axios from 'axios';
import { User } from '../types';
const baseUrl = '/api/auth';

export const login = async (credentials: any): Promise<User> => {
  const response = await axios.post(baseUrl, credentials);
  return response.data as User;
};
