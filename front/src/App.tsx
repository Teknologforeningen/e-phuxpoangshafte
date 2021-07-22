import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import LoginForm from './views/LoginPage';
import MemberDashboard from './views/MemberDashboard';
import PrivateRoute from './components/routing/PrivateRoute';
import { localStorageGetter } from './utils.ts/localStorage';
import { authDetails, Routes } from './types';
import { userLogin } from './actions/AuthActions';
import { CircularProgress, Typography, Box } from '@material-ui/core';
import NavBar from './components/Navigation/NavBar';
import LeftDrawer from './components/Navigation/LeftDrawer';
import { initCategories, initEvents } from './actions';
import * as CategoryServices from './services/CategoryServices';
import * as EventServices from './services/EventServices';
import CategoryPage from './views/CateogryPage';
import SignupPage from './views/SignupPage';
import SuccessfulsignupPage from './views/SuccessfulsignupPage';
import NewCatAndEventPage from './views/NewCategoryAndEventPage';
import AdminPage from './views/AdminPage';

const App = () => {
  const [state, changeState] = useState(false) 
  const dispatch = useDispatch();
  useEffect(() => {
    const storedUser: authDetails | null = localStorageGetter('auth')
    if(storedUser){
      dispatch(userLogin(storedUser))
    }
    changeState(true)
  }, [dispatch]);

  // Get categories from backend
  useEffect(() => {
    const getAndSetCategories = async () => {
      const response = await CategoryServices.getAllCategories()
      dispatch(initCategories(response))
    }
    try{
      getAndSetCategories()
    }
    catch(e){
      console.error({error: 'Failed to fetch categories from back end:', e})
    }
  },[dispatch])

    // Get events from backend
    useEffect(() => {
      const getAndSetEvents = async () => {
        const response = await EventServices.getAllCEvents()
        dispatch(initEvents(response))
      }
      try{
        getAndSetEvents()
      }
      catch(e){
        console.error({error: 'Failed to fetch events from back end:', e})
      }
    },[dispatch])

  return (
    <Box>
      <LeftDrawer/>
      <NavBar/>
      <BrowserRouter>
        <Switch>
          {state ?
          <React.Fragment>
            <Route path={Routes.LOGIN}>
              <LoginForm />
            </Route>
            <Route path={Routes.SIGNUP}>
              <SignupPage />
            </Route>
            <Route path={'/kategori/obligatorisk'}>
              <CategoryPage categoryID={"1"}/>
            </Route>
            <Route path={'/kategori/fest'}>
              <CategoryPage categoryID={"2"}/>
            </Route>
            <Route path={'/successfulsignup'}>
              <SuccessfulsignupPage/>
            </Route>
            <Route path={'/admin'}>
              <AdminPage/>
            </Route>
            <Route path={'/admin/addmore'}>
              <NewCatAndEventPage/>
            </Route>
            <PrivateRoute component={MemberDashboard} path={Routes.ROOT} exact /> 
          </React.Fragment>
          : <Route><CircularProgress color={"secondary"} /></Route> }
        </Switch>
      </BrowserRouter>
    </Box>
  );
};

export default App;
