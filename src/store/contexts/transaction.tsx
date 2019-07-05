import * as React from 'react';

import { ITransaction } from './../../declarations/transaction';

/**
 * Action types
 */
const ADD_TRANSACTION = 'ADD_TRANSACTION';
const REMOVE_TRANSACTION = 'REMOVE_TRANSACTION';
const RESET_TRANSACTIONS = 'RESET_TRANSACTIONS'; // mostly for testing purposes.
const INTERMEDIARY_ADD = 'INTERMEDIARY_ADD';
const INTERMEDIARY_REMOVE = 'INTERMEDIARY_REMOVE';

// Action Creators
//
// You need to define the return-type to have the typeof ADD_TRANSACTION as it will not be able to
// infer that it is actually just a const string - by default it will infer a string.

/**
 * Action creator: Add transaction to account
 *
 * @param {ITransaction} tx - A transaction entry
 */
const addTransaction = (
  tx: ITransaction,
): { type: typeof ADD_TRANSACTION; tx: ITransaction } => ({
  tx,
  type: ADD_TRANSACTION,
});

/**
 * Action creator: Remove transaction from account
 *
 * @param {ITransaction} tx - A transaction entry
 */
const removeTransaction = (
  tx: ITransaction,
): { type: typeof REMOVE_TRANSACTION; tx: ITransaction } => ({
  tx,
  type: REMOVE_TRANSACTION,
});

const initTransactions = (
  init: Array<ITransaction>,
  ): { payload: Array<ITransaction>; type: typeof RESET_TRANSACTIONS} => ({
    payload: init,
    type: RESET_TRANSACTIONS,
});

/**
 * Action creator: Add transaction to accumulator tool (calculator)
 *
 * @param {ITransaction['id']} id - A transaction entry id
 */
const addToIntermediary = (
  id: ITransaction['id'],
): { type: typeof INTERMEDIARY_ADD; id: ITransaction['id'] } => ({
  id,
  type: INTERMEDIARY_ADD,
});

/**
 * Action creator: Remove transaction from accumulator tool (calculator)
 *
 * @param {ITransaction['id']} id - A transaction entry id
 */
const removeFromIntermediary = (
  id: ITransaction['id'],
): { type: typeof INTERMEDIARY_REMOVE; id: ITransaction['id'] } => ({
  id,
  type: INTERMEDIARY_REMOVE,
});

/**
 * The return types of all the elements in ActionCreators
 * NOTE: Should not be modified!
 */
type ActionType = ReturnType<
  typeof ActionCreators[keyof typeof ActionCreators]
>;

interface ITransactionState {
  transactions: Array<ITransaction>;
  intermediary: Array<ITransaction['id']>;
}
/**
 * The initial state of transaction context when initializing the TransactinoProvider.
 */
const initialState: ITransactionState = {
  intermediary: [],
  transactions: [],
};

/**
 * Transactions reducer
 * @param {ITransactionState} state - The current or initial state of the transaction context
 * @param {ActionType} action - The type of action being dispatched.
 */
const reducer = (
  state: ITransactionState,
  action: ActionType,
): ITransactionState => {
  switch (action.type) {
    case ADD_TRANSACTION:
      return { ...state, transactions: [...state.transactions, action.tx] };
    case REMOVE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.filter(e => e.id !== action.tx.id),
      };
    case INTERMEDIARY_ADD:
      return { ...state, intermediary: [...state.intermediary, action.id] };
    case INTERMEDIARY_REMOVE:
      return {
        ...state,
        intermediary: state.intermediary.filter(id => id !== action.id),
      };
    case RESET_TRANSACTIONS:
      return {
        ...state,
        transactions: action.payload,
      };
    default:
      return state;
  }
};

export type TransactionDispatch = React.Dispatch<ActionType>;

const TransactionStateContext = React.createContext<
  ITransactionState | undefined
>(undefined);
const TransactionDispatchContext = React.createContext<
  TransactionDispatch | undefined
>(undefined);

const TransactionProvider: React.FC = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

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
      'useTransactionState must be used within a TransactionProvider',
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
      'useTransactionDispatch must be called within a TransactionProvider',
    );
  }
  return context;
};

export type TransactionsContextType = [ITransactionState, TransactionDispatch];
/**
 * Returns the current state AND the dispatch of the Transaction context.
 */
const useTransactions = (): TransactionsContextType => {
  return(
    [useTransactionState(), useTransactionDispatch()]
  );
};

const ActionCreators = {
  addToIntermediary,
  addTransaction,
  initTransactions,
  removeFromIntermediary,
  removeTransaction,
};

export {
  TransactionProvider,
  useTransactions,
  useTransactionState,
  useTransactionDispatch,
  ActionCreators,
};
