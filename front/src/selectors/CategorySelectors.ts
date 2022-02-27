import _ from 'lodash';
import { createSelector } from 'reselect';
import { CategoryState, Category } from '../types';

export const allCategories = (state: any): CategoryState => state.categories;

export const allCategoriesOrderedByNameAsc = createSelector(
  allCategories,
  categories => _.orderBy(categories.categories, 'name', 'asc'),
);

export const categoryById = (state: any, id: string): Category =>
  state.categories.categories.find((cat: Category) => cat.id === Number(id));
