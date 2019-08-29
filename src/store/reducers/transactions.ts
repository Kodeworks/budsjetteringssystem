import * as api from '../../mitochondria';
import { TransactionDispatch } from './../contexts/transactions';

type ITransaction = import('../../declarations/transaction').ITransaction;
type IRecurringTransaction = import('../../declarations/transaction').IRecurringTransaction;
type IUpdateRecurringTransaction = import('../../declarations/transaction').IUpdateRecurringTransaction;

// Action types
const REMOVE_TRANSACTION = 'REMOVE_TRANSACTION' as const;
const RESET_TRANSACTIONS = 'RESET_TRANSACTIONS' as const; // mostly for testing purposes.
const INTERMEDIARY_ADD = 'INTERMEDIARY_ADD' as const;
const INTERMEDIARY_REMOVE = 'INTERMEDIARY_REMOVE' as const;
const ADD_TRANSACTION = 'ADD_TRANSACTION' as const;
const UPDATE_TRANSACTION = 'UPDATE_TRANSACTION' as const;
const ADD_RECURRING_TRANSACTION = 'ADD_RECURRING_TRANSACTION' as const;
const REMOVE_RECURRING_TRANSACTION = 'REMOVE_RECURRING_TRANSACTION' as const;
const UPDATE_RECURRING_TRANSACTION = 'UPDATE_RECURRING_TRANSACTION' as const;
const SET_RECURRING_OVERRIDE_ON_RECURRING_TRANSACTION = 'SET_RECURRING_OVERRIDE_ON_RECURRING_TRANSACTION' as const;

// You need to define the return-type to have the typeof ADD_TRANSACTION as it will not be able to
// infer that it is actually just a const string - by default it will infer a string.

const setRecurringOverrideOnRecurringTransaction = (
  companyId: number,
  recurringId: number,
  id: number
) => ({
  payload: { companyId, recurringId, id },
  type: SET_RECURRING_OVERRIDE_ON_RECURRING_TRANSACTION,
});

const addTransaction = (tx: ITransaction) => ({
  payload: tx,
  type: ADD_TRANSACTION,
});
const doCreateTransaction = async (
  newTransaction: api.ICreateTransaction,
  dispatch: TransactionDispatch
) => {
  const createdTransaction = await api.createTransaction(newTransaction);

  dispatch(addTransaction(createdTransaction));

  const { company_id, recurring_transaction_id, id } = createdTransaction;

  if (recurring_transaction_id) {
    dispatch(
      setRecurringOverrideOnRecurringTransaction(
        company_id,
        recurring_transaction_id,
        id
      )
    );
  }
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
  const iter = await api.getAllTransactions(companyId);

  for await (const r of iter) {
    for (const t of r) {
      dispatch(addTransaction(t));
    }
  }
};

const doGetTransactionsByDate = async (
  companyId: number,
  date: string,
  dispatch: React.Dispatch<ActionType>
) => {
  const iter = await api.getTransactionsByDate(companyId, date);

  for await (const r of iter) {
    for (const t of r) {
      dispatch(addTransaction(t));
    }
  }
};

const doGetTransactionsByDateRange = async (
  companyId: number,
  startDate: string,
  endDate: string,
  dispatch: React.Dispatch<ActionType>
) => {
  const iter = await api.getTransactionsByDateRange(
    companyId,
    startDate,
    endDate
  );

  for await (const r of iter) {
    for (const t of r) {
      dispatch(addTransaction(t));
    }
  }
};

const doGetAllIncomeTransactions = async (
  companyId: number,
  dispatch: React.Dispatch<ActionType>
) => {
  const iter = await api.getAllIncomeTransactions(companyId);

  for await (const r of iter) {
    for (const t of r) {
      dispatch(addTransaction(t));
    }
  }
};

const doGetAllExpenseTransactions = async (
  companyId: number,
  dispatch: React.Dispatch<ActionType>
) => {
  const iter = await api.getAllExpenseTransactions(companyId);

  for await (const r of iter) {
    for (const t of r) {
      dispatch(addTransaction(t));
    }
  }
};

const addRecurringTransaction = (rtx: IRecurringTransaction) => ({
  payload: rtx,
  type: ADD_RECURRING_TRANSACTION,
});

const removeRecurringTransaction = (companyId: number, id: number) => ({
  payload: { company_id: companyId, id },
  type: REMOVE_RECURRING_TRANSACTION,
});

const updateRecurringTransaction = (rtx: IUpdateRecurringTransaction) => ({
  payload: rtx,
  type: UPDATE_RECURRING_TRANSACTION,
});

const doCreateRecurringTransaction = async (
  rtx: import('../../declarations/transaction').ICreateRecurringTransaction,
  dispatch: React.Dispatch<ActionType>
) => {
  dispatch(addRecurringTransaction(await api.createRecurringTransaction(rtx)));
};

const doFetchRecurringTransaction = async (
  companyId: number,
  recurringTransactionId: number,
  dispatch: React.Dispatch<ActionType>
) => {
  const resp = await api.getRecurringTransactionById(
    companyId,
    recurringTransactionId
  );
  dispatch(addRecurringTransaction(resp));
};

const doUpdateRecurringTransaction = async (
  rtx: IUpdateRecurringTransaction,
  dispatch: React.Dispatch<ActionType>
) => {
  await api.updateRecurringTransaction(rtx);
  dispatch(updateRecurringTransaction(rtx));
};

const doDeleteRecurringTransaction = async (
  companyId: number,
  rtxId: number,
  overrides: IRecurringTransaction['transactions'],
  dispatch: React.Dispatch<ActionType>
) => {
  // remove all overrides
  for (const o of overrides) {
    await doDeleteTransaction(companyId, o, dispatch);
  }

  await api.deleteRecurringTransaction(companyId, rtxId);
  dispatch(removeRecurringTransaction(companyId, rtxId));
};

const doGetAllRecurringTransactions = async (
  companyId: number,
  dispatch: React.Dispatch<ActionType>
) => {
  const iter = await api.getAllRecurringTransactions(companyId);

  for await (const r of iter) {
    for (const t of r) {
      dispatch(addRecurringTransaction(t));
    }
  }
};

const doGetAllActiveRecurringTransactions = async (
  companyId: number,
  dispatch: React.Dispatch<ActionType>
) => {
  const iter = await api.getActiveRecurringTransactions(companyId);

  for await (const r of iter) {
    for (const t of r) {
      dispatch(addRecurringTransaction(t));
    }
  }
};

export const TransactionActionCreators = {
  addRecurringTransaction,
  addToIntermediary,
  addTransaction,
  removeFromIntermediary,
  removeRecurringTransaction,
  removeTransaction,
  resetTransactions,
  setRecurringOverrideOnRecurringTransaction,
  updateRecurringTransaction,
  updateTransaction,
};

export const TransactionActions = {
  doAddToIntermediary,
  doCreateRecurringTransaction,
  doCreateTransaction,
  doDeleteRecurringTransaction,
  doDeleteTransaction,
  doFetchRecurringTransaction,
  doFetchTransaction,
  doGetAllActiveRecurringTransactions,
  doGetAllExpenseTransactions,
  doGetAllIncomeTransactions,
  doGetAllRecurringTransactions,
  doGetAllTransactions,
  doGetTransactionsByDate,
  doGetTransactionsByDateRange,
  doRemoveFromIntermediary,
  doRemoveTransaction,
  doResetTransactions,
  doUpdateRecurringTransaction,
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
  recurring: Array<IRecurringTransaction>;
  intermediary: Array<ITransaction['id']>;
}

export const transactionReducer = (
  state: ITransactionState,
  action: ActionType
): ITransactionState => {
  switch (action.type) {
    case ADD_TRANSACTION:
      if (
        state.transactions.find(
          e =>
            e.id === action.payload.id &&
            e.company_id === action.payload.company_id
        )
      ) {
        return state;
      }
      return {
        ...state,
        transactions: [...state.transactions, action.payload],
      };
    case REMOVE_TRANSACTION:
      const recurringWithThisOverride = state.recurring.find(
        e =>
          e.company_id === action.payload.companyId &&
          e.transactions.find(t => t === action.payload.txId)
      );

      if (recurringWithThisOverride) {
        recurringWithThisOverride.transactions = recurringWithThisOverride.transactions.filter(
          e => e !== action.payload.txId
        );
      }

      return {
        ...state,
        recurring: state.recurring.map(r => {
          if (
            r.company_id === action.payload.companyId &&
            r.transactions.includes(action.payload.txId)
          ) {
            return {
              ...r,
              transactions: r.transactions.filter(
                e => e !== action.payload.txId
              ),
            };
          }

          return r;
        }),
        transactions: state.transactions.filter(
          e =>
            (e.id !== action.payload.txId &&
              e.company_id === action.payload.companyId) ||
            e.company_id !== action.payload.companyId
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
    case ADD_RECURRING_TRANSACTION:
      if (
        state.recurring.find(
          e =>
            e.id === action.payload.id &&
            e.company_id === action.payload.company_id
        )
      ) {
        return state;
      }

      return {
        ...state,
        recurring: [...state.recurring, action.payload],
      };
    case REMOVE_RECURRING_TRANSACTION:
      return {
        ...state,
        recurring: state.recurring.filter(
          e =>
            (e.id !== action.payload.id &&
              e.company_id === action.payload.company_id) ||
            e.company_id !== action.payload.company_id
        ),
      };
    case UPDATE_RECURRING_TRANSACTION:
      const rtx = state.recurring.find(
        e =>
          e.id === action.payload.id &&
          e.company_id === action.payload.company_id
      )!;
      const updated: IRecurringTransaction = { ...rtx, ...action.payload };
      return {
        ...state,
        recurring: [
          ...state.recurring.filter(
            e =>
              (e.id !== action.payload.id &&
                e.company_id === action.payload.company_id) ||
              e.company_id !== action.payload.company_id
          ),
          updated,
        ],
      };
    case SET_RECURRING_OVERRIDE_ON_RECURRING_TRANSACTION:
      const toUpdate = state.recurring.find(
        e =>
          e.company_id === action.payload.companyId &&
          e.id === action.payload.recurringId
      )!;

      const newRecurring = {
        ...toUpdate,
        transactions: [...toUpdate.transactions, action.payload.id],
      } as IRecurringTransaction;

      return {
        ...state,
        recurring: state.recurring.map(e =>
          e.id === action.payload.recurringId ? newRecurring : e
        ),
      };
    default:
      return state;
  }
};
