import React from 'react';

import * as API from './../../mitochondria';

type IUser = import('../../declarations/user').IUser;

// Action types
const LOGIN = 'LOGIN' as const;
const REGISTER = 'REGISTER' as const;
const LOGOUT = 'LOGOUT' as const;
const SET_USER = 'SET_USER' as const;

export type AuthState = IUser | null;

export const initialState: AuthState = null;

/**
 * Actions
 */
const login = (args: IUser) => ({
  payload: args,
  type: LOGIN,
});

async function doLogin(
  email: string,
  password: string,
  dispatch: React.Dispatch<ICreatedAction>
) {
  const resp = await API.login(email, password);
  dispatch(login(resp));
}

const register = (args: IUser) => ({
  payload: args,
  type: REGISTER,
});

async function doRegister(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  dispatch: React.Dispatch<ICreatedAction>
) {
  const resp = await API.register({
    email,
    first_name: firstName,
    last_name: lastName,
    password,
  });
  dispatch(register(resp));
}

const logout = () => ({
  type: LOGOUT,
});
const doLogout = (dispatch: React.Dispatch<ICreatedAction>) => {
  API.logout();
  dispatch(logout());
};

const setUser = (user: IUser) => ({
  payload: { user },
  type: SET_USER,
});
async function doSetUser(id: number, dispatch: React.Dispatch<ICreatedAction>) {
  const user = await API.getUserById(id);
  dispatch(setUser(user));
}

/**
 * Under here you will find action creators, the reducer, and created action creators.
 */

const AuthActionCreators = {
  login,
  logout,
  register,
  setUser,
};

export const AuthActions = {
  doLogin,
  doLogout,
  doRegister,
  doSetUser,
};

// the return types of all the elements in ActionCreators
// !! DO NOT TOUCH !!
export type ICreatedAction = ReturnType<
  typeof AuthActionCreators[keyof typeof AuthActionCreators]
>;

export const authReducer = (
  state: AuthState,
  action: ICreatedAction
): AuthState => {
  switch (action.type) {
    case LOGIN:
      return action.payload;
    case REGISTER:
      return action.payload;
    case LOGOUT:
      return null;
    case SET_USER:
      return action.payload.user;
  }

  return state;
};
