import { cleanup } from '@testing-library/react';
import nock from 'nock';
import * as api from '../';
import { ITransaction } from '../../declarations/transaction';
import { INewTransaction } from '../transactions';

afterEach(cleanup);

describe('Post to API', () => {
  test('createTransaction should return with a valid new transaction with id', async () => {
    const testTransaction = {
      company_id: 1,
      date: '2019-12-16',
      description: 'Test transaction description',
      money: 200,
      notes: 'Test transaction note',
      type: ['income', 'expense'][Math.floor(Math.random() * 2)],
    } as INewTransaction;
    // See https://github.com/nock/nock on using nock to mock API responses.
    nock('http://localhost:8000')
      // because of CORS in development, the three next lines are necessary.
      .defaultReplyHeaders({
        'access-control-allow-headers': 'authentication',
        'access-control-allow-origin': '*',
      })
      .options('/transaction/')
      .reply(200)
      .post('/transaction/')
      .reply(201, (uri, requestBody) => ({ ...requestBody.valueOf(), id: 0 }));

    const response = await api.createTransaction(testTransaction);
    expect(response.status).toBe(201);
    const createdTransaction = (await response.json()) as ITransaction;
    expect(createdTransaction.company_id).toBe(testTransaction.company_id);
    expect(createdTransaction.date).toBe(testTransaction.date);
    expect(createdTransaction.description).toBe(testTransaction.description);
    expect(createdTransaction.money).toBe(testTransaction.money);
    expect(createdTransaction.notes).toBe(testTransaction.notes);
    expect(createdTransaction.type).toBe(testTransaction.type);
    expect(createdTransaction.id);
  });
});
