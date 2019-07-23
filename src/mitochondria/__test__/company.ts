import { cleanup } from '@testing-library/react';
import * as api from '..';
import { ICompany } from '../../declarations/company';
import { IUser } from '../../declarations/user';
import { loginDetails, setupTests } from '../../helpers/test-utils';

afterEach(cleanup);

let user: IUser;
let user2: IUser;
let company: ICompany;

beforeAll(async () => {
  const [u, c] = await setupTests();
  user = u;
  company = c;

  user2 = await api.register({
    email: 'user2@liquidator.com',
    first_name: 'User',
    last_name: 'User',
    password: 'password',
  });
});

beforeEach(async () => {
  await api.login(loginDetails.email, loginDetails.password);
});

afterAll(async () => {
  await api.login('user2@liquidator.com', 'password');
  await api.deleteUser();
});

test('create and delete a company', async () => {
  const resp = await api.createCompany({ name: 'Wow!', org_nr: '1234' });
  await api.deleteCompany(resp.id);

  expect(api.getCompanyById(resp.id)).rejects.toThrow();
});

test('get company by ID', async () => {
  const resp = await api.getCompanyById(company.id);
  expect(resp.users.find(e => e.user_id === user.id)).not.toBe(-1);
});

test('add and remove user from company', async () => {
  await api.addUserToCompany({
    company_id: company.id,
    role: 'US',
    user_id: user2.id,
  });

  expect((await api.getCompanyById(company.id)).users).toHaveLength(2);

  await api.removeUserFromCompany(company.id, user2.id);
});

test('update company', async () => {
  const { users, id, ...rest } = company;
  await api.updateCompany({ ...rest, company_id: id, name: 'New name' });
  expect((await api.getCompanyById(company.id)).name).toBe('New name');
  await api.updateCompany({
    ...rest,
    company_id: id,
    name: 'Testing company',
  });
});

test('set role for user in company', async () => {
  await api.addUserToCompany({
    company_id: company.id,
    role: 'US',
    user_id: user2.id,
  });

  expect(
    (await api.getCompanyById(company.id)).users.find(
      e => e.user_id === user2.id
    )!.role
  ).toBe('US');

  await api.setRoleForUserInCompany({
    company_id: company.id,
    role: 'RE',
    user_id: user2.id,
  });

  expect(
    (await api.getCompanyById(company.id)).users.find(
      e => e.user_id === user2.id
    )!.role
  ).toBe('RE');

  await api.removeUserFromCompany(company.id, user2.id);
});
