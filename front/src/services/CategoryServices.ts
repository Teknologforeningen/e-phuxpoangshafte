import axios from 'axios'
import { NewCategoryAttributes } from '../views/Admin/components/NewCategoryForm'
import { Category } from "../types"
const baseUrl = '/api/categories'

export const getAllCategories = async (): Promise<Category[]> => {
  const response = await axios.get(baseUrl)
  return response.data as Category[]
}

export const addCategory = async (categoryInfo: NewCategoryAttributes, token: string): Promise<Category> => {
  /*const headers = {
      'Authorization': `Bearer ${token}` 
  }*/
  const newCategory = {
    name: categoryInfo.name,
    description: categoryInfo.description,
    minPoints: categoryInfo.minPoints !== 0 ? categoryInfo.minPoints : null
  }
  const response = await axios.post(baseUrl, newCategory/*, {headers: {...headers}}*/)
  return response.data as Category
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getAllCategories
}

