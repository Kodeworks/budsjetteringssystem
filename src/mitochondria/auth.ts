import { IAuth } from '../declarations/auth';
import { IUser } from '../declarations/user';

import { fetchWithCallback } from '.';

export interface ILoginResponse extends IAuth {
  user: IUser;
}

export const register = async (
  email: string,
  firstName: string,
  lastName: string,
  password: string
): Promise<ILoginResponse> => {
  // We want to clear the tokens, as if not, it will fail if tokens are outdated when logging in!
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');

  return await fetchWithCallback(
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

        localStorage.setItem('user_id', parsedRes.user!.id.toString());

        return parsedRes;
      },
    }
  );
};

export const login = async (
  email: string,
  password: string
): Promise<ILoginResponse> => {
  // We want to clear the tokens, as if not, it will fail if tokens are outdated when logging in!
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');

  return await fetchWithCallback(
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

        localStorage.setItem('user_id', parsedRes.user!.id.toString());

        return parsedRes;
      },
    }
  );
};

export const getUserById = async (id: number): Promise<IUser> =>
  await fetchWithCallback<IUser>(
    '/user/',
    `?id=${id}`,
    {},
    {
      200: resp => resp.json() as Promise<IUser>,
    }
  );

export const logout = () => {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  localStorage.removeItem('user_id');

  // Force the application to rebuild, causing app to not have auth set anymore.
  window.location.reload();
};
