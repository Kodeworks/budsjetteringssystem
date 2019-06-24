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
): Promise<ILoginResponse | IError> => {
  const res = await fetch(`${BASE_URL}user/`, {
    body: JSON.stringify({ email, password, first_name, last_name }),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  });

  if (res.status === 201) {
    return await res.json() as ILoginResponse;
  } else if (res.status === 400) {
    return await res.json() as IError;
  }

  return { detail: 'Unexpected response from server.' };
};

export const login = async (email: string, password: string): Promise<ILoginResponse | IError> => {
  const res = await fetch(`${BASE_URL}user/login/`, {
    body: JSON.stringify({ email, password }),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  });

  if (res.status === 200) {
    return await res.json() as ILoginResponse;
  } else if (res.status === 400) {
    return await res.json() as IError;
  }

  return { detail: 'Unexpected response from server.' };
};
