import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { localStorageGetter } from './utils.ts/localStorage';
import { Box } from '@material-ui/core';
import NavBar from './components/Navigation/NavBar';
import { initCategories, initEvents, userLogin,changeAutharizedStatus } from './actions';
import * as CategoryServices from './services/CategoryServices';
import * as EventServices from './services/EventServices';
import * as UserServices from './services/UserServices';
import { User } from './types';
import AppRouter from './AppRouter';
import axios from 'axios';

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    //check local storage for user info
    const storedToken: string | null = localStorageGetter('token');
    const storedUserId: string | null = localStorageGetter('userId');
    if (storedToken && storedUserId) {
      
      const parsedUserId: number = Number(JSON.parse(storedUserId));
      const parsedToken: string = JSON.parse(storedToken);
      axios.defaults.headers.common['authorization'] = `Bearer ${parsedToken}`;
      UserServices.getSingleUserInfo(parsedUserId).then((fecthedUser: User) => {
        dispatch(userLogin(fecthedUser));
      });
    } else {
      dispatch(changeAutharizedStatus(false))
    }

  }, [dispatch]);

  // Get categories from backend
  useEffect(() => {
    const getAndSetCategories = async () => {
      const response = await CategoryServices.getAllCategories();
      dispatch(initCategories(response));
    };
    try {
      getAndSetCategories();
    } catch (e) {
      console.error({ error: 'Failed to fetch categories from back end:', e });
    }
  }, [dispatch]);

  // Get events from backend
  useEffect(() => {
    const getAndSetEvents = async () => {
      const response = await EventServices.getAllEvents();
      dispatch(initEvents(response));
    };
    try {
      getAndSetEvents();
    } catch (e) {
      console.error({ error: 'Failed to fetch events from back end:', e });
    }
  }, [dispatch]);

  return (
    <Box>
      <NavBar />
      <AppRouter/>
    </Box>
  );
};

export default App;
