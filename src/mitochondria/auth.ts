import { IAuth } from '../declarations/auth';
import { IUser } from '../declarations/user';

import { fetchWithCallback } from '.';

export interface ILoginResponse extends IAuth {
  user: IUser;
}

export const register = async (
  email: string, firstName: string, lastName: string, password: string,
): Promise<ILoginResponse> => {
  return await fetchWithCallback('/user/', '', {
    body: JSON.stringify({ email, password, first_name: firstName, last_name: lastName }),
    method: 'POST',
  }, {
      201: async resp => {
        const parsedRes = await resp.json() as ILoginResponse;

        localStorage.setItem('access', parsedRes.access);
        localStorage.setItem('refresh', parsedRes.refresh);

        localStorage.setItem('user_id', parsedRes.user!.id.toString());

        return parsedRes;
      },
    },
  );
};

export const login = async (email: string, password: string): Promise<ILoginResponse> => {
  return await fetchWithCallback('/user/login/', '', {
    body: JSON.stringify({ email, password }),
    method: 'POST',
  }, {
      200: async resp => {
        const parsedRes = await resp.json() as ILoginResponse;

        localStorage.setItem('access', parsedRes.access);
        localStorage.setItem('refresh', parsedRes.refresh);

        localStorage.setItem('user_id', parsedRes.user!.id.toString());

        return parsedRes;
      },
    },
  );
};

export const fetchUserById = async (id: number, token: string): Promise<IUser> => {
  return await fetchWithCallback('/user/', `?id=${id}`, {}, {
    200: async resp => await resp.json() as IUser,
  });
};

export const logout = () => {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  localStorage.removeItem('user_id');

  // Force the application to rebuild, causing app to not have auth set anymore.
  window.location.reload();
};
