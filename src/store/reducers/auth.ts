import React from 'react';

import { IUser } from './../../declarations/user';
import * as API from './../../mitochondria';

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
const LOGIN = 'LOGIN' as const;
const login = (args: API.ILoginResponse) => ({
  payload: args,
  type: LOGIN,
});

export async function doLogin(
  email: string,
  password: string,
  dispatch: React.Dispatch<ICreatedAction>
) {
  const resp = await API.login(email, password);
  dispatch(login(resp));
}

const REGISTER = 'REGISTER' as const;
const register = (args: API.ILoginResponse) => ({
  payload: args,
  type: REGISTER,
});

export async function doRegister(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  dispatch: React.Dispatch<ICreatedAction>
) {
  try {
    const resp = await API.register(email, password, firstName, lastName);
    dispatch(register(resp));
  } catch (e) {
    throw new Error(e);
  }
}

const LOGOUT = 'LOGOUT' as const;
const logout = () => ({
  type: LOGOUT,
});

export const doLogout = (dispatch: React.Dispatch<ICreatedAction>) => {
  API.logout();
  dispatch(logout());
};

const SET_USER = 'SET_USER' as const;
const setUser = (user: IUser) => ({
  payload: { user },
  type: SET_USER,
});

export async function doSetUser(
  id: number,
  dispatch: React.Dispatch<ICreatedAction>
) {
  const user = await API.getUserById(id);
  dispatch(setUser(user));
}

const SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN' as const;
const setAccessToken = (token: string) => ({
  payload: token,
  type: SET_ACCESS_TOKEN,
});
export const doSetAccessToken = (
  token: string,
  dispatch: React.Dispatch<ICreatedAction>
) => dispatch(setAccessToken(token));

const SET_REFRESH_TOKEN = 'SET_REFRESH_TOKEN' as const;
const setRefreshToken = (token: string) => ({
  payload: token,
  type: SET_REFRESH_TOKEN,
});
export const doSetRefreshToken = (
  token: string,
  dispatch: React.Dispatch<ICreatedAction>
) => dispatch(setRefreshToken(token));

/**
 * Under here you will find action creators, the reducer, and created action creators.
 */

const ActionCreatedCreators = {
  login,
  logout,
  register,
  setAccessToken,
  setRefreshToken,
  setUser,
};

export const Perform = {
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
  typeof ActionCreatedCreators[keyof typeof ActionCreatedCreators]
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
