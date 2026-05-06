import React from 'react';
import { Switch } from 'react-router-dom';
import AdminRoute from '../../components/routing/AdminRoute';
import UserSummary from './UserSummary';
import { Routes } from '../../types';
import NewCatAndEventPage from './NewCategoryAndEventPage';

const AdminPage = () => {
  return (
    <Switch>
      <AdminRoute
        component={NewCatAndEventPage}
        path={Routes.ADMIN_ADDMORE}
        exact
      />
      <AdminRoute component={UserSummary} path={Routes.ADMIN} exact />
    </Switch>
  );
};

export default AdminPage;
