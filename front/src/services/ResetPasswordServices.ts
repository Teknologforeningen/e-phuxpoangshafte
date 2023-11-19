import axios from 'axios';

export const resetPassword = async (credentials: { email: string }) => {
  await axios.post('/api/reset', credentials);
};
