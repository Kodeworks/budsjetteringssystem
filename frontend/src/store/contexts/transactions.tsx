import * as React from 'react';

import {
  ActionType,
  ITransactionState,
  TransactionActions,
  transactionReducer,
} from '../reducers/transactions';
import { useAuthState } from './auth';

/**
 * The initial state of transaction context when initializing the TransactinoProvider.
 */
const initialState: ITransactionState = {
  intermediary: [],
  recurring: [],
  transactions: [],
};

/**
 * Useful type
 */
export type TransactionDispatch = React.Dispatch<ActionType>;

const TransactionStateContext = React.createContext<
  ITransactionState | undefined
>(undefined);
const TransactionDispatchContext = React.createContext<
  TransactionDispatch | undefined
>(undefined);

const TransactionProvider: React.FC = ({ children }) => {
  const [state, dispatch] = React.useReducer(transactionReducer, initialState);
  const auth = useAuthState();

  React.useEffect(() => {
    if (auth && auth.selectedCompany) {
      // For now, in development, we will simply make it fetch all of the transactions on mount
      // This should be changed later to improve performance, and prevent redundant fetches.
      TransactionActions.doGetAllTransactions(auth.selectedCompany, dispatch);
      TransactionActions.doGetAllRecurringTransactions(
        auth.selectedCompany,
        dispatch
      );
    }
  }, [auth]);

  return (
    <TransactionStateContext.Provider value={state}>
      <TransactionDispatchContext.Provider value={dispatch}>
        {children}
      </TransactionDispatchContext.Provider>
    </TransactionStateContext.Provider>
  );
};

/**
 * Returns the current state of the transaction context
 * @throws {Error} Must be called within a TransactionProvider
 */
const useTransactionState = () => {
  const context = React.useContext(TransactionStateContext);
  if (context === undefined) {
    throw new Error(
      'useTransactionState must be used within a TransactionProvider'
    );
  }
  return context;
};

/**
 * Returns only the dispatch function of the transaction context.
 * This is useful if a component shouldn't re-render if the state updates,
 * see https://kentcdodds.com/blog/how-to-optimize-your-context-value for more information.
 *
 * The dispatch function is used to dispatch an action of @type {ActionType}
 * @returns {TransactionDispatch} The dispatch function of the transaction context.
 * @throws {Error} Must be called within a TransactionProvider
 */
const useTransactionDispatch = (): TransactionDispatch => {
  const context = React.useContext(TransactionDispatchContext);
  if (context === undefined) {
    throw new Error(
      'useTransactionDispatch must be called within a TransactionProvider'
    );
  }
  return context;
};

export type TransactionsContextType = [ITransactionState, TransactionDispatch];
/**
 * Returns the current state AND the dispatch of the Transaction context.
 */
// NOTE: The return type must be set to tell TypeScript the correct order of the return Array.
const useTransactions = (): TransactionsContextType => {
  return [useTransactionState(), useTransactionDispatch()];
};

// Exports
export {
  initialState,
  TransactionProvider,
  useTransactions,
  useTransactionState,
  useTransactionDispatch,
};
