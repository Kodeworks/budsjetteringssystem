import { ITransaction } from '../declarations/transaction';

export interface IState {
  transactions: Array<ITransaction>;
  intermediary: Array<ITransaction['id']>;
}

/**
 * Actions.
 *
 * You need to define the return-type to have the typeof ADD_TRANSACTION as it will not be able to
 * infer that it is actually just a const string - by default it will infer a string.
 */
const ADD_TRANSACTION = 'ADD_TRANSACTION';
const addTransaction = (tx: ITransaction): { type: typeof ADD_TRANSACTION, tx: ITransaction } => ({
  tx,
  type: ADD_TRANSACTION,
});

const REMOVE_TRANSACTION = 'REMOVE_TRANSACTION';
const removeTransaction = (tx: ITransaction): { type: typeof REMOVE_TRANSACTION, tx: ITransaction } => ({
  tx,
  type: REMOVE_TRANSACTION,
});

const INTERMEDIARY_ADD = 'INTERMEDIARY_ADD';
const addToIntermediary = (id: ITransaction['id']):
    { type: typeof INTERMEDIARY_ADD, id: ITransaction['id'] } => ({ type: INTERMEDIARY_ADD, id });

const INTERMEDIARY_REMOVE = 'INTERMEDIARY_REMOVE';
const removeFromIntermediary = (id: ITransaction['id']):
    { type: typeof INTERMEDIARY_REMOVE, id: ITransaction['id'] } => ({ type: INTERMEDIARY_REMOVE, id });

export const ActionCreators = {
  addToIntermediary,
  addTransaction,
  removeFromIntermediary,
  removeTransaction,
};

// the return types of all the elements in ActionCreators
// !! DO NOT TOUCH !!
export type IAction = ReturnType<typeof ActionCreators[keyof typeof ActionCreators]>;

export const initialState: IState = { transactions: [], intermediary: [] };

/**
 * Reducer
 */
export const reducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
    case ADD_TRANSACTION:
      return { ...state, transactions: [...state.transactions, action.tx] };
    case REMOVE_TRANSACTION:
      return { ...state, transactions: state.transactions.filter(e => e.id !== action.tx.id) };
    case INTERMEDIARY_ADD:
      return { ...state, intermediary: [...state.intermediary, action.id] };
    case INTERMEDIARY_REMOVE:
      return { ...state, intermediary: state.intermediary.filter(id => id !== action.id) };
    default:
      return state;
  }
};
