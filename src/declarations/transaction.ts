export type TransactionType = 'income' | 'expense';

export interface ITransaction {
  id: number;
  description: string;
  money: number;
  date: string;  // ISO 8601 format: 'YYYY-MM-DD'
  companyId: number;
  recurringId?: number;
  type: TransactionType;
  notes?: string;
}
