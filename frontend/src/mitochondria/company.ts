import { fetchWithCallback } from '.';

type ICompany = import('../declarations/company').ICompany;
type ICompanyUser = import('../declarations/company').ICompanyUser;

export const createCompany = (company: Omit<ICompany, 'id' | 'users'>) =>
  fetchWithCallback<ICompany>(
    '/company/',
    {},
    {
      body: JSON.stringify(company),
      method: 'POST',
    }
  );

export const getCompanyById = (companyId: number) =>
  fetchWithCallback<ICompany>('/company/', { company_id: companyId });

export interface IUpdateCompany extends Pick<ICompany, 'org_nr' | 'name'> {
  company_id: number;
}

export const updateCompany = (company: IUpdateCompany) =>
  fetchWithCallback<true>(
    '/company/',
    {},
    {
      body: JSON.stringify(company),
      method: 'PUT',
    },
    {
      200: async () => true,
    }
  );

export const deleteCompany = (companyId: number) =>
  fetchWithCallback<true>(
    '/company/',
    { company_id: companyId },
    {
      method: 'DELETE',
    },
    {
      200: async () => true,
    }
  );

interface IAddCompanyUser extends Omit<ICompanyUser, 'user_id'> {
  email: string;
}

export const addUserToCompany = (companyUser: IAddCompanyUser) =>
  fetchWithCallback<true>(
    '/company/user/',
    {},
    {
      body: JSON.stringify(companyUser),
      method: 'POST',
    },
    {
      200: async () => true,
    }
  );

export const removeUserFromCompany = (companyId: number, userId: number) =>
  fetchWithCallback<true>(
    '/company/user/',
    { company_id: companyId, user_id: userId },
    {
      method: 'DELETE',
    },
    {
      200: async () => true,
    }
  );

export const setRoleForUserInCompany = (companyUser: ICompanyUser) =>
  fetchWithCallback<true>(
    '/company/user/',
    {},
    {
      body: JSON.stringify(companyUser),
      method: 'PUT',
    },
    {
      200: async () => true,
    }
  );
