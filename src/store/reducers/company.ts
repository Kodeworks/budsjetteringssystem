import * as API from '../../mitochondria';

type ICompany = import('../../declarations/company').ICompany;
export type CompanyState = Array<ICompany>;

const ADD_COMPANY = 'ADD_COMPANY' as const;
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

/**
 * Under here you will find action creators, the reducer, and created action creators.
 */

const CompanyActionCreators = {
  addCompany,
};

export const CompanyActions = {
  doAddCompany,
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
  }

  return state;
};
