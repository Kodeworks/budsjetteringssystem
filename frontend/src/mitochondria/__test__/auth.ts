import { cleanup } from '@testing-library/react';
import * as api from '..';
import { IUser } from '../../declarations/user';
import { loginDetails, setupTests } from '../../helpers/test-utils';

afterEach(cleanup);

let user: IUser;

beforeAll(async () => {
  const [u] = await setupTests();
  user = u;
});

beforeEach(async () => {
  await api.login(loginDetails.email, loginDetails.password);
});

describe('manipulating localstorage tokens', () => {
  test('register sets the user values in localStorage', () => {
    expect(localStorage.getItem('access')).not.toBeFalsy();
    expect(localStorage.getItem('refresh')).not.toBeFalsy();
  });

  test('removes localStorage values', () => {
    api.logout();

    expect(localStorage.getItem('access')).toBeFalsy();
    expect(localStorage.getItem('refresh')).toBeFalsy();
  });

  test('login sets localStorage', async () => {
    api.logout();

    await api.login(user.email, loginDetails.password);

    expect(localStorage.getItem('access')).not.toBeFalsy();
    expect(localStorage.getItem('refresh')).not.toBeFalsy();
  });

  test('refetch token if it expired', async () => {
    localStorage.setItem('access', 'invalid');
    expect(api.getUserById(user.id)).rejects.toThrow();
  });

  test('throw if refresh token expired', async () => {
    localStorage.setItem('access', 'invalid');
    localStorage.setItem('refresh', 'invalid');
    expect(api.getUserById(user.id)).rejects.toThrow();
  });
});

// Currently not working on the backend.
test.skip('update user', async () => {
  expect(
    await api.updateUser({
      email: user.email,
      first_name: 'John',
      id: user.id,
      last_name: 'Doe',
    })
  ).toBe(true);

  await api.login(loginDetails.email, loginDetails.password);

  const resp = await api.getUserById(user.id);

  expect(resp.first_name).toBe('John');
  expect(resp.last_name).toBe('Doe');

  await api.updateUser({
    email: user.email,
    first_name: 'Testing',
    id: user.id,
    last_name: 'Testingsson',
  });
});

test('delete yourself', async () => {
  const newUserRegister = {
    email: 'willbedeletedshortly@hotmail.com',
    first_name: 'Something',
    last_name: 'Funny',
    password: 'password',
  };

  const newUser = await api.register(newUserRegister);

  expect(localStorage.getItem('refresh')).not.toBeFalsy();
  expect(localStorage.getItem('access')).not.toBeFalsy();

  expect(await api.deleteUser()).toBe(true);

  await api.login(loginDetails.email, loginDetails.password);

  expect(api.getUserByEmail(newUser.email)).rejects.toThrow();
});

test('get user by ID', async () => {
  expect(await api.getUserById(user.id)).toEqual(user);
});

test('get user by email', async () => {
  expect(await api.getUserByEmail(user.email)).toEqual(user);
});
