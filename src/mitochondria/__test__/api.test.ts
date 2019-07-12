import { cleanup } from '@testing-library/react';
import { create } from 'domain';
import nock from 'nock';
import React from 'react';
import {post} from '..';
import * as api from '../';
import { ITransaction } from '../../declarations/transaction';
import { INewTransaction } from '../transactions';

afterEach(cleanup);

describe('Post to API', () => {
  test('createTransaction should return with status 201', async () => {
    const testTransaction = {
      company_id: 1,
      date: '2019-12-16',
      description: 'Test transaction description',
      money: 200,
      notes: 'Test transaction note',
      type: (['income', 'expense'])[Math.floor(Math.random() * 2)],
    } as INewTransaction;
    nock('http://localhost:8000')
      .defaultReplyHeaders({ 'access-control-allow-origin': '*', 'access-control-allow-headers': 'authentication' })
      .options('/transaction/')
      .reply(200)
      .post('/transaction/')
      .reply(201, function(uri, requestBody) {
        return {...requestBody.valueOf(), id: 0};
      });

    try {
      const response = await api.createTransaction(testTransaction, {access: 'test auth'});
      expect(response.status).toBe(201);
      const createdTransaction = await response.json() as ITransaction;
      expect(createdTransaction.company_id).toBe(testTransaction.company_id);
      expect(createdTransaction.date).toBe(testTransaction.date);
      expect(createdTransaction.description).toBe(testTransaction.description);
      expect(createdTransaction.money).toBe(testTransaction.money);
      expect(createdTransaction.notes).toBe(testTransaction.notes);
      expect(createdTransaction.type).toBe(testTransaction.type);
      expect(createdTransaction.id);
    } catch (e) {
      throw e;
    }
  });
});
