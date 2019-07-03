export enum TransactionType {
  income = 'Income',
  expense = 'Expense',
}

export interface ITransaction {
  id: number;
  description: string;
  money: number;
  date: Date;
  companyId: number;
  recurringId?: number;
  type: TransactionType;
  notes?: string;
}
