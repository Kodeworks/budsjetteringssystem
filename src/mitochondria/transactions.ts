import { fetchWithCallback } from '.';
import { IPaginated } from '../declarations/pagination';
import {
  IExpenseTransaction,
  IIncomeTransaction,
  ITransaction,
} from '../declarations/transaction';

export type ICreateTransaction = Omit<
  ITransaction,
  'id' | 'recurring_transaction_id'
>;

export const createTransaction = async (transaction: ICreateTransaction) =>
  await fetchWithCallback<ITransaction>(
    '/transaction/',
    {},
    {
      body: JSON.stringify(transaction),
      method: 'POST',
    }
  );

export const getTransaction = async (companyId: number, id: number) =>
  await fetchWithCallback<ITransaction>('/transaction/', {
    company_id: companyId,
    id,
  });

export const updateTransaction = async (transaction: ITransaction) =>
  await fetchWithCallback<true>(
    '/transaction/',
    {},
    {
      body: JSON.stringify(transaction),
      method: 'PUT',
    },
    {
      200: async () => true,
    }
  );

export const deleteTransaction = async (companyId: number, id: number) =>
  await fetchWithCallback<true>(
    '/transaction/',
    { company_id: companyId, id },
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
  limit: number = 0
) =>
  await fetchWithCallback<IPaginated<ITransaction>>('/transaction/all/', {
    company_id: companyId,
    limit,
    offset,
  });

export const getTransactionsByDate = async (
  companyId: number,
  date: string,
  offset: number = 0,
  limit: number = 0
) =>
  await fetchWithCallback<IPaginated<ITransaction>>('/transaction/byDate/', {
    company_id: companyId,
    date,
    limit,
    offset,
  });

export const getTransactionsByDateRange = async (
  companyId: number,
  startDate: string,
  endDate: string,
  offset: number = 0,
  limit: number = 0
) =>
  await fetchWithCallback<IPaginated<ITransaction>>(
    '/transaction/byDateRange/',
    {
      company_id: companyId,
      end_date: endDate,
      limit,
      offset,
      start_date: startDate,
    }
  );

export const getAllIncomeTransactions = async (
  companyId: number,
  offset: number = 0,
  limit: number = 0
) =>
  await fetchWithCallback<IPaginated<IIncomeTransaction>>(
    '/transaction/income/all/',
    { company_id: companyId, offset, limit }
  );

export const getAllExpenseTransactions = async (
  companyId: number,
  offset: number = 0,
  limit: number = 0
) =>
  await fetchWithCallback<IPaginated<IExpenseTransaction>>(
    '/transaction/expense/all/',
    { company_id: companyId, offset, limit }
  );
