import { ITransaction } from '../../declarations/transaction';
import { TransactionType } from './../../declarations/transaction';
import { TransactionDispatch } from './../contexts/transactions';

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

interface INewTransactionFormValues {
  date: string; // "YYYY-MM-DD"
  description: string;
  money: number;
  notes: string;
  type: TransactionType;
}
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

const createTransaction = (dispatch: TransactionDispatch, formValues: INewTransactionFormValues) => {
// TODO - Take care of generating unique id's.
const id = Math.floor(Math.random() * 1000);
const companyId = 1;
const formValuesWithDate = {...formValues, money: formValues.money * 100, date: new Date(formValues.date)};
// TODO - Make this action async and do a post request to API
dispatch(addTransaction({...formValuesWithDate, id, companyId}));
};

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

const resetTransactions = (
  init: Array<ITransaction>,
): { payload: Array<ITransaction>; type: typeof RESET_TRANSACTIONS } => ({
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
 * An object with all actioncreators, which can easily be exported.
 * (See exports at the bottom of the file.)
 */
const ActionCreators = {
  addToIntermediary,
  addTransaction,
  removeFromIntermediary,
  removeTransaction,
  resetTransactions,
};

/**
 * The return types of all the elements in ActionCreators
 * NOTE: Should not be modified!
 */
export type ActionType = ReturnType<
  typeof ActionCreators[keyof typeof ActionCreators]
>;

export interface ITransactionState {
  transactions: Array<ITransaction>;
  intermediary: Array<ITransaction['id']>;
}

/**
 * Transactions reducer
 * Takes old state and an action as arguments, and returns the new state.
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

export { ActionCreators, reducer as transactionReducer, createTransaction };
