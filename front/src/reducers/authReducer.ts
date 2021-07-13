import authService from '../services/auth'
import { localStorageSetter } from '../utils.ts/localStorage'

export const loginUser = (username: string, password: string) => {
  return async (dispatch: any ) => {
    const loggedInUser = await authService.login({username,password})
    localStorageSetter('auth', JSON.stringify(loggedInUser))
    dispatch({
      type: 'LOGIN',
      data: loggedInUser
    })
    return loggedInUser
  }
}

const noLoggedInUserState = false

const authReducer = (state = noLoggedInUserState, action: { type: string; data: any }) => {
  switch(action.type){
    case 'LOGIN':
      return action.data
    default: 
      return state
  }
}


export default authReducer