import { cleanup } from '@testing-library/react';
import nock from 'nock';
import * as api from '..';

afterEach(cleanup);

const access = 'welcome to';
const refresh = 'the jungle';

const loginEmail = 'admin@liquidator.com';
const loginFirstName = 'Admin';
const loginLastName = 'Liquid';
const loginPassword = 'password';

describe('Authentication/Registration', () => {
  beforeEach(() => {
    nock('http://localhost:1337')
      .defaultReplyHeaders({
        'access-control-allow-headers': 'authorization',
        'access-control-allow-origin': '*',
      })
      .options('/user/')
      .reply(200)
      .post('/user/')
      .reply(201, (uri: string, requestBody: any) => {
        const { email, first_name, last_name } = requestBody.valueOf();
        return { user: { email, first_name, last_name, companies: [], id: 0 }, access, refresh };
      });
  });

  test('register creates a new user and returns it along with tokens', async () => {
    const registerResp = await api.register(loginEmail, loginFirstName, loginLastName, loginPassword);
    expect(registerResp).toEqual({
      access,
      refresh,
      user: {
        companies: [],
        email: loginEmail,
        first_name: loginFirstName,
        id: 0,
        last_name: loginLastName,
      },
    });
  });

  test('register sets the user values in localStorage', async () => {
    await api.register(loginEmail, loginFirstName, loginLastName, loginPassword);

    expect(localStorage.getItem('access')).toBe(access);
    expect(localStorage.getItem('refresh')).toBe(refresh);
  });

});

describe('Authentication/Login', () => {
  beforeEach(() => {
    nock('http://localhost:1337')
      .defaultReplyHeaders({
        'access-control-allow-headers': 'authorization',
        'access-control-allow-origin': '*',
      })
      .options('/user/login/')
      .reply(200)
      .post('/user/login/')
      .reply(200, (uri: string, requestBody: any) => {
        const { email, first_name, last_name } = requestBody.valueOf();
        return {
          access,
          refresh,
          user: { email, companies: [], id: 0, first_name, last_name },
        };
      });
  });

  test('login sets localStorage', async () => {
    await api.login(loginEmail, loginPassword);

    expect(localStorage.getItem('access')).toBe(access);
    expect(localStorage.getItem('refresh')).toBe(refresh);
  });
});
