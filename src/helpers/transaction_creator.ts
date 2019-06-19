import { ITransaction, TransactionType } from '../declarations/transaction';

const words: Array<string> = [
  'Otter',
  'Gerbil',
  'Fish',
  'Party',
  'Fluor',
  'Hereditary',
  'Consecutive',
  'Sustenance',
  'Party',
  'Paycheck',
  'Food',
  'Drinks',
];

const randomWord = (): string => words[Math.floor(Math.random() * words.length)];

const types: Array<TransactionType> = [
  TransactionType.expense,
  TransactionType.income,
];

const randomType = (): TransactionType => types[Math.floor(Math.random() * types.length)];

let i: number = 0;

export const createDummyTransaction = (): ITransaction => ({
  companyId: 0,
  date: new Date(Math.floor(Math.random() * 1500000000000)).toLocaleDateString(),
  id: i++,
  money: Math.random() * 10000,
  name: `${randomWord()} ${randomWord()}`,
  notes: Math.random() > 0.5 ? (new Array(30)).fill(null).map(randomWord).join(' ') : undefined,
  type: randomType(),
});
