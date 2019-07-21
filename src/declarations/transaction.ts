export type TransactionType = 'IN' | 'EX';

export interface ITransaction {
  id: number;
  description: string;
  money: number;
  date: string; // ISO 8601 format: 'YYYY-MM-DD'
  company_id: number;
  recurring_id?: number;
  type: TransactionType;
  notes?: string;
}

export interface IIncomeTransaction extends ITransaction {
  type: 'IN';
}

export interface IExpenseTransaction extends ITransaction {
  type: 'EX';
}

interface IRecurringTransactionTemplate {
  id: number;
  money: number;
  type: TransactionType;
  description: string;
  notes: string;
}

export type RecurringTransactionInterval = 'DA' | 'MO';

export interface IRecurringTransaction {
  id: number;
  template: IRecurringTransactionTemplate;
  company_id: number;
  interval: number;
  interval_type: RecurringTransactionInterval;
  start_date: string;
  end_date: string;
  transactions: Array<ITransaction['id']>; // this makes it clearer that it is a reference to the IDs
}

export interface ICreateRecurringTransaction
  extends Omit<IRecurringTransaction, 'id' | 'transactions' | 'template'> {
  template: Omit<IRecurringTransactionTemplate, 'id'>;
}

export interface IUpdateRecurringTransaction
  extends Omit<IRecurringTransaction, 'transactions'> {}
