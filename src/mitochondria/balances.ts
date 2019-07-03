import { IMonth } from '../declarations/month';

export interface IError {
  detail: string;
}

const BASE_URL = 'http://localhost:8000/';

const getMonth = async (month: number, year: number, companyId: number) => {
  const url = `${BASE_URL}month?month=${month}&year=${year}&company_id=${companyId}`;
  const result = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (result.status === 200) {
    const parsedResult = await result.json() as Array<IMonth>;

    return parsedResult;
  } else if (result.status === 400) {
    throw new Error((await result.json() as IError).detail);
  }

  throw new Error('Unexpected response from server.');
};

export default {
  getMonth,
};
