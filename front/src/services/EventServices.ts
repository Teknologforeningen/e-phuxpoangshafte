import axios from 'axios'
import { Event } from "../types"
const baseUrl = '/api/events'

export const getAllCEvents = async (): Promise<Event[]> => {
  const response = await axios.get(baseUrl)
  return response.data as Event[]
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getAllCEvents
}

