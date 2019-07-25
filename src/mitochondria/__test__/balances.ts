import { cleanup } from '@testing-library/react';
import * as api from '..';
import { IBankBalance } from '../../declarations/balance';
import { ICompany } from '../../declarations/company';
import { ITransaction } from '../../declarations/transaction';
import { setupTests } from '../../helpers/test-utils';

afterEach(cleanup);

let company: ICompany;

beforeAll(async () => {
  await setupTests();

  company = await api.createCompany({
    name: 'balances would like to test',
    org_nr: '100010243892490187',
  });
});

afterAll(async () => {
  await api.deleteCompany(company.id);
});

describe('month', () => {
  let transaction: ITransaction;

  beforeEach(async () => {
    transaction = await api.createTransaction({
      company_id: company.id,
      date: '4096-07-25',
      description: 'Testing month',
      money: 10000,
      type: 'IN',
    });
  });

  afterEach(async () => {
    for (const t of (await api.getAllTransactions(company.id)).results) {
      await api.deleteTransaction(t.company_id, t.id);
    }
  });

  test('get month', async () => {
    const resp = await api.getMonth(7, 4096, company.id);

    expect(
      resp.transactions.find(t => t.id === transaction.id)
    ).not.toBeFalsy();
    expect(resp.lowest_balance.money).not.toBeNull();
    expect(resp.balances.length).toBe(1);
    expect(resp.balances[0].money).toBe(transaction.money);
  });

  test('get month that does not have any balances', async () => {
    const resp = await api.getMonth(1, 2000, company.id);

    expect(resp.balances.length).toBe(0);
  });

  test.todo('get month by date range');
});

describe('account balance', () => {
  test('get balance for a given day', async () => {
    const resp = await api.getBalanceForDay(company.id, '2019-08-23');

    expect(resp.date).toBe('2019-08-23');
    expect(resp.company_id).toBe(company.id);
    expect(resp.money).not.toBeNull();
  });

  test('get balance for a date range', async () => {
    const txs: Array<ITransaction> = [];

    for (const d of [23, 24, 25, 26]) {
      txs.push(
        await api.createTransaction({
          company_id: company.id,
          date: `2019-08-${d}`,
          description: 'Test transaction',
          money: 100,
          type: 'IN',
        })
      );
    }

    const resp = await api.getBalanceByDateRange(
      company.id,
      '2019-08-23',
      '2019-08-26'
    );

    expect(resp.length).toBe(4);

    for (const tx of txs) {
      await api.deleteTransaction(tx.company_id, tx.id);
    }
  });

  describe('bank balance', () => {
    let bankBalance: IBankBalance;

    beforeAll(async () => {
      bankBalance = await api.createBankBalance({
        company_id: company.id,
        date: '2019-08-23',
        money: 10000,
      });
    });

    afterAll(async () => {
      await api.deleteBankBalance(bankBalance.company_id, bankBalance.id);
    });

    test('get bank balance by ID', async () => {
      const resp = await api.getBankBalanceById(
        bankBalance.company_id,
        bankBalance.id
      );

      expect(resp.money).not.toBeNull();
    });

    test('create and delete a bank balance', async () => {
      const bb = await api.createBankBalance({
        company_id: company.id,
        date: '4096-01-01',
        money: 10000,
      });

      expect(bb).not.toBeNull();

      await api.deleteBankBalance(bb.company_id, bb.id);

      expect(api.getBankBalanceById(bb.company_id, bb.id)).rejects.toThrow();
    });

    test('update an existing bank balance', async () => {
      const bb = await api.createBankBalance({
        company_id: company.id,
        date: '4096-01-01',
        money: 10000,
      });

      await api.updateBankBalance({
        ...bb,
        money: 424242,
      });

      expect(api.getBankBalanceById(bb.company_id, bb.id)).resolves.toEqual({
        ...bb,
        money: 424242,
      });

      await api.deleteBankBalance(bb.company_id, bb.id);
    });

    test('get a bank balance for a given day', async () => {
      const bb = await api.createBankBalance({
        company_id: company.id,
        date: '4096-01-01',
        money: 10000,
      });

      const resp = await api.getBankBalanceByDate(bb.company_id, bb.date);

      expect(resp).toEqual(bb);

      await api.deleteBankBalance(bb.company_id, bb.id);
    });

    test('get bank balances for a date range', async () => {
      const bb = await api.createBankBalance({
        company_id: company.id,
        date: '4097-01-01',
        money: 10000,
      });

      const resp = await api.getBankBalanceByDateRange(
        bb.company_id,
        '4097-01-01',
        '4097-12-31'
      );

      expect(resp.results.find(e => e.id === bb.id)).toBeTruthy();

      await api.deleteBankBalance(bb.company_id, bb.id);
    });
  });
});
