import { ICompanyUser } from './company';

export interface IUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  companies: Array<ICompanyUser>;
}
