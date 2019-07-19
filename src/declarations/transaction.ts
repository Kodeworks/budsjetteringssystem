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
