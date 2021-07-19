import { Category } from "../types"

export type CategoryActions = InitCategories;

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
