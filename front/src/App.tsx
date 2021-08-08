import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { localStorageGetter } from './utils.ts/localStorage';
import { User } from './types';
import { Box } from '@material-ui/core';
import NavBar from './components/Navigation/NavBar';
import LeftDrawer from './components/Navigation/LeftDrawer';
import { initCategories, initEvents, userLogin } from './actions';
import * as CategoryServices from './services/CategoryServices';
import * as EventServices from './services/EventServices';


import RouterComp from './RouterComp';

const App = () => {
  const [state, changeState] = useState(false) 
  const dispatch = useDispatch();
  useEffect(() => { //check local storage for user info
    const storedUser: User | null = localStorageGetter('auth')
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
        const response = await EventServices.getAllEvents()
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
      <NavBar/>
      <RouterComp state = {state}/>
    </Box>
  );
};

export default App;
