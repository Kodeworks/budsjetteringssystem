import { ICompany, ICompanyUser } from '../../declarations/company';

import * as API from '../../mitochondria';

export type CompanyState = Array<ICompany>;

// Actions
const ADD_COMPANY = 'ADD_COMPANY' as const;
const UPDATE_COMPANY = 'UPDATE_COMPANY' as const;
const DELETE_COMPANY = 'DELETE_COMPANY' as const;
const ADD_USER_TO_COMPANY = 'ADD_USER_TO_COMPANY' as const;
const REMOVE_USER_FROM_COMPANY = 'REMOVE_USER_FROM_COMPANY' as const;
const SET_ROLE_FOR_USER_IN_COMPANY = 'SET_ROLE_FOR_USER_IN_COMPANY' as const;

const addCompany = (company: ICompany) => ({
  payload: company,
  type: ADD_COMPANY,
});
/**
 * @summary """
 * This takes the ID of a company to fetch, and adds it to the store.
 * Will also add the user as a member of it with the Owner role as there
 * currently is no way to fetch the actual role of the user.
 * """
 * @param companyId "The ID of the company to fetch."
 * @param dispatch "Dispatch function."
 */
const doAddCompany = async (
  companyId: number,
  dispatch: React.Dispatch<ICreatedAction>
) => {
  dispatch(addCompany(await API.getCompanyById(companyId)));
};

const updateCompany = (company: API.IUpdateCompany) => ({
  payload: company,
  type: UPDATE_COMPANY,
});
const doUpdateCompany = async (
  company: API.IUpdateCompany,
  dispatch: React.Dispatch<ICreatedAction>
) => {
  await API.updateCompany(company);
  dispatch(updateCompany(company));
};

const deleteCompany = (companyId: number) => ({
  payload: companyId,
  type: DELETE_COMPANY,
});
const doDeleteCompany = async (
  companyId: number,
  dispatch: React.Dispatch<ICreatedAction>
) => {
  await API.deleteCompany(companyId);
  dispatch(deleteCompany(companyId));
};

const addUserToCompany = (user: ICompanyUser) => ({
  payload: user,
  type: ADD_USER_TO_COMPANY,
});
const doAddUserToCompany = async (
  user: ICompanyUser,
  dispatch: React.Dispatch<ICreatedAction>
) => {
  await API.addUserToCompany(user);
  dispatch(addUserToCompany(user));
};

const removeUserFromCompany = (companyId: number, userId: number) => ({
  payload: {
    companyId,
    userId,
  },
  type: REMOVE_USER_FROM_COMPANY,
});
const doRemoveUserFromCompany = async (
  companyId: number,
  userId: number,
  dispatch: React.Dispatch<ICreatedAction>
) => {
  await API.removeUserFromCompany(companyId, userId);
  dispatch(removeUserFromCompany(companyId, userId));
};

const setRoleForUserInCompany = (user: ICompanyUser) => ({
  payload: user,
  type: SET_ROLE_FOR_USER_IN_COMPANY,
});
const doSetRoleForUserInCompany = async (
  user: ICompanyUser,
  dispatch: React.Dispatch<ICreatedAction>
) => {
  await API.setRoleForUserInCompany(user);
  dispatch(setRoleForUserInCompany(user));
};

/**
 * Under here you will find action creators, the reducer, and created action creators.
 */

export const CompanyActionCreators = {
  addCompany,
  addUserToCompany,
  deleteCompany,
  removeUserFromCompany,
  setRoleForUserInCompany,
  updateCompany,
};

export const CompanyActions = {
  doAddCompany,
  doAddUserToCompany,
  doDeleteCompany,
  doRemoveUserFromCompany,
  doSetRoleForUserInCompany,
  doUpdateCompany,
};

// the return types of all the elements in ActionCreators
// !! DO NOT TOUCH !!
export type ICreatedAction = ReturnType<
  typeof CompanyActionCreators[keyof typeof CompanyActionCreators]
>;

export const companyReducer = (
  state: CompanyState,
  action: ICreatedAction
): CompanyState => {
  switch (action.type) {
    case ADD_COMPANY:
      return [action.payload, ...state];
    case UPDATE_COMPANY:
      return [
        ...state.filter(e => e.id !== action.payload.company_id),
        {
          ...state.find(e => e.id === action.payload.company_id)!,
          ...action.payload,
        },
      ];
    case DELETE_COMPANY:
      return state.filter(e => e.id !== action.payload);
    case ADD_USER_TO_COMPANY:
      const addUserCompany = state.find(
        e => e.id === action.payload.company_id
      )!;
      return [
        ...state.filter(e => e.id !== action.payload.company_id),
        {
          ...addUserCompany,
          users: [...addUserCompany.users, action.payload],
        },
      ];
    case REMOVE_USER_FROM_COMPANY:
      const removeUserCompany = state.find(
        e => e.id === action.payload.companyId
      )!;
      return [
        ...state.filter(e => e.id !== action.payload.companyId),
        {
          ...removeUserCompany,
          users: removeUserCompany.users.filter(
            e => e.user_id !== action.payload.userId
          ),
        },
      ];
    case SET_ROLE_FOR_USER_IN_COMPANY:
      const setRoleForUserInCompanyCompany = state.find(
        e => e.id === action.payload.company_id
      )!;
      return [
        ...state.filter(e => e.id !== action.payload.company_id),
        {
          ...setRoleForUserInCompanyCompany,
          users: [
            ...setRoleForUserInCompanyCompany.users.filter(
              e => e.user_id !== action.payload.user_id
            ),
            action.payload,
          ],
        },
      ];
  }

  return state;
};
