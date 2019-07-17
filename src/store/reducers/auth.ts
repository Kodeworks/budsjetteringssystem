import React from 'react';

import { IUserCompany } from '../../declarations/company';
import { IUser } from './../../declarations/user';
import * as API from './../../mitochondria';

export interface IAuthState {
  access?: string;
  refresh?: string;
  user?: IUser;
  companies?: Array<IUserCompany>;
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
  access: string,
  id: number,
  dispatch: React.Dispatch<ICreatedAction>
) {
  const user = await API.fetchUserById(id, access);

  // We want to iterate over the company IDs returned by the backend and start
  // an asynchronous job to add the actual companies to the store.
  user.companies.forEach(company => doAddUserCompany(company, dispatch));

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

const ADD_USER_COMPANY = 'ADD_USER_COMPANY' as const;
const addUserCompany = (company: IUserCompany) => ({
  payload: company,
  type: ADD_USER_COMPANY,
});
/**
 * @summary """
 * This Perform action takes a company ID and fetches the actual company object from the backend and adds it to the state.
 * As of now, the backend doesn't actually return the role of the user, so we're just setting it to owner for now, as that
 * is the highest permissions a user can have, and we will rather be rejected by the backend until we can actually find out
 * what role the user has. This should be fixed shortly; an issue has been created.
 * """
 * @param companyId "The ID of the company to fetch."
 * @param dispatch "Dispatch function."
 */
export const doAddUserCompany = async (
  companyId: number,
  dispatch: React.Dispatch<ICreatedAction>
) => {
  dispatch(
    addUserCompany({ role: 'Owner', ...(await API.getCompanyById(companyId)) })
  );
};

/**
 * Under here you will find action creators, the reducer, and created action creators.
 */

const ActionCreatedCreators = {
  addUserCompany,
  login,
  logout,
  register,
  setAccessToken,
  setRefreshToken,
  setUser,
};

export const Perform = {
  doAddUserCompany,
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
    case ADD_USER_COMPANY:
      return {
        ...state,
        companies: [...(state.companies || []), action.payload],
      };
  }

  return state;
};
