import axios from 'axios'
import { authDetails, NewUser, userRole } from '../types'
const baseUrl = '/api/users'

export const getAllUsers = async (token: string): Promise<authDetails[]> => {
  const headers = {
    'Authorization': `Bearer ${token}` 
  }
  const response = await axios.get(baseUrl, {headers: {...headers}})
  return response.data as authDetails[]
}

export const addUser = async (userInfo: NewUser) => {
  const userToAdd = {
    role: userRole.BASIC,
    password: userInfo.password,
    email: userInfo.email,
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
    fieldOfStudy: userInfo.fieldOfStudy,
    capWithTF: userInfo.capWithTF
  }
  const response = await axios.post(baseUrl, userToAdd)
  return response.data
}