import { cleanup } from '@testing-library/react';
import * as api from '..';
import { ICompany } from '../../declarations/company';
import { ITransaction } from '../../declarations/transaction';
import { createTx, loginDetails, setupTests } from '../../helpers/test-utils';

afterEach(cleanup);

let company: ICompany;

beforeAll(async () => {
  const [, c] = await setupTests();
  company = c;
});

beforeEach(async () => {
  await api.login(loginDetails.email, loginDetails.password);
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
  test('get all transactions', async () => {
    const [transaction, clean1] = await createTx(company.id);
    const [transaction2, clean2] = await createTx(company.id);

    const txs = await api.getAllTransactions(company.id);

    expect(txs.results.length).toBeGreaterThanOrEqual(2);
    expect(txs.results.find(e => e.id === transaction2.id)).not.toBeUndefined();
    expect(txs.results.find(e => e.id === transaction.id)).not.toBeUndefined();

    await clean1();
    await clean2();
  });

  test('get transactions by date', async () => {
    const [transaction, clean] = await createTx(company.id);

    const txs = await api.getTransactionsByDate(company.id, transaction.date);

    expect(txs.results.find(e => e.id === transaction.id)).not.toBeUndefined();

    await clean();
  });

  test('get transactions by date range', async () => {
    const [transaction, clean] = await createTx(company.id);

    const txs = await api.getTransactionsByDateRange(
      company.id,
      transaction.date,
      transaction.date
    );

    expect(txs.results.find(e => e.id === transaction.id)).not.toBeUndefined();
    await clean();
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
