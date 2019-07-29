import { fetchWithCallback } from '.';

type ITransaction = import('../declarations/transaction').ITransaction;

/**
 * Interface for body of a post request (Add Transaction) of the API
 */
export type INewTransaction = Omit<ITransaction, 'id' | 'recurring_id'>;

/**
 * This function call the calls the @function post function to create the Transaction in the database.
 * @param transaction The transaction we want to post to the API
 */
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
