import axios from 'axios'
import { User, EventStatus, NewUser, userRole, DoneEvent } from '../types'
const baseUrl = '/api/users'

export const getAllUsers = async (token: string): Promise<User[]> => {
  const headers = {
    'Authorization': `Bearer ${token}` 
  }
  const response = await axios.get(baseUrl, {headers: {...headers}})
  return response.data as User[]
}

export const getSingleUserInfo = async (userID: number | undefined, token: string | undefined): Promise<User> => {
  const headers = {
    'Authorization': `Bearer ${token}` 
}
  const response = await axios.get(baseUrl, {headers: {...headers}})
  return response.data as User
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

export const addDoneEvent = async (userID: number, eventID: number, token:string)=>{
  const headers = {
    'Authorization': `Bearer ${token}` 
  }
  const url = `${baseUrl}/${userID}/done_events/${eventID}`
  const response = await axios.post(url, null, {headers: {...headers}})
  return response.data
}

export const updateUserEventStatus = async (user: User, eventID: number, newStatus: EventStatus) => {
  const headers = {
    'Authorization': `Bearer ${user.token}` 
  }
  const url = `${baseUrl}/${user.id}/done_events/${eventID}`
  const status = {status: newStatus}
  const response = await axios.put(url, status, {headers: {...headers}})
  return response.data
}