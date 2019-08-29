export type Role = 'RE' | 'US' | 'OW';

export interface ICompanyUser {
  user_id: number;
  company_id: number;
  role: Role;
}

export interface ICompany {
  id: number;
  name: string;
  org_nr: string;
  users: Array<ICompanyUser>;
}
