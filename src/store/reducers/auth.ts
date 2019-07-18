import React from 'react';

import { IUser } from './../../declarations/user';
import * as Auth from './../../mitochondria/auth';

export interface IAuthState {
  access?: string;
  refresh?: string;
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
const login = (args: Auth.ILoginResponse) => ({
  payload: args,
  type: LOGIN,
});

export async function doLogin(
  email: string,
  password: string,
  dispatch: React.Dispatch<ICreatedAction>
) {
  const resp = await Auth.login(email, password);
  dispatch(login(resp));
}

const REGISTER = 'REGISTER' as const;
const register = (args: Auth.ILoginResponse) => ({
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
  const resp = await Auth.register(email, firstName, lastName, password);
  dispatch(register(resp));
}

const LOGOUT = 'LOGOUT' as const;
const logout = () => ({
  type: LOGOUT,
});

export const doLogout = (dispatch: React.Dispatch<ICreatedAction>) => {
  Auth.logout();
  dispatch(logout());
};

const SET_USER = 'SET_USER' as const;
const setUser = (user: IUser) => ({
  payload: { user },
  type: SET_USER,
});

export async function doSetUser(
  access: string,
  id: number,
  dispatch: React.Dispatch<ICreatedAction>
) {
  const user = await Auth.fetchUserById(id, access);
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

export const reducer = (
  state: IAuthState,
  action: ICreatedAction
): IAuthState => {
  switch (action.type) {
    case LOGIN:
      return action.payload;
    case REGISTER:
      return action.payload;
    case LOGOUT:
      return {};
    case SET_USER:
      return { ...state, user: action.payload.user };
    case SET_ACCESS_TOKEN:
      return { ...state, access: action.payload };
    case SET_REFRESH_TOKEN:
      return { ...state, refresh: action.payload };
  }

  return state;
};
