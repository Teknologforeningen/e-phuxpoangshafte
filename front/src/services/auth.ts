import axios from 'axios'
const baseUrl = '/api/auth'

const login = async (credentials: any) => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default {
  login
}