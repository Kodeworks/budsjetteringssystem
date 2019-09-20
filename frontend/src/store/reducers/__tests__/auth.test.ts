import { IUser } from '../../../declarations/user';
import { initialState } from '../../contexts/auth';
import { AuthActionCreators, authReducer, AuthState } from '../auth';

const user: IUser = {
  companies: [],
  email: 'comedian@liveattheapollo.com',
  first_name: 'John',
  id: 0,
  last_name: 'McMacintyre',
};

test('login', () => {
  const resp = authReducer(initialState, AuthActionCreators.login(user));
  expect(resp).toEqual(user);
});

test('register', () => {
  const resp = authReducer(initialState, AuthActionCreators.register(user));
  expect(resp).toEqual(user);
});

describe('alter user', () => {
  let loggedInState: AuthState;

  beforeEach(() => {
    loggedInState = authReducer(initialState, AuthActionCreators.login(user));
  });

  test('logout', () => {
    const resp = authReducer(loggedInState, AuthActionCreators.logout());

    expect(resp).toBeNull();
  });

  test('update user', () => {
    const updateParams: Omit<IUser, 'companies'> = {
      email: 'ding@dong.pingpong',
      first_name: 'COWA',
      id: user.id,
      last_name: 'BUNGA',
    };

    const resp = authReducer(
      loggedInState,
      AuthActionCreators.updateUser(updateParams)
    );

    expect(resp).toEqual({
      ...user,
      ...updateParams,
    });
  });

  test('remove company from user', () => {
    const testUser: IUser = {
      ...user,
      companies: [
        {
          company_id: 0,
          role: 'OW',
          user_id: user.id,
        },
        {
          company_id: 2,
          role: 'US',
          user_id: user.id,
        },
      ],
    };

    const resp = authReducer(
      authReducer(null, AuthActionCreators.login(testUser)),
      AuthActionCreators.removeCompanyFromUser(0)
    );

    expect(resp!.companies.length).toBe(1);
    expect(resp!.companies[0]).toEqual({
      company_id: 2,
      role: 'US',
      user_id: user.id,
    });
  });
});
