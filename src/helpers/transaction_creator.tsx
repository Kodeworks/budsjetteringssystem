import React from 'react';
import { ITransaction, TransactionType } from '../declarations/transaction';
import { useTransactionDispatch} from '../store/contexts/transactions';
import {ActionCreators} from '../store/reducers/transactions';

const words: Array<string> = [
  'Otter',
  'Gerbil',
  'Fish',
  'Party',
  'Fluor',
  'Hereditary',
  'Consecutive',
  'Sustenance',
  'Party',
  'Paycheck',
  'Food',
  'Drinks',
];

const randomWord = (): string => words[Math.floor(Math.random() * words.length)];

const types: Array<TransactionType> = [
  'expense',
  'income',
];

const randomType = (): TransactionType => types[Math.floor(Math.random() * types.length)];

let i: number = 0;

export const createDummyTransaction = (): ITransaction => ({
  companyId: 0,
  date: new Date(Math.floor(Math.random() * 1500000000000)),
  description: `${randomWord()} ${randomWord()}`,
  id: i++,
  money: Math.random() * 10000,
  notes: Math.random() > 0.5 ? (new Array(30)).fill(null).map(randomWord).join(' ') : undefined,
  recurringId: Math.random() > 0.5 ? Math.floor(Math.random() * 10) : undefined,
  type: randomType(),
});

/**
 * Temporary mocking data:
 * Must be a child of a TransactionProvider
 */
export const TransactionMocker: React.FC<{quantity: number}> = (props) => {
  const dispatch = useTransactionDispatch();
  React.useEffect(() => {
    // Make mock data:
    const dummyTxs = new Array(props.quantity).fill(0).map(createDummyTransaction);
    dispatch(ActionCreators.resetTransactions(dummyTxs));
  }, [dispatch, props.quantity]);
  return null;
};
