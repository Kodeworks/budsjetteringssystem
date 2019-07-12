import { ActionCreators, createTransaction, transactionReducer } from '../transactions';

import { ITransaction } from '../../../declarations/transaction';

import { sum as intermediarySum } from '../../../helpers/intermediary_calc';
import { initialState } from '../../contexts/transactions';

const tx: ITransaction = {
  company_id: 0,
  date: '01.01.1970',
  description: 'Test transaction #0',
  id: 0,
  money: 10000,
  type: 'income',
};

test('adds a new transaction', () => {
  let state = initialState;
  expect(state.transactions.length).toBe(0);
  state = transactionReducer(state, ActionCreators.addTransaction(tx));
  state = transactionReducer(state, ActionCreators.addTransaction({ ...tx, id: 1 }));

  const expected: Array<ITransaction> = [tx, { ...tx, id: 1 }];

  state.transactions.forEach((e, i) => expect(e).toEqual(expected[i]));
});

test('removes a transaction', () => {
  let state = initialState;
  expect(state.transactions.length).toBe(0);
  state = transactionReducer(state, ActionCreators.addTransaction(tx));
  state = transactionReducer(state, ActionCreators.addTransaction({ ...tx, id: 1 }));
  expect(state.transactions.length).toBe(2);
  state = transactionReducer(state, ActionCreators.removeTransaction(tx));
  expect(state.transactions.length).toBe(1);
});

test('doesn\'t remove if no match', () => {
  let state = initialState;
  expect(state.transactions.length).toBe(0);
  state = transactionReducer(state, ActionCreators.addTransaction(tx));
  state = transactionReducer(state, ActionCreators.addTransaction({ ...tx, id: 1 }));
  expect(state.transactions.length).toBe(2);
  state = transactionReducer(state, ActionCreators.removeTransaction({ ...tx, id: 2 }));
  expect(state.transactions.length).toBe(2);
});

test('add to intermediary and calc sum', () => {
  let state = initialState;
  expect(state.intermediary.length).toBe(0);
  state = transactionReducer(state, ActionCreators.addTransaction(tx));
  state = transactionReducer(state, ActionCreators.addTransaction({ ...tx, id: 1 }));
  state = transactionReducer(state, ActionCreators.addToIntermediary(tx.id));
  state = transactionReducer(state, ActionCreators.addToIntermediary({ ...tx, id: 1 }.id));
  expect(state.intermediary.length).toBe(2);
  expect(intermediarySum(state)).toBe((tx.money * 2) / 100);
});

test('remove from intermediary and calc sum', () => {
  let state = initialState;
  expect(state.intermediary.length).toBe(0);
  state = transactionReducer(state, ActionCreators.addTransaction(tx));
  state = transactionReducer(state, ActionCreators.addTransaction({ ...tx, id: 1 }));
  state = transactionReducer(state, ActionCreators.addToIntermediary(tx.id));
  state = transactionReducer(state, ActionCreators.addToIntermediary({ ...tx, id: 1 }.id));
  expect(state.intermediary.length).toBe(2);
  expect(intermediarySum(state)).toBe((tx.money * 2) / 100);
  state = transactionReducer(state, ActionCreators.removeFromIntermediary({ ...tx, id: 1 }.id));
  expect(intermediarySum(state)).toBe(tx.money / 100);
});

test('reset transaction state', () => {
  let state = initialState;
  expect(state.transactions.length).toBe(0);
  // reset transactions and initialize with array of 1 transaction
  const initTransactions = [tx];
  state = transactionReducer(state, ActionCreators.resetTransactions(initTransactions));
  expect(state.transactions.length).toBe(1);
  // resetTransactions and clear all transactions
  state = transactionReducer(state, ActionCreators.resetTransactions());
  expect(state.transactions.length).toBe(0);
} );
