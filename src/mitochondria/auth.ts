import { IUser } from '../declarations/user';

import { fetchWithCallback } from '.';

export interface ILoginResponse {
  user: IUser;
  access: string;
  refresh: string;
}

export const register = async (
  email: string,
  firstName: string,
  lastName: string,
  password: string
): Promise<IUser> => {
  // We want to clear the tokens, as if not, it will fail if tokens are outdated when logging in!
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');

  return await fetchWithCallback<IUser>(
    '/user/',
    '',
    {
      body: JSON.stringify({
        email,
        first_name: firstName,
        last_name: lastName,
        password,
      }),
      method: 'POST',
    },
    {
      201: async resp => {
        const parsedRes = (await resp.json()) as ILoginResponse;

        localStorage.setItem('access', parsedRes.access);
        localStorage.setItem('refresh', parsedRes.refresh);

        localStorage.setItem('user_id', parsedRes.user.id.toString());

        return parsedRes.user;
      },
    }
  );
};

export const login = async (
  email: string,
  password: string
): Promise<IUser> => {
  // We want to clear the tokens, as if not, it will fail if tokens are outdated when logging in!
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');

  return await fetchWithCallback<IUser>(
    '/user/login/',
    '',
    {
      body: JSON.stringify({ email, password }),
      method: 'POST',
    },
    {
      200: async resp => {
        const parsedRes = (await resp.json()) as ILoginResponse;

        localStorage.setItem('access', parsedRes.access);
        localStorage.setItem('refresh', parsedRes.refresh);

        localStorage.setItem('user_id', parsedRes.user.id.toString());

        return parsedRes.user;
      },
    }
  );
};

export const updateUser = async (
  id: number,
  firstName: string,
  lastName: string,
  email: string,
  password: string
) =>
  await fetchWithCallback<true>(
    '/user/',
    '',
    {
      body: JSON.stringify({
        email,
        first_name: firstName,
        id,
        last_name: lastName,
        password,
      }),
      method: 'PUT',
    },
    {
      200: async () => true,
    }
  );

export const deleteUser = async (email: string) =>
  await fetchWithCallback<true>(
    '/user/',
    `?email=${email}`,
    {
      method: 'DELETE',
    },
    {
      200: async () => true,
    }
  );

export const getUserById = async (id: number): Promise<IUser> =>
  await fetchWithCallback<IUser>('/user/', `?id=${id}`);

export const getUserByEmail = async (email: string): Promise<IUser> =>
  await fetchWithCallback<IUser>('/user/', `?email=${email}`);

export const logout = () => {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  localStorage.removeItem('user_id');

  // Force the application to rebuild, causing app to not have auth set anymore.
  window.location.reload();
};
