export enum TransactionType {
  income = 'income',
  expense = 'expense',
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
