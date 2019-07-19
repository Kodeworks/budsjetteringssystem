import { fetchWithCallback } from '.';
import { ITransaction } from '../declarations/transaction';

export type INewTransaction = Omit<ITransaction, 'id' | 'recurring_id'>;

export const createTransaction = async (transaction: INewTransaction) => {
  return await fetchWithCallback<ITransaction>(
    '/transaction/',
    '',
    {
      body: JSON.stringify(transaction),
      method: 'POST',
    },
    {
      201: resp => resp.json() as Promise<ITransaction>,
    }
  );
};
