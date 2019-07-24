import { cleanup } from '@testing-library/react';
import * as api from '..';
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

  test.todo('get month by date range');
});

describe('account balance', () => {
  test.todo('get balance for a given day');
  test.todo('get balance for a date range');

  describe('bank balance', () => {
    test.todo('get bank balance by ID');
    test.todo('create a bank balance');
    test.todo('update an existing bank balance');
    test.todo('delete a bank balance');
    test.todo('get a bank balance for a given day');
    test.todo('get bank balances for a date range');
  });
});
