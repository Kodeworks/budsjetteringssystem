import * as React from 'react';

import {
  CompanyActions,
  companyReducer,
  CompanyState,
  ICreatedAction,
} from '../reducers/company';
import { useAuthState } from './auth';

const initialState: CompanyState = [];

export type CompanyDispatch = React.Dispatch<ICreatedAction>;

const CompanyStateContext = React.createContext<CompanyState | undefined>(
  undefined
);
const CompanyDispatchContext = React.createContext<CompanyDispatch | undefined>(
  undefined
);

const CompanyProvider: React.FC = ({ children }) => {
  const [state, dispatch] = React.useReducer(companyReducer, initialState);

  const user = useAuthState();

  React.useEffect(() => {
    if (!user) {
      return;
    }

    user!.companies.forEach(company => {
      if (state.find(e => e.id === company.company_id)) {
        return;
      }
      CompanyActions.doAddCompany(company.company_id, dispatch);
    });
  }, [user, dispatch, state]);

  return (
    <CompanyStateContext.Provider value={state}>
      <CompanyDispatchContext.Provider value={dispatch}>
        {children}
      </CompanyDispatchContext.Provider>
    </CompanyStateContext.Provider>
  );
};

/**
 * Returns the current state of the Company context
 * @throws {Error} Must be called within a CompanyProvider
 */
const useCompanyState = () => {
  const context = React.useContext(CompanyStateContext);
  if (context === undefined) {
    throw new Error('useCompanyState must be used within a CompanyProvider');
  }
  return context;
};

/**
 * Returns only the dispatch function of the Company context.
 * This is useful if a component shouldn't re-render if the state updates,
 * see https://kentcdodds.com/blog/how-to-optimize-your-context-value for more information.
 *
 * The dispatch function is used to dispatch an action of @type {ActionType}
 * @returns {CompanyDispatch} The dispatch function of the Company context.
 * @throws {Error} Must be called within a CompanyProvider
 */
const useCompanyDispatch = (): CompanyDispatch => {
  const context = React.useContext(CompanyDispatchContext);
  if (context === undefined) {
    throw new Error(
      'useCompanyDispatch must be called within a CompanyProvider'
    );
  }
  return context;
};

export type CompanyContextType = [CompanyState, CompanyDispatch];
/**
 * Returns the current state AND the dispatch of the Company context.
 */
// NOTE: The return type must be set to tell TypeScript the correct order of the return Array.
const useCompany = (): CompanyContextType => {
  return [useCompanyState(), useCompanyDispatch()];
};

// Exports
export {
  initialState,
  CompanyProvider,
  useCompany,
  useCompanyState,
  useCompanyDispatch,
};
