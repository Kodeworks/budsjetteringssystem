import { IBalance } from './balance';
import { ITransaction } from './transaction';

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
