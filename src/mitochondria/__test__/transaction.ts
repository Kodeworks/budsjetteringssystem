import { cleanup } from '@testing-library/react';
import * as api from '..';
import { ICompany } from '../../declarations/company';
import { ITransaction } from '../../declarations/transaction';
import { loginDetails, setupTests } from '../../helpers/test-utils';

afterEach(cleanup);

let company: ICompany;
let transaction: ITransaction;

beforeAll(async () => {
  const [, c] = await setupTests();
  company = c;
});

afterAll(async () => {
  await api.deleteTransaction(transaction.company_id, transaction.id);
});

beforeEach(async () => {
  await api.login(loginDetails.email, loginDetails.password);

  transaction = await api.createTransaction({
    company_id: company.id,
    date: '2019-08-31',
    description: 'Test transaction #1',
    money: 424242,
    notes: 'Nothing really.',
    type: 'EX',
  });
});

afterEach(async () => {
  await api.deleteTransaction(transaction.company_id, transaction.id);
});

describe('actions working on singular transactions', () => {
  test('create and get transaction', async () => {
    const tx = await api.createTransaction({
      company_id: company.id,
      date: '2018-08-23',
      description: 'Test transaction',
      money: 10000, // 100 NOK
      type: 'EX',
    });

    const fetchedTx = await api.getTransaction(company.id, tx.id);

    expect(fetchedTx).toEqual(tx);

    await api.deleteTransaction(company.id, tx.id);
  });

  test('update transaction', async () => {
    const tx = await api.createTransaction({
      company_id: company.id,
      date: '1999-08-23',
      description: 'Testing update transaction',
      money: 10000,
      type: 'IN',
    });

    await api.updateTransaction({
      ...tx,
      description: 'Testing update second phase',
    });

    const fetchedTx = await api.getTransaction(tx.company_id, tx.id);

    expect(fetchedTx.description).toBe('Testing update second phase');

    await api.deleteTransaction(fetchedTx.company_id, fetchedTx.id);
  });

  test('delete transaction', async () => {
    const u = await api.login(loginDetails.email, loginDetails.password);

    const tx = await api.createTransaction({
      company_id: u.companies[0]!.company_id,
      date: '2018-08-23',
      description: 'Test transaction',
      money: 10000, // 100 NOK
      type: 'EX',
    });

    await api.deleteTransaction(tx.company_id, tx.id);

    expect(api.getTransaction(tx.company_id, tx.id)).rejects.toThrow();
  });
});

describe('actions returning plural transactions', () => {
  let transaction2: ITransaction;

  beforeEach(async () => {
    transaction2 = await api.createTransaction({
      company_id: company.id,
      date: '4096-08-23',
      description: 'Test transaction',
      money: 10000, // 100 NOK
      type: 'EX',
    });
  });

  afterEach(async () => {
    await api.deleteTransaction(company.id, transaction2.id);
  });

  test('get all transactions', async () => {
    const txs = await api.getAllTransactions(company.id);

    expect(txs.results.length).toBeGreaterThanOrEqual(2);
    expect(txs.results.find(e => e.id === transaction2.id)).not.toBeUndefined();
    expect(txs.results.find(e => e.id === transaction.id)).not.toBeUndefined();
  });

  test('get transactions by date', async () => {
    const txs = await api.getTransactionsByDate(company.id, '4096-08-23');

    expect(txs.results).toEqual([transaction2]);
  });

  test('get transactions by date range', async () => {
    const txs = await api.getTransactionsByDateRange(
      company.id,
      '3084-08-23',
      '8012-08-23'
    );

    expect(txs.results).toEqual([transaction2]);
  });

  describe('income/expense fetching', () => {
    let incomeTx: ITransaction;
    let expsenseTx: ITransaction;

    beforeEach(async () => {
      incomeTx = await api.createTransaction({
        company_id: company.id,
        date: '2018-08-23',
        description: 'Test transaction - income',
        money: 10000, // 100 NOK
        type: 'IN',
      });

      expsenseTx = await api.createTransaction({
        company_id: company.id,
        date: '2018-08-23',
        description: 'Test transaction - expense',
        money: 10000, // 100 NOK
        type: 'EX',
      });
    });

    afterEach(async () => {
      await api.deleteTransaction(company.id, incomeTx.id);
      await api.deleteTransaction(company.id, expsenseTx.id);
    });

    test('get all income transactions', async () => {
      const txs = await api.getAllIncomeTransactions(company.id);

      expect(txs.results.find(e => e.id === incomeTx.id)).not.toBeUndefined();

      txs.results.forEach(t => {
        expect(t.type).toBe('IN');
      });
    });

    test('get all expense transactions', async () => {
      const txs = await api.getAllExpenseTransactions(company.id);

      expect(txs.results.find(e => e.id === expsenseTx.id)).not.toBeUndefined();

      txs.results.forEach(t => {
        expect(t.type).toBe('EX');
      });
    });
  });
});