import * as api from '../../mitochondria';
import { ITransaction } from './../../declarations/transaction';
import { TransactionDispatch } from './../contexts/transactions';

// Action types
const REMOVE_TRANSACTION = 'REMOVE_TRANSACTION' as const;
const RESET_TRANSACTIONS = 'RESET_TRANSACTIONS' as const; // mostly for testing purposes.
const INTERMEDIARY_ADD = 'INTERMEDIARY_ADD' as const;
const INTERMEDIARY_REMOVE = 'INTERMEDIARY_REMOVE' as const;
const ADD_TRANSACTION = 'ADD_TRANSACTION' as const;
const UPDATE_TRANSACTION = 'UPDATE_TRANSACTION' as const;

// You need to define the return-type to have the typeof ADD_TRANSACTION as it will not be able to
// infer that it is actually just a const string - by default it will infer a string.

const addTransaction = (tx: ITransaction) => ({
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
  newTransaction: api.ICreateTransaction,
  dispatch: TransactionDispatch
) => {
  const createdTransaction = await api.createTransaction(newTransaction);
  dispatch(addTransaction(createdTransaction));
};

const removeTransaction = (companyId: number, txId: number) => ({
  payload: { companyId, txId },
  type: REMOVE_TRANSACTION,
});
const doRemoveTransaction = (
  companyId: number,
  txId: number,
  dispatch: TransactionDispatch
) => dispatch(removeTransaction(companyId, txId));

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

const addToIntermediary = (id: ITransaction['id']) => ({
  payload: id,
  type: INTERMEDIARY_ADD,
});
const doAddToIntermediary = (
  id: ITransaction['id'],
  dispatch: TransactionDispatch
) => dispatch(addToIntermediary(id));

const removeFromIntermediary = (id: ITransaction['id']) => ({
  payload: id,
  type: INTERMEDIARY_REMOVE,
});
const doRemoveFromIntermediary = (
  id: ITransaction['id'],
  dispatch: TransactionDispatch
) => dispatch(removeFromIntermediary(id));

const doFetchTransaction = async (
  companyId: number,
  transactionId: number,
  dispatch: React.Dispatch<ActionType>
) => {
  const resp = await api.getTransaction(companyId, transactionId);
  dispatch(addTransaction(resp));
};

const updateTransaction = (tx: ITransaction) => ({
  payload: tx,
  type: UPDATE_TRANSACTION,
});
const doUpdateTransaction = async (
  tx: ITransaction,
  dispatch: React.Dispatch<ActionType>
) => {
  await api.updateTransaction(tx);
  dispatch(updateTransaction(tx));
};

const doDeleteTransaction = async (
  companyId: number,
  txId: number,
  dispatch: React.Dispatch<ActionType>
) => {
  await api.deleteTransaction(companyId, txId);
  dispatch(removeTransaction(companyId, txId));
};

const doGetAllTransactions = async (
  companyId: number,
  dispatch: React.Dispatch<ActionType>
) => {
  const resp = await api.getAllTransactions(companyId);

  for (const t of resp.results) {
    dispatch(addTransaction(t));
  }
};

const doGetTransactionsByDate = async (
  companyId: number,
  date: string,
  dispatch: React.Dispatch<ActionType>
) => {
  const resp = await api.getTransactionsByDate(companyId, date);

  for (const t of resp.results) {
    dispatch(addTransaction(t));
  }
};

const doGetTransactionsByDateRange = async (
  companyId: number,
  startDate: string,
  endDate: string,
  dispatch: React.Dispatch<ActionType>
) => {
  const resp = await api.getTransactionsByDateRange(
    companyId,
    startDate,
    endDate
  );

  for (const t of resp.results) {
    dispatch(addTransaction(t));
  }
};

const doGetAllIncomeTransactions = async (
  companyId: number,
  dispatch: React.Dispatch<ActionType>
) => {
  const resp = await api.getAllIncomeTransactions(companyId);

  for (const t of resp.results) {
    dispatch(addTransaction(t));
  }
};

const doGetAllExpenseTransactions = async (
  companyId: number,
  dispatch: React.Dispatch<ActionType>
) => {
  const resp = await api.getAllExpenseTransactions(companyId);

  for (const t of resp.results) {
    dispatch(addTransaction(t));
  }
};

export const TransactionActionCreators = {
  addToIntermediary,
  addTransaction,
  removeFromIntermediary,
  removeTransaction,
  resetTransactions,
  updateTransaction,
};

export const TransactionActions = {
  doAddToIntermediary,
  doCreateTransaction,
  doDeleteTransaction,
  doFetchTransaction,
  doGetAllExpenseTransactions,
  doGetAllIncomeTransactions,
  doGetAllTransactions,
  doGetTransactionsByDate,
  doGetTransactionsByDateRange,
  doRemoveFromIntermediary,
  doRemoveTransaction,
  doResetTransactions,
  doUpdateTransaction,
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
          e =>
            e.id !== action.payload.txId &&
            e.company_id === action.payload.companyId
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
    case UPDATE_TRANSACTION:
      return {
        ...state,
        transactions: [
          ...state.transactions.filter(e => e.id !== action.payload.id),
          action.payload,
        ],
      };
    default:
      return state;
  }
};
