import { IMonth } from '../declarations/month';
import { IError } from './';

const BASE_URL = 'http://localhost:8000/';

// tslint:disable-next-line: variable-name
const getMonth = async (month: number, year: number, company_id: number) => {
  const url = `${BASE_URL}month?month=${month}&year=${year}&company_id=${company_id}`;
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
