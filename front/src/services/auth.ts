import axios from 'axios'
import { authDetails } from "../types"
const baseUrl = '/api/auth'

const login = async (credentials: any): Promise<authDetails> => {
  const response = await axios.post(baseUrl, credentials)
  console.log(response.data)
  return response.data as authDetails
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  login
}