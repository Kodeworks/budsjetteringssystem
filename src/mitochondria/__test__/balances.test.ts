import { cleanup } from '@testing-library/react';
import * as api from '..';
import { ICompany } from '../../declarations/company';
import { ITransaction } from '../../declarations/transaction';

afterEach(cleanup);

describe('balances', () => {
  let company: ICompany;

  beforeAll(async () => {
    await api.login('testing@liquidator.com', 'password');
    company = await api.createCompany({
      name: 'Testing balance and month',
      org_nr: '4342148100',
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
        description: 'Testing motnh',
        money: 10000,
        type: 'IN',
      });
    });

    afterEach(async () => {
      const txs = await api.getTransactionsByDateRange(
        company.id,
        '4095-01-01',
        '4097-12-31'
      );

      for (const t of txs.results) {
        await api.deleteTransaction(t.company_id, t.id);
      }
    });

    test('get month', async () => {
      const resp = await api.getMonth(7, 4096, company.id);

      expect(resp.transactions).toEqual([transaction]);
      expect(resp.lowest_balance.money).toBe(0);
      expect(resp.balances.length).toBe(1);
      expect(resp.balances[0].money).toBe(transaction.money);
    });

    test.skip('get month by date range', async () => {
      const resp = await api.getMonthByDateRange(
        company.id,
        '4095-01-01',
        '4097-01-01'
      );
    });
  });
});
