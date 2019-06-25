import { IAuth } from '../declarations/auth';
import { IUser } from '../declarations/user';

export interface IError { detail: string; }
export interface ILoginResponse extends IAuth {
  user?: IUser;
}

const BASE_URL = 'http://localhost:8000/' as const;

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

export const fetchUserById = async (id: number, token: string): Promise<IUser> => {
  const res = await fetch(`${BASE_URL}user/?id=${id}`, { headers: { Authorization: `Bearer ${token}` } });

  if (res.status === 200) {
    const parsedRes = await res.json() as IUser;

    return parsedRes;
  } else if (res.status === 400) {
    throw new Error((await res.json() as IError).detail);
  } else if (res.status === 404) {
    throw new Error((await res.json() as IError).detail);
  }

  throw new Error('Unexpected response from server.');
};

export const logout = () => {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  localStorage.removeItem('user_id');

  // Force the application to rebuild, causing app to not have auth set anymore.
  window.location.reload();
};
