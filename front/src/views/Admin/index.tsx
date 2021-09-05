import React from 'react';
import { Switch } from 'react-router-dom';
import AdminRoute from '../../components/routing/AdminRoute';
import RequestPage from './RequestPage';
import UserTable from './components/UserTable';
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
      <AdminRoute component={RequestPage} path={Routes.ADMIN_REQUESTS} exact />
      <AdminRoute component={UserTable} path={Routes.ADMIN} exact />
    </Switch>
  );
};

export default AdminPage;
