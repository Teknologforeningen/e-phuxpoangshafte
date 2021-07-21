import { Category } from "../types"

export type CategoryActions = InitCategories | AddCategory;

interface InitCategories {
  type: 'INIT_CATEGORIES';
  isFetched: boolean;
  categories: Category[]
}

export const initCategories = (categories: Category[]): InitCategories => {
  return {
    type: 'INIT_CATEGORIES',
    isFetched: true,
    categories,
  };
};

interface AddCategory {
  type: 'ADD_CATEGORY';
  category: Category
}

export const addCategory = (category: Category): AddCategory => {
  return{
    type: 'ADD_CATEGORY',
    category
  }
}
