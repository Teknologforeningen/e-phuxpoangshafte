import axios from 'axios'
import { Category } from "../types"
const baseUrl = '/api/categories'

export const getAllCategories = async (): Promise<Category[]> => {
  const response = await axios.get(baseUrl)
  return response.data as Category[]
}

export const addCategory = async ({name, description, minPoints, token}: {name: string, description: string, minPoints: number, token: string}): Promise<Category> => {
  const headers = {
      'Authorization': `Bearer ${token}` 
  }
  const newCategory = {
    name,
    description,
    minPoints: minPoints !== 0 ? minPoints : null
  }
  const response = await axios.post(baseUrl, newCategory, {headers: {...headers}})
  return response.data as Category
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getAllCategories
}

