import axios from 'axios';
import { NewCategoryAttributes } from '../views/Admin/components/NewCategoryForm';
import { Category } from '../types';
import { EditCategoryAttributes } from '../views/Admin/components/EditCategoryForm';
const baseUrl = '/api/categories';

export const getAllCategories = async (): Promise<Category[]> => {
  const response = await axios.get(baseUrl);
  return response.data as Category[];
};

export const addCategory = async (
  categoryInfo: NewCategoryAttributes,
): Promise<Category> => {
  const newCategory = {
    name: categoryInfo.name,
    description: categoryInfo.description,
    minPoints: categoryInfo.minPoints !== 0 ? categoryInfo.minPoints : null,
  };
  const response = await axios.post(baseUrl, newCategory);
  return response.data as Category;
};

export const editCategory = async (
  categoryInfo: EditCategoryAttributes,
): Promise<Category> => {
  const updatedCategory = {
    name: categoryInfo.name,
    description: categoryInfo.description,
    minPoints: categoryInfo.minPoints !== 0 ? categoryInfo.minPoints : null,
  };
  const url = `${baseUrl}/${categoryInfo.categoryId}`;
  const response = await axios.put(url, updatedCategory);
  return response.data as Category;
};
