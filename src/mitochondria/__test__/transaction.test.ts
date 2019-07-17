import { cleanup } from '@testing-library/react';
import nock from 'nock';
import * as api from '..';
import { INewTransaction } from '../transactions';

afterEach(cleanup);

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
  nock('http://localhost:1337')
    .defaultReplyHeaders({ // because of CORS in development, the three next lines are necessary.
      'access-control-allow-headers': 'authorization',
      'access-control-allow-origin': '*',
    })
    .options('/transaction/')
    .reply(200)
    .post('/transaction/')
    .reply(201, (uri, requestBody) => ({ ...requestBody.valueOf(), id: 0 }));

  const createdTransaction = await api.createTransaction(testTransaction);
  expect(createdTransaction.company_id).toBe(testTransaction.company_id);
  expect(createdTransaction.date).toBe(testTransaction.date);
  expect(createdTransaction.description).toBe(testTransaction.description);
  expect(createdTransaction.money).toBe(testTransaction.money);
  expect(createdTransaction.notes).toBe(testTransaction.notes);
  expect(createdTransaction.type).toBe(testTransaction.type);
  expect(createdTransaction.id);
});
