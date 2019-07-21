import { fetchWithCallback } from '.';
import { ICompany, Role } from '../declarations/company';

export const createCompany = (id: number, name: string, orgNr: string) =>
  fetchWithCallback<ICompany>('/company/', '', {
    body: JSON.stringify({ id, name, org_nr: orgNr }),
    method: 'POST',
  });

export const getCompanyById = (companyId: number) =>
  fetchWithCallback<ICompany>('/company/', `?company_id=${companyId}`);

export const updateCompany = (id: number, name: string, orgNr: string) =>
  fetchWithCallback<true>(
    '/company/',
    '',
    {
      body: JSON.stringify({ id, name, org_nr: orgNr }),
      method: 'PUT',
    },
    {
      200: async () => true,
    }
  );

export const deleteCompany = (companyId: number) =>
  fetchWithCallback<true>(
    '/company/',
    `?company_id=${companyId}`,
    {
      method: 'DELETE',
    },
    {
      200: async () => true,
    }
  );

export const addUserToCompany = (
  companyId: number,
  userId: number,
  role?: Role
) =>
  fetchWithCallback<true>(
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
  fetchWithCallback<true>(
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
  fetchWithCallback<true>(
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
