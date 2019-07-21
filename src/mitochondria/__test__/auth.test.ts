import { cleanup } from '@testing-library/react';
import * as api from '..';

afterEach(cleanup);

const loginEmail = () =>
  `${Math.floor(Math.random() * 1000000)}-test@liquidator.com`;
const loginFirstName = 'Admin';
const loginLastName = 'Liquid';
const loginPassword = 'password';

const registerObj = () => ({
  email: loginEmail(),
  first_name: loginFirstName,
  last_name: loginLastName,
  password: loginPassword,
});

describe('Authentication/Registration', () => {
  test('register creates a new user and returns user', async () => {
    const user = registerObj();
    const registerResp = await api.register(user);

    expect(registerResp.first_name).toBe(user.first_name);
    expect(registerResp.last_name).toBe(user.last_name);
    expect(registerResp.email).toBe(user.email);
    expect(registerResp.id).not.toBeNull();
  });

  test('register sets the user values in localStorage', async () => {
    await api.register(registerObj());

    expect(localStorage.getItem('access')).not.toBeFalsy();
    expect(localStorage.getItem('refresh')).not.toBeFalsy();
  });
});

describe('Authentication/Login', () => {
  test('login sets localStorage', async () => {
    const user = registerObj();

    await api.register(user);

    api.logout();

    await api.login(user.email, user.password);

    expect(localStorage.getItem('access')).not.toBeFalsy();
    expect(localStorage.getItem('refresh')).not.toBeFalsy();
  });
});

describe('Authentication/Logout', () => {
  test('removes localStorage values', () => {
    localStorage.setItem('access', 'access');
    localStorage.setItem('refresh', 'refresh');

    api.logout();

    expect(localStorage.getItem('access')).toBeFalsy();
    expect(localStorage.getItem('refresh')).toBeFalsy();
  });
});
