import axios from 'axios'
import { Category } from "../types"
const baseUrl = '/api/categories'

export const getAllCategories = async (): Promise<Category[]> => {
  const response = await axios.get(baseUrl)
  return response.data as Category[]
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getAllCategories
}

