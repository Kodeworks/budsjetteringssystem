import { fetchWithCallback } from '.';

import { IBalance, IBankBalance } from '../declarations/balance';
import { IMonth } from '../declarations/month';
import { IPaginated } from '../declarations/pagination';

export const getMonth = async (
  month: number,
  year: number,
  companyId: number
) =>
  await fetchWithCallback<Array<IMonth>>(
    '/month/',
    `?month=${month}&year=${year}&company_id=${companyId}`
  );

export const getAllMonths = async (companyId: number) =>
  await fetchWithCallback<IPaginated<IMonth>>(
    '/month/all/',
    `?company_id=${companyId}`
  );

/**
 * @summary "Get a paginated response with months in a date range."
 * @param startDate "Inclusive (ISO-8601)"
 * @param endDate "Inclusive (ISO-8601)"
 */
export const getMonthByDateRange = async (
  companyId: number,
  startDate: string,
  endDate: string
) =>
  await fetchWithCallback<IPaginated<IMonth>>(
    '/month/byDateRange/',
    `?company_id=${companyId}&start_date=${startDate}&end_date=${endDate}`
  );

/**
 * @param date "ISO-8601"
 */
export const getBalanceForDay = async (companyId: number, date: string) =>
  await fetchWithCallback<IBalance>(
    '/balance/',
    `?company_id=${companyId}&date=${date}`
  );

/**
 * @param startDate "Inclusive (ISO-8601)"
 * @param endDate "Inclusive (ISO-8601)"
 */
export const getBalanceByDateRange = async (
  companyId: number,
  startDate: string,
  endDate: string
) =>
  await fetchWithCallback<Array<IBalance>>(
    '/balance/byDateRange/',
    `?company_id=${companyId}&start_date=${startDate}&end_date=${endDate}`
  );

/**
 * @param id "Defined in swagger as: 'ID of the object to get'."
 */
export const getBankBalanceById = async (companyId: number, id: number) =>
  await fetchWithCallback<IBankBalance>(
    '/balance/bank/',
    `?company_id=${companyId}&id=${id}`
  );

export const createBankBalance = async (
  bankBalance: Omit<IBankBalance, 'id'>
) =>
  await fetchWithCallback<IBankBalance>('/balance/bank/', '', {
    body: JSON.stringify(bankBalance),
    method: 'POST',
  });

export const updateBankBalance = async (bankBalance: IBankBalance) =>
  await fetchWithCallback<true>(
    '/balance/bank/',
    '',
    {
      body: JSON.stringify(bankBalance),
      method: 'PUT',
    },
    {
      200: async () => true,
    }
  );

export const deleteBankBalance = async (companyId: number, id: number) =>
  await fetchWithCallback<true>(
    '/balance/bank/',
    `?company_id=${companyId}&id=${id}`,
    { method: 'DELETE' }
  );

export const getBankBalanceByDate = async (
  companyId: number,
  date: string // ISO-8601
) =>
  await fetchWithCallback<IBankBalance>(
    '/balance/bank/byDate/',
    `?company_id=${companyId}&date=${date}`
  );

/**
 * @param startDate "Inclusive (ISO-8601)"
 * @param endDate "Inclusive (ISO-8601)"
 */
export const getBankBalanceByDateRange = async (
  companyId: number,
  startDate: string,
  endDate: string
) =>
  await fetchWithCallback<IPaginated<IBankBalance>>(
    '/balance/bank/byDateRange/',
    `?company_id=${companyId}&start_date=${startDate}&end_date=${endDate}`
  );
