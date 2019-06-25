import { IUser } from '../declarations/user';

export interface IAuthState {
  access: string;
  refresh: string;
  user?: IUser;
}
