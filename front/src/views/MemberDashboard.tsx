import React from 'react';
import { useSelector } from 'react-redux';
import * as AuthSelectors from '../selectors/AuthSelectors';
import * as CategorySelectors from '../selectors/CategorySelectors'
import { AuthState, CategoryState } from '../types';

interface Props {
  email: string;
}



const HelloPage = (props: Props) => {
  const auth: AuthState = useSelector(AuthSelectors.auth);
  const categoriesState: CategoryState = useSelector(CategorySelectors.allCategories)
  const listOfCategories = categoriesState.categories !== undefined ?
    categoriesState.categories.map( cat => <p>{cat.name}</p>)
    : ""
  return (
    <div>
      <p>Hello {auth.userInfo?.firstName} {auth.userInfo?.lastName}</p>
      <h2>Kategorier:</h2>
      {listOfCategories}
    </div>
  );
};

export default HelloPage;
