import { cleanup } from '@testing-library/react';
import moment from 'moment';
import * as api from '..';
import { IBankBalance } from '../../declarations/balance';
import { ICompany } from '../../declarations/company';
import { ITransaction } from '../../declarations/transaction';
import { createTx, setupTests } from '../../helpers/test-utils';

afterEach(cleanup);

let company: ICompany;

beforeAll(async () => {
  const [, c] = await setupTests();
  company = c;
});

describe('month', () => {
  test('get month', async () => {
    const [transaction, clean] = await createTx(company.id);
    const date = moment(transaction.date, moment.ISO_8601);
    const resp = await api.getMonth(
      date.month() + 1,
      date.year(),
      transaction.company_id
    );

    expect(
      resp.transactions.find(t => t.id === transaction.id)
    ).not.toBeUndefined();
    expect(resp.lowest_balance.money).not.toBeNull();
    expect(resp.balances.length).toBe(1);
    expect(resp.balances[0].money).toBe(-transaction.money);

    await clean();
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

      const resp = await api.getBankBalanceById(bb.company_id, bb.id);

      expect(resp).toEqual({ ...bb, money: 424242 });

      await api.deleteBankBalance(bb.company_id, bb.id);
    });

    test('get a bank balance for a given day', async () => {
      const bb = await api.createBankBalance({
        company_id: company.id,
        date: '2012-01-01',
        money: 400,
      });

      const resp = await api.getBankBalanceByDate(company.id, '2012-01-01');

      expect(resp).toEqual(bb);

      await api.deleteBankBalance(resp.company_id, resp.id);
    });

    test('get bank balances for a date range', async () => {
      const bb = await api.createBankBalance({
        company_id: company.id,
        date: '2011-04-01',
        money: 105023,
      });

      const resp = await (await api.getBankBalanceByDateRange(
        bb.company_id,
        '2010-01-01',
        '2012-12-31'
      )).next();

      expect(resp.value.find(e => e.id === bb.id)).not.toBeUndefined();

      await api.deleteBankBalance(bb.company_id, bb.id);
    });
  });
});
