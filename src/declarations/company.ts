export interface ICompany {
  id: number;
  name: string;
  org_nr: string;
}

export type Role = 'Reporter' | 'User' | 'Owner';

export interface IUserCompany extends ICompany {
  role: Role;
}
