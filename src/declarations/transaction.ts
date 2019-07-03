export enum TransactionType {
  income = 'income',
  expense = 'expense',
}

export interface ITransaction {
  id: number;
  description: string;
  money: number;
  date: string; // date format string
  companyId: number;
  recurringId?: number;
  type: TransactionType;
  notes?: string;
}
