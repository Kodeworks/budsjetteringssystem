import { fetchWithCallback } from '.';
import {
  IPaginatedExpenseTransaction,
  IPaginatedIncomeTransaction,
  IPaginatedTransaction,
  ITransaction,
} from '../declarations/transaction';

export type INewTransaction = Omit<ITransaction, 'id' | 'recurring_id'>;

export const createTransaction = async (transaction: INewTransaction) =>
  await fetchWithCallback<ITransaction>(
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

export const getTransaction = async (
  companyId: number,
  transactionId: number
) =>
  await fetchWithCallback<ITransaction>(
    '/transaction/',
    `?company_id=${companyId}&id=${transactionId}`,
    {},
    {
      200: resp => resp.json(),
    }
  );

export const updateTransaction = async (transaction: ITransaction) =>
  await fetchWithCallback<boolean>(
    '/transaction/',
    '',
    {
      body: JSON.stringify(transaction),
      method: 'PUT',
    },
    {
      200: async () => true,
    }
  );

export const deleteTransaction = async (
  companyId: number,
  transactionId: number
) =>
  await fetchWithCallback<boolean>(
    '/transaction/',
    `?company_id=${companyId}&id=${transactionId}`,
    {
      method: 'DELETE',
    },
    {
      200: async () => true,
    }
  );

export const getAllTransactions = async (
  companyId: number,
  offset: number = 0,
  limit?: number
) =>
  await fetchWithCallback<IPaginatedTransaction>(
    '/transaction/all/',
    `?company_id=${companyId}&offset=${offset}${limit && `&limit=${limit}`}`,
    {},
    {
      200: resp => resp.json(),
    }
  );

export const getTransactionsByDate = async (
  companyId: number,
  date: string,
  offset: number = 0,
  limit?: number
) =>
  await fetchWithCallback<IPaginatedTransaction>(
    '/transaction/byDate/',
    `?company_id=${companyId}&date=${date}&offset=${offset}${limit &&
      `&limit=${limit}`}`,
    {},
    {
      200: resp => resp.json(),
    }
  );

export const getTransactionsByDateRange = async (
  companyId: number,
  startDate: string,
  endDate: string,
  offset: number = 0,
  limit?: number
) =>
  await fetchWithCallback<IPaginatedTransaction>(
    '/transaction/byDateRange/',
    `?company_id=${companyId}&end_date=${endDate}&start_date=${startDate}&offset=${offset}${limit &&
      `&limit=${limit}`}`,
    {},
    {
      200: resp => resp.json(),
    }
  );

export const getAllIncomeTransactions = async (
  companyId: number,
  offset: number = 0,
  limit?: number
) =>
  await fetchWithCallback<IPaginatedIncomeTransaction>(
    '/transaction/income/all/',
    `?company_id=${companyId}&offset=${offset}${limit && `&limit=${limit}`}`,
    {},
    {
      200: resp => resp.json(),
    }
  );

export const getAllExpenseTransactions = async (
  companyId: number,
  offset: number = 0,
  limit?: number
) =>
  await fetchWithCallback<IPaginatedExpenseTransaction>(
    '/transaction/expense/all/',
    `?company_id=${companyId}&offset=${offset}${limit && `&limit=${limit}`}`,
    {},
    {
      200: resp => resp.json(),
    }
  );
