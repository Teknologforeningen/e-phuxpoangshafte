import { CategoryState, Category } from '../types';

export const allCategories = (state: any): CategoryState => state.categories;

export const categoryById = (state: any, id: string): Category => state.categories.categories.find( (cat: Category) => cat.id === Number(id))
