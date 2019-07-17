import { IMonth } from '../declarations/month';

import { fetchWithCallback } from '.';

const getMonth = async (month: number, year: number, companyId: number) => {
  return await fetchWithCallback<Array<IMonth>>(
    '/month/', `?month=${month}&year=${year}&company_id=${companyId}`,
    {}, // options: nothing, just rock the default
    { 200: resp => resp.json() as Promise<Array<IMonth>> },
  );
};

export default {
  getMonth,
};
