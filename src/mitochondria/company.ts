import { fetchWithCallback } from '.';
import { ICompany } from '../declarations/company';

export const createCompany = (id: number, name: string, orgNr: string) =>
  fetchWithCallback<ICompany>(
    '/company/',
    '',
    {
      body: JSON.stringify({ id, name, org_nr: orgNr }),
      method: 'POST',
    },
    {
      201: resp => resp.json() as Promise<ICompany>,
    }
  );

export const getCompanyById = (companyId: number) =>
  fetchWithCallback<ICompany>(
    '/company/',
    `?company_id=${companyId}`,
    {},
    {
      200: resp => resp.json() as Promise<ICompany>,
      400: () => {
        throw new Error(`Could not find company with ID ${companyId}.`);
      },
    }
  );

export const updateCompany = (id: number, name: string, orgNr: string) =>
  fetchWithCallback<boolean>(
    '/company/',
    '',
    {
      body: JSON.stringify({ id, name, org_nr: orgNr }),
      method: 'PUT',
    },
    {
      200: async () => true, // we have to return a promise as async function
    }
  );

export const deleteCompany = (companyId: number) =>
  fetchWithCallback<boolean>(
    '/company/',
    `?company_id=${companyId}`,
    {
      method: 'DELETE',
    },
    {
      200: async () => true,
    }
  );

type Role = 'Reporter' | 'User' | 'Owner';

export const addUserToCompany = (
  companyId: number,
  userId: number,
  role?: Role
) =>
  fetchWithCallback<boolean>(
    '/company/addUser/',
    '',
    {
      body: JSON.stringify({ company_id: companyId, user_id: userId, role }),
      method: 'POST',
    },
    {
      200: async () => true,
    }
  );

export const removeUserFromCompany = (companyId: number, userId: number) =>
  fetchWithCallback<boolean>(
    '/company/removeUser/',
    '',
    {
      body: JSON.stringify({ company_id: companyId, user_id: userId }),
      method: 'POST',
    },
    {
      200: async () => true,
    }
  );

export const setRoleForUserInCompany = (
  companyId: number,
  userId: number,
  role: Role
) =>
  fetchWithCallback<boolean>(
    '/company/setRole/',
    '',
    {
      body: JSON.stringify({ company_id: companyId, user_id: userId, role }),
      method: 'POST',
    },
    {
      200: async () => true,
    }
  );
