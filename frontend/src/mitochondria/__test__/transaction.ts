import { cleanup } from '@testing-library/react';
import moment from 'moment';
import * as api from '..';
import { ICompany } from '../../declarations/company';
import {
  IRecurringTransaction,
  ITransaction,
} from '../../declarations/transaction';
import {
  createRecurringTx,
  createTx,
  loginDetails,
  setupTests,
} from '../../helpers/test-utils';

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

    const txs = await (await api.getAllTransactions(company.id)).next();

    expect(txs.value.length).toBeGreaterThanOrEqual(2);
    expect(txs.value.find(e => e.id === transaction2.id)).not.toBeUndefined();
    expect(txs.value.find(e => e.id === transaction.id)).not.toBeUndefined();

    await clean1();
    await clean2();
  });

  test('get transactions by date', async () => {
    const [transaction, clean] = await createTx(company.id);

    const txs = await (await api.getTransactionsByDate(
      company.id,
      transaction.date
    )).next();

    expect(txs.value.find(e => e.id === transaction.id)).not.toBeUndefined();

    await clean();
  });

  test('get transactions by date range', async () => {
    const [transaction, clean] = await createTx(company.id);

    const txs = await (await api.getTransactionsByDateRange(
      company.id,
      transaction.date,
      transaction.date
    )).next();

    expect(txs.value.find(e => e.id === transaction.id)).not.toBeUndefined();
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
      const txs = await (await api.getAllIncomeTransactions(company.id)).next();

      expect(txs.value.find(e => e.id === incomeTx.id)).not.toBeUndefined();

      txs.value.forEach(t => {
        expect(t.type).toBe('IN');
      });
    });

    test('get all expense transactions', async () => {
      const txs = await (await api.getAllExpenseTransactions(
        company.id
      )).next();

      expect(txs.value.find(e => e.id === expsenseTx.id)).not.toBeUndefined();

      txs.value.forEach(t => {
        expect(t.type).toBe('EX');
      });
    });
  });
});

describe('recurring transactions', () => {
  test('create a new one', async () => {
    const [rtx, clean] = await createRecurringTx(company.id);

    expect(rtx).not.toBeFalsy();

    await clean();
  });

  test('delete one', async () => {
    const [rtx, clean] = await createRecurringTx(company.id);

    await clean();

    expect(
      api.getRecurringTransactionById(rtx.company_id, rtx.id)
    ).rejects.toThrow();
  });

  test('update', async () => {
    const [rtx, clean] = await createRecurringTx(company.id);

    await api.updateRecurringTransaction({
      ...rtx,
      interval: 4,
      template: {
        ...rtx.template,
        type: 'EX',
      },
    });

    const newRtx = await api.getRecurringTransactionById(
      rtx.company_id,
      rtx.id
    );

    expect(newRtx).toEqual({
      ...rtx,
      interval: 4,
      template: {
        ...rtx.template,
        type: 'EX',
      },
    });

    await clean();
  });

  describe('paginated responses', () => {
    let rtx1: IRecurringTransaction;
    let clean1: () => Promise<true>;
    let rtx2: IRecurringTransaction;
    let clean2: () => Promise<true>;

    beforeAll(async () => {
      const [r1, c1] = await createRecurringTx(company.id);
      rtx1 = r1;
      clean1 = c1;

      const r2 = await api.createRecurringTransaction({
        company_id: company.id,
        end_date: moment('2017-01-01').format('YYYY-MM-DD'),
        interval: 1,
        interval_type: 'DA',
        start_date: moment('1999-01-01').format('YYYY-MM-DD'),
        template: { money: 1, type: 'EX', description: "C'est la vie" },
      });

      rtx2 = r2;
      clean2 = () => api.deleteRecurringTransaction(r2.company_id, r2.id);
    });

    afterAll(async () => {
      await clean1();
      await clean2();
    });

    test('get all active', async () => {
      const resp = await (await api.getActiveRecurringTransactions(
        company.id
      )).next();

      expect(resp.value.find(e => e.id === rtx1.id)).not.toBeUndefined();
      expect(resp.value.find(e => e.id === rtx2.id)).toBeUndefined();
    });

    test('get all', async () => {
      const resp = await (await api.getAllRecurringTransactions(
        company.id
      )).next();

      expect(resp.value.find(e => e.id === rtx1.id)).not.toBeUndefined();
      expect(resp.value.find(e => e.id === rtx2.id)).not.toBeUndefined();
    });

    test.todo('get by date');
    test.todo('get by date range');
  });
});
