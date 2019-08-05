import { TransactionActionCreators, transactionReducer } from '../transactions';

import moment from 'moment';
import { sum as intermediarySum } from '../../../helpers/intermediary_calc';
import { initialState } from '../../contexts/transactions';

type ITransaction = import('../../../declarations/transaction').ITransaction;
type IRecurringTransaction = import('../../../declarations/transaction').IRecurringTransaction;

const tx: ITransaction = {
  company_id: 0,
  date: '01.01.1970',
  description: 'Test transaction #0',
  id: 0,
  money: 10000,
  type: 'IN',
};

const rtx: IRecurringTransaction = {
  company_id: 0,
  end_date: moment()
    .add(2, 'years')
    .format('YYYY-MM-DD'),
  id: 0,
  interval: 14,
  interval_type: 'DA',
  start_date: moment().format('YYYY-MM-DD'),
  template: { description: 'Testing', id: 0, money: 10000, type: 'IN' },
  transactions: [],
};

test('adds a new transaction', () => {
  let state = initialState;
  expect(state.transactions.length).toBe(0);
  state = transactionReducer(
    state,
    TransactionActionCreators.addTransaction(tx)
  );
  state = transactionReducer(
    state,
    TransactionActionCreators.addTransaction({ ...tx, id: 1 })
  );

  const expected: Array<ITransaction> = [tx, { ...tx, id: 1 }];

  state.transactions.forEach((e, i) => expect(e).toEqual(expected[i]));
});

test('removes a transaction', () => {
  let state = initialState;

  expect(state.transactions.length).toBe(0);

  state = transactionReducer(
    state,
    TransactionActionCreators.addTransaction(tx)
  );

  state = transactionReducer(
    state,
    TransactionActionCreators.addTransaction({ ...tx, id: 1 })
  );

  expect(state.transactions.length).toBe(2);

  state = transactionReducer(
    state,
    TransactionActionCreators.removeTransaction(tx.company_id, tx.id)
  );

  expect(state.transactions.length).toBe(1);
});

test("doesn't remove if no match", () => {
  let state = initialState;
  expect(state.transactions.length).toBe(0);
  state = transactionReducer(
    state,
    TransactionActionCreators.addTransaction(tx)
  );
  state = transactionReducer(
    state,
    TransactionActionCreators.addTransaction({ ...tx, id: 1 })
  );
  expect(state.transactions.length).toBe(2);
  state = transactionReducer(
    state,
    TransactionActionCreators.removeTransaction(tx.company_id, 3)
  );
  expect(state.transactions.length).toBe(2);
});

test('add to intermediary and calc sum', () => {
  let state = initialState;
  expect(state.intermediary.length).toBe(0);
  state = transactionReducer(
    state,
    TransactionActionCreators.addTransaction(tx)
  );
  state = transactionReducer(
    state,
    TransactionActionCreators.addTransaction({ ...tx, id: 1 })
  );
  state = transactionReducer(
    state,
    TransactionActionCreators.addToIntermediary(tx.id)
  );
  state = transactionReducer(
    state,
    TransactionActionCreators.addToIntermediary({ ...tx, id: 1 }.id)
  );
  expect(state.intermediary.length).toBe(2);
  expect(intermediarySum(state)).toBe((tx.money * 2) / 100);
});

test('remove from intermediary and calc sum', () => {
  let state = initialState;
  expect(state.intermediary.length).toBe(0);
  state = transactionReducer(
    state,
    TransactionActionCreators.addTransaction(tx)
  );
  state = transactionReducer(
    state,
    TransactionActionCreators.addTransaction({ ...tx, id: 1 })
  );
  state = transactionReducer(
    state,
    TransactionActionCreators.addToIntermediary(tx.id)
  );
  state = transactionReducer(
    state,
    TransactionActionCreators.addToIntermediary({ ...tx, id: 1 }.id)
  );
  expect(state.intermediary.length).toBe(2);
  expect(intermediarySum(state)).toBe((tx.money * 2) / 100);
  state = transactionReducer(
    state,
    TransactionActionCreators.removeFromIntermediary({ ...tx, id: 1 }.id)
  );
  expect(intermediarySum(state)).toBe(tx.money / 100);
});

test('reset transaction state', () => {
  let state = initialState;
  expect(state.transactions.length).toBe(0);
  // reset transactions and initialize with array of 1 transaction
  const initTransactions = [tx];
  state = transactionReducer(
    state,
    TransactionActionCreators.resetTransactions(initTransactions)
  );
  expect(state.transactions.length).toBe(1);
  // resetTransactions and clear all transactions
  state = transactionReducer(
    state,
    TransactionActionCreators.resetTransactions()
  );
  expect(state.transactions.length).toBe(0);
});

test('add recurring transaction', () => {
  let state = initialState;
  expect(state.recurring.length).toBe(0);
  state = transactionReducer(
    state,
    TransactionActionCreators.addRecurringTransaction(rtx)
  );
  state = transactionReducer(
    state,
    TransactionActionCreators.addRecurringTransaction({ ...rtx, id: 1 })
  );

  const expected: Array<IRecurringTransaction> = [rtx, { ...rtx, id: 1 }];

  state.transactions.forEach((e, i) => expect(e).toEqual(expected[i]));
});

test('removes a recurring transaction', () => {
  let state = initialState;

  state = transactionReducer(
    state,
    TransactionActionCreators.addRecurringTransaction(rtx)
  );

  state = transactionReducer(
    state,
    TransactionActionCreators.addRecurringTransaction({ ...rtx, id: 1 })
  );

  expect(state.recurring.length).toBe(2);

  state = transactionReducer(
    state,
    TransactionActionCreators.removeRecurringTransaction(rtx.company_id, rtx.id)
  );

  expect(state.recurring.length).toBe(1);
});

test("doesn't remove recurring transaction if no match", () => {
  let state = initialState;
  state = transactionReducer(
    state,
    TransactionActionCreators.addRecurringTransaction(rtx)
  );
  state = transactionReducer(
    state,
    TransactionActionCreators.addRecurringTransaction({ ...rtx, id: 1 })
  );
  expect(state.recurring.length).toBe(2);
  state = transactionReducer(
    state,
    TransactionActionCreators.removeRecurringTransaction(rtx.company_id, 3)
  );
  expect(state.recurring.length).toBe(2);
});
