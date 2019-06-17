export enum TransactionType {
  income = 'Income',
  expense = 'Expense',
}

export interface ITransaction {
  id: number;
  name: string;
  money: number;
  date: string; // date format string
  companyId: number;
  recurringId?: number;
  type: TransactionType;
  notes?: string;
}
