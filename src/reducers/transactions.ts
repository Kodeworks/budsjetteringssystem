import { ITransaction } from '../declarations/transaction';

export interface IState {
  transactions: Array<ITransaction>;
}

/**
 * Actions.
 *
 * You need to define the return-type to have the typeof ADD_TRANSACTION as it will not be able to
 * infer that it is actually just a const string - by default it will infer a string.
 */
const ADD_TRANSACTION = 'ADD_TRANSACTION';
export const addTransaction = (tx: ITransaction): { type: typeof ADD_TRANSACTION, tx: ITransaction } => ({
  tx,
  type: ADD_TRANSACTION,
});

const REMOVE_TRANSACTION = 'REMOVE_TRANSACTION';
export const removeTransaction = (tx: ITransaction): { type: typeof REMOVE_TRANSACTION, tx: ITransaction } => ({
  tx,
  type: REMOVE_TRANSACTION,
});

export interface IAction {
  type: typeof ADD_TRANSACTION | typeof REMOVE_TRANSACTION;
  tx: ITransaction;
}

export const initialState: IState = { transactions: [] };

/**
 * Reducer
 */
export const reducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
    case ADD_TRANSACTION:
      return { transactions: [...state.transactions, action.tx] };
    case REMOVE_TRANSACTION:
      return { transactions: state.transactions.filter(e => e.id !== action.tx.id) };
    default:
      return state;
  }
};
