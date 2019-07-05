export type TransactionType = 'income' | 'expense';

interface IBaseTransaction {
  id: number;
  description: string;
  money: number;
  date: Date | string;
  companyId: number;
  recurringId?: number;
  type: TransactionType;
  notes?: string;
}

export interface ITransaction extends IBaseTransaction {
  date: Date;
}

export interface ITransactionResponse extends IBaseTransaction {
  date: string;
}
