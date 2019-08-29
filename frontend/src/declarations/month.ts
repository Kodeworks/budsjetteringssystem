import { IBalance, IBankBalance } from './balance';
import { IRecurringTransaction, ITransaction } from './transaction';

export interface IMonth {
  year: number;
  month: number;
  transactions: Array<ITransaction>;
  recurring: Array<{ object: IRecurringTransaction; dates: Array<string> }>;
  balances: Array<IBalance>;
  bank_balances: Array<IBankBalance>;
  start_balance: number;
  lowest_balance: IBalance;
}
