import { cleanup } from '@testing-library/react';
import * as api from '..';
import { ICompany } from '../../declarations/company';
import { ITransaction } from '../../declarations/transaction';
import { IUser } from '../../declarations/user';

afterEach(cleanup);

describe('transaction', () => {
  let company: ICompany;
  let transaction: ITransaction;

  beforeAll(async () => {
    await api.login('testing@liquidator.com', 'password');
    company = await api.getCompanyById(143);
  });

  beforeEach(async () => {
    transaction = await api.getTransaction(company.id, 1);
  });

  test('create transaction', async () => {
    const tx = await api.createTransaction({
      company_id: company.id,
      date: '2018-08-23',
      description: 'Test transaction',
      money: 10000, // 100 NOK
      type: 'EX',
    });

    expect((await api.getTransaction(company.id, tx.id)).id).not.toBeNull();

    await api.deleteTransaction(company.id, tx.id);
  });

  test('get transaction by ID', async () => {
    const tx = await api.getTransaction(company.id, transaction.id);

    expect(tx).toEqual(transaction);
  });

  test('update transaction', async () => {
    await api.updateTransaction({
      ...transaction,
      description: 'Testing update function',
    });

    expect(
      (await api.getTransaction(company.id, transaction.id)).description
    ).toBe('Testing update function');

    await api.updateTransaction(transaction);
  });

  test('delete transaction', async () => {
    const tx = await api.createTransaction({
      company_id: company.id,
      date: '2018-08-23',
      description: 'Test transaction',
      money: 10000, // 100 NOK
      type: 'EX',
    });

    expect((await api.getTransaction(company.id, tx.id)).id).not.toBeNull();

    await api.deleteTransaction(company.id, tx.id);

    expect(api.getTransaction(company.id, tx.id)).rejects.toThrow();
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
      expect(
        txs.results.find(e => e.id === transaction2.id)
      ).not.toBeUndefined();
      expect(
        txs.results.find(e => e.id === transaction.id)
      ).not.toBeUndefined();
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

        expect(
          txs.results.find(e => e.id === expsenseTx.id)
        ).not.toBeUndefined();

        txs.results.forEach(t => {
          expect(t.type).toBe('EX');
        });
      });
    });
  });
});
