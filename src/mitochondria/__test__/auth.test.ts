import { cleanup } from '@testing-library/react';
import * as api from '..';
import { IUser } from '../../declarations/user';

afterEach(cleanup);

const registerObj = () => ({
  email: `${Math.floor(
    Math.random() * 1000000
  )}-kinds-of-people@i-know.all.com`,
  first_name: 'Admin',
  last_name: 'Liquid',
  password: 'password',
});

describe('authentication', () => {
  let user: IUser;
  let initialAuth: [string, string, string];

  beforeEach(async () => {
    user = await api.login('testing@liquidator.com', 'password');

    /**
     * We want to save the information that was in the localStorage so we can restore
     * the session before leaving the test. This way, we can delete the test user
     * after the test is done.
     */
    initialAuth = [
      localStorage.getItem('access'),
      localStorage.getItem('refresh'),
      localStorage.getItem('user_id'),
    ] as [string, string, string];
  });

  test('register creates a new user and returns user', () => {
    expect(user.first_name).toBe(user.first_name);
    expect(user.last_name).toBe(user.last_name);
    expect(user.email).toBe(user.email);
    expect(user.id).not.toBeNull();
  });

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

    await api.login(user.email, registerObj().password);

    expect(localStorage.getItem('access')).not.toBeFalsy();
    expect(localStorage.getItem('refresh')).not.toBeFalsy();
  });

  test('update user', async () => {
    const firstName = `${Math.random()}`;
    const lastName = `${Math.random()}`;

    expect(
      await api.updateUser({
        ...user,
        first_name: firstName,
        last_name: lastName,
      })
    ).toBe(true);

    const resp = await api.getUserById(user.id);

    expect(resp.id).toBe(user.id);
    expect(resp.first_name).toBe(firstName);
    expect(resp.last_name).toBe(lastName);
  });

  test('delete user', async () => {
    const newUserRegister = {
      ...registerObj(),
      email: 'willbedeletedshortly@hotmail.com',
    };

    const newUser = await api.register(newUserRegister);

    expect(await api.deleteUser(newUser.email)).toBe(true);

    expect(api.getUserByEmail(newUser.email)).rejects.toThrow();
  });

  test('get user by ID', async () => {
    expect(await api.getUserById(user.id)).toEqual(user);
  });

  test('get user by email', async () => {
    expect(await api.getUserByEmail(user.email)).toEqual(user);
  });
});
