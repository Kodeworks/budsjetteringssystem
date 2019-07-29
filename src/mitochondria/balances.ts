import { fetchWithCallback } from '.';

type IMonth = import('../declarations/month').IMonth;
type IPaginatedMonths = import('../declarations/month').IPaginatedMonths;

export const getMonth = async (
  month: number,
  year: number,
  companyId: number
) =>
  await fetchWithCallback<Array<IMonth>>(
    '/month/',
    `?month=${month}&year=${year}&company_id=${companyId}`,
    {}, // options: nothing, just rock the default
    { 200: resp => resp.json() as Promise<Array<IMonth>> }
  );

export const getAllMonths = async (companyId: number) =>
  await fetchWithCallback<IPaginatedMonths>(
    '/month/all/',
    `?company_id=${companyId}`,
    {},
    {
      200: resp => resp.json() as Promise<IPaginatedMonths>,
    }
  );

/**
 * @summary "Get a paginated response with months in a date range."
 * @param startDate "Inclusive (ISO-8601)"
 * @param endDate "Inclusive (ISO-8601)"
 */
export const getMonthInDateRange = async (
  companyId: number,
  startDate: string,
  endDate: string
) =>
  await fetchWithCallback<IPaginatedMonths>(
    '/month/byDateRange/',
    `?company_id=${companyId}&start_date=${startDate}&end_date=${endDate}`,
    {},
    {
      200: resp => resp.json() as Promise<IPaginatedMonths>,
    }
  );
