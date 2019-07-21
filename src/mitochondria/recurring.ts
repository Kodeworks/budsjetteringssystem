import { fetchWithCallback } from '.';
import { IPaginated } from '../declarations/pagination';
import {
  ICreateRecurringTransaction,
  IRecurringTransaction,
  IUpdateRecurringTransaction,
} from '../declarations/transaction';

export const getRecurringTransactionById = async (
  companyId: number,
  id: number
) =>
  await fetchWithCallback<IRecurringTransaction>(
    '/recurring/',
    `?company_id=${companyId}&id=${id}`
  );

export const createRecurringTransaction = async (
  recurringTransaction: ICreateRecurringTransaction
) =>
  await fetchWithCallback<IRecurringTransaction>('/recurring/', '', {
    body: JSON.stringify(recurringTransaction),
    method: 'POST',
  });

export const updateRecurringTransaction = async (
  recurringTransaction: IUpdateRecurringTransaction
) =>
  await fetchWithCallback<true>(
    '/recurring/',
    '',
    {
      body: JSON.stringify(recurringTransaction),
      method: 'PUT',
    },
    {
      200: async () => true,
    }
  );

export const deleteRecurringTransaction = async (
  companyId: number,
  id: number
) =>
  await fetchWithCallback<true>(
    '/recurring/',
    `?company_id=${companyId}&id=${id}`,
    {
      method: 'DELETE',
    }
  );

export const getAllRecurringTransactions = async (
  companyId: number,
  offset: number = 0,
  limit?: number
) =>
  await fetchWithCallback<IPaginated<IRecurringTransaction>>(
    '/recurring/all/',
    `?company_id=${companyId}&offset=${offset}&limit=${limit}`
  );

export const getActiveRecurringTransactions = async (
  companyId: number,
  offset: number = 0,
  limit?: number
) =>
  await fetchWithCallback<IPaginated<IRecurringTransaction>>(
    '/recurring/active/',
    `?company_id=${companyId}&offset=${offset}&limit=${limit}`
  );

/**
 * @param date "ISO-8601"
 */
export const getRecurringTransactionsByDate = async (
  companyId: number,
  date: string,
  offset: number = 0,
  limit?: number
) =>
  await fetchWithCallback<IPaginated<IRecurringTransaction>>(
    '/recurring/byDate/',
    `?company_id=${companyId}&date=${date}&offset=${offset}&limit=${limit}`
  );

/**
 * @param startDate "Inclusive (ISO-8601)"
 * @param endDate "Inclusive (ISO-8601)"
 */
export const getRecurringTransactionsByDateRange = async (
  companyId: number,
  startDate: string,
  endDate: string,
  offset: number = 0,
  limit?: number
) =>
  await fetchWithCallback<IPaginated<IRecurringTransaction>>(
    '/recurring/byDate/',
    `?company_id=${companyId}&start_date=${startDate}&end_date=${endDate}&offset=${offset}&limit=${limit}`
  );
