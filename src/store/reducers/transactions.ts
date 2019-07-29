import * as api from '../../mitochondria';
import { TransactionDispatch } from './../contexts/transactions';

type ITransaction = import('../../declarations/transaction').ITransaction;

// Action types
const ADD_TRANSACTION = 'ADD_TRANSACTION';
const REMOVE_TRANSACTION = 'REMOVE_TRANSACTION';
const RESET_TRANSACTIONS = 'RESET_TRANSACTIONS'; // mostly for testing purposes.
const INTERMEDIARY_ADD = 'INTERMEDIARY_ADD';
const INTERMEDIARY_REMOVE = 'INTERMEDIARY_REMOVE';

// You need to define the return-type to have the typeof ADD_TRANSACTION as it will not be able to
// infer that it is actually just a const string - by default it will infer a string.

const addTransaction = (
  tx: ITransaction
): { type: typeof ADD_TRANSACTION; payload: ITransaction } => ({
  payload: tx,
  type: ADD_TRANSACTION,
});

/**
 * It posts the new transaction to the API and dispatches an ADD_TRANSACTION action if successful.
 * @param newTransaction The new transaction that is to be posted to the API
 * @param dispatch The dispatch method from the TransactionDispatchContext
 * @throws "Error if return code is not 201"
 */
const doAddTransaction = async (
  newTransaction: api.INewTransaction,
  dispatch: TransactionDispatch
) => {
  // All values are stored as hundreths in state and database.
  newTransaction.money *= 100;

  const createdTransaction = await api.createTransaction(newTransaction);
  dispatch(addTransaction(createdTransaction));
};

const removeTransaction = (
  tx: ITransaction
): { type: typeof REMOVE_TRANSACTION; payload: ITransaction } => ({
  payload: tx,
  type: REMOVE_TRANSACTION,
});
const doRemoveTransaction = (tx: ITransaction, dispatch: TransactionDispatch) =>
  dispatch(removeTransaction(tx));

const resetTransactions = (
  init: Array<ITransaction> = []
): { payload: Array<ITransaction>; type: typeof RESET_TRANSACTIONS } => ({
  payload: init,
  type: RESET_TRANSACTIONS,
});
const doResetTransactions = (
  init: Array<ITransaction> = [],
  dispatch: TransactionDispatch
) => dispatch(resetTransactions(init));

const addToIntermediary = (
  id: ITransaction['id']
): { type: typeof INTERMEDIARY_ADD; payload: ITransaction['id'] } => ({
  payload: id,
  type: INTERMEDIARY_ADD,
});
const doAddToIntermediary = (
  id: ITransaction['id'],
  dispatch: TransactionDispatch
) => dispatch(addToIntermediary(id));

const removeFromIntermediary = (
  id: ITransaction['id']
): { type: typeof INTERMEDIARY_REMOVE; payload: ITransaction['id'] } => ({
  payload: id,
  type: INTERMEDIARY_REMOVE,
});
const doRemoveFromIntermediary = (
  id: ITransaction['id'],
  dispatch: TransactionDispatch
) => dispatch(removeFromIntermediary(id));

export const TransactionActionCreators = {
  addToIntermediary,
  addTransaction,
  removeFromIntermediary,
  removeTransaction,
  resetTransactions,
};

export const TransactionActions = {
  doAddToIntermediary,
  doAddTransaction,
  doRemoveFromIntermediary,
  doRemoveTransaction,
  doResetTransactions,
};

/**
 * The return types of all the elements in ActionCreators
 * NOTE: Should not be modified!
 */
export type ActionType = ReturnType<
  typeof TransactionActionCreators[keyof typeof TransactionActionCreators]
>;

export interface ITransactionState {
  transactions: Array<ITransaction>;
  intermediary: Array<ITransaction['id']>;
}

export const transactionReducer = (
  state: ITransactionState,
  action: ActionType
): ITransactionState => {
  switch (action.type) {
    case ADD_TRANSACTION:
      return {
        ...state,
        transactions: [...state.transactions, action.payload],
      };
    case REMOVE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.filter(
          e => e.id !== action.payload.id
        ),
      };
    case INTERMEDIARY_ADD:
      return {
        ...state,
        intermediary: [...state.intermediary, action.payload],
      };
    case INTERMEDIARY_REMOVE:
      return {
        ...state,
        intermediary: state.intermediary.filter(id => id !== action.payload),
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
