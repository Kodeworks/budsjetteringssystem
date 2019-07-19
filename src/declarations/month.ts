import { IPaginated } from './pagination';
import { ITransaction } from './transaction';

export interface IBalance {
  company_id: number;
  date: string;
  money: number;
}

export interface IMonth {
  year: number;
  month: number;
  transactions: Array<ITransaction>;
  balance: Array<IBalance>;
  start_balance: number;
  lowest_balance: number;
  next: string;
  previous: string;
}

export interface IPaginatedMonths extends IPaginated {
  months: Array<IMonth>;
}
