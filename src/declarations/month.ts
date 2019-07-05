import { ITransactionResponse } from './transaction';

export interface IBalance {
  'company_id': number;
  'date': string;
  'money': number;
}

export interface IMonth {
  'year': number;
  'month': number;
  'transactions': Array<ITransactionResponse>;
  'balance': Array<IBalance>;
  'start_balance': number;
  'lowest_balance': number;
  'next': string;
  'previous': string;
}
