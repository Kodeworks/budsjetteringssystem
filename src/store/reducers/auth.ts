import React from 'react';

import { IUser } from './../../declarations/user';
import * as API from './../../mitochondria';

// Action types
const LOGIN = 'LOGIN' as const;
const REGISTER = 'REGISTER' as const;
const LOGOUT = 'LOGOUT' as const;
const SET_USER = 'SET_USER' as const;
const SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN' as const;
const SET_REFRESH_TOKEN = 'SET_REFRESH_TOKEN' as const;

export interface IAuthState {
  access: string;
  refresh: string;
  user?: IUser;
}

export const initialState: IAuthState = {
  access: '',
  refresh: '',
};

/**
 * Actions
 */
const login = (args: API.ILoginResponse) => ({
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

const register = (args: API.ILoginResponse) => ({
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
  const resp = await API.register(email, firstName, lastName, password);
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

const setAccessToken = (token: string) => ({
  payload: token,
  type: SET_ACCESS_TOKEN,
});
const doSetAccessToken = (
  token: string,
  dispatch: React.Dispatch<ICreatedAction>
) => dispatch(setAccessToken(token));

const setRefreshToken = (token: string) => ({
  payload: token,
  type: SET_REFRESH_TOKEN,
});
const doSetRefreshToken = (
  token: string,
  dispatch: React.Dispatch<ICreatedAction>
) => dispatch(setRefreshToken(token));

/**
 * Under here you will find action creators, the reducer, and created action creators.
 */

const AuthActionCreators = {
  login,
  logout,
  register,
  setAccessToken,
  setRefreshToken,
  setUser,
};

export const AuthActions = {
  doLogin,
  doLogout,
  doRegister,
  doSetAccessToken,
  doSetRefreshToken,
  doSetUser,
};

// the return types of all the elements in ActionCreators
// !! DO NOT TOUCH !!
export type ICreatedAction = ReturnType<
  typeof AuthActionCreators[keyof typeof AuthActionCreators]
>;

export const authReducer = (
  state: IAuthState,
  action: ICreatedAction
): IAuthState => {
  switch (action.type) {
    case LOGIN:
      return action.payload;
    case REGISTER:
      return action.payload;
    case LOGOUT:
      return { access: '', refresh: '' };
    case SET_USER:
      return { ...state, user: action.payload.user };
    case SET_ACCESS_TOKEN:
      return { ...state, access: action.payload };
    case SET_REFRESH_TOKEN:
      return { ...state, refresh: action.payload };
  }

  return state;
};
