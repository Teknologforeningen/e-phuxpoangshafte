import axios from 'axios'
import { NewUser, userRole } from '../types'
const baseUrl = '/api/users'

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