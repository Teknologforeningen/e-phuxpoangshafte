import axios from 'axios'
import { User } from "../types"
const baseUrl = '/api/auth'

const login = async (credentials: any): Promise<User> => {
  const response = await axios.post(baseUrl, credentials)
  return response.data as User
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  login
}