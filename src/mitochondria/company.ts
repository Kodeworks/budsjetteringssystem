import { fetchWithCallback } from '.';

type ICompany = import('../declarations/company').ICompany;
type ICompanyUser = import('../declarations/company').ICompanyUser;

export const createCompany = (company: Omit<ICompany, 'id' | 'users'>) =>
  fetchWithCallback<ICompany>('/company/', '', {
    body: JSON.stringify(company),
    method: 'POST',
  });

export const getCompanyById = (companyId: number) =>
  fetchWithCallback<ICompany>('/company/', `?company_id=${companyId}`);

interface IUpdateCompany extends Pick<ICompany, 'org_nr' | 'name'> {
  company_id: number;
}

export const updateCompany = (company: IUpdateCompany) =>
  fetchWithCallback<true>(
    '/company/',
    '',
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
    `?company_id=${companyId}`,
    {
      method: 'DELETE',
    },
    {
      200: async () => true,
    }
  );

export const addUserToCompany = (companyUser: ICompanyUser) =>
  fetchWithCallback<true>(
    '/company/addUser/',
    '',
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

export const setRoleForUserInCompany = (companyUser: ICompanyUser) =>
  fetchWithCallback<true>(
    '/company/setRole/',
    '',
    {
      body: JSON.stringify(companyUser),
      method: 'POST',
    },
    {
      200: async () => true,
    }
  );
