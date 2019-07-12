import { IAuth } from '../declarations/auth';
import { IUser } from '../declarations/user';

export interface IError { detail: string; }
export interface ILoginResponse extends IAuth {
  user: IUser;
}
export interface ITokenResponse { access: string; }

const BASE_URL = 'https://murmuring-refuge-71505.herokuapp.com/' as const; // 'http://localhost:8000/' as const;

export const register = async (
  // We're ignoring as the backend wants this in snake_case, and this is a simpler approach.
  // tslint:disable-next-line
  email: string, password: string, first_name: string, last_name: string,
): Promise<ILoginResponse> => {
  const res = await fetch(`${BASE_URL}user/`, {
    body: JSON.stringify({ email, password, first_name, last_name }),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  });

  if (res.status === 201) {
    const parsedRes = await res.json() as ILoginResponse;

    localStorage.setItem('access', parsedRes.access);
    localStorage.setItem('refresh', parsedRes.refresh);

    localStorage.setItem('user_id', parsedRes.user!.id.toString());

    return parsedRes;
  } else if (res.status === 400) {
    throw new Error((await res.json() as IError).detail);
  }

  throw new Error('Unexpected response from server.');
};

export const login = async (email: string, password: string): Promise<ILoginResponse> => {
  const res = await fetch(`${BASE_URL}user/login/`, {
    body: JSON.stringify({ email, password }),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  });

  if (res.status === 200) {
    const parsedRes = await res.json() as ILoginResponse;

    localStorage.setItem('access', parsedRes.access);
    localStorage.setItem('refresh', parsedRes.refresh);

    localStorage.setItem('user_id', parsedRes.user!.id.toString());

    return parsedRes;
  } else if (res.status === 400) {
    throw new Error((await res.json() as IError).detail);
  }

  throw new Error('Unexpected response from server.');
};

/**
 * @returns "Whether we successfully managed to fetch a new access token"
 */
export const fetchNewToken = async (): Promise<string> => {
  const refresh = localStorage.getItem('refresh');

  const res = await fetch(`${BASE_URL}user/refresh/`, {
    body: JSON.stringify({ refresh }),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  });

  switch (res.status) {
  case 200:
    return (await res.json() as ITokenResponse).access;
  case 401:
    // The refresh token has expired
    throw new Error('Refresh token has expired.');
  default:
    throw new Error('Unexpected response from server.');
  }
};

export const fetchUserById = async (id: number, token: string): Promise<IUser> => {
  const res = await fetch(`${BASE_URL}user/?id=${id}`, { headers: { Authorization: `Bearer ${token}` } });

  switch (res.status) {
  case 200:
    return await res.json() as IUser;
  case 400:
    throw new Error((await res.json() as IError).detail);
  case 401:
    try {
      const newToken = await fetchNewToken();
      localStorage.setItem('access', newToken);
      return await fetchUserById(id, newToken);
    } catch (e) {
      throw new Error(e);
    }

  case 404:
    throw new Error((await res.json() as IError).detail);
  default:
    throw new Error('Unexpected response from server.');
  }
};

export const logout = () => {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  localStorage.removeItem('user_id');

  // Force the application to rebuild, causing app to not have auth set anymore.
  window.location.reload();
};
