import { cleanup } from '@testing-library/react';
import * as api from '..';
import { ICompany } from '../../declarations/company';
import { IUser } from '../../declarations/user';

afterEach(cleanup);

describe('company', () => {
  let user2: IUser;
  let company: ICompany;

  beforeEach(async done => {
    await api.login('testing@liquidator.com', 'password');
    company = await api.getCompanyById(143);
    user2 = await api.getUserByEmail('testing2@liquidator.com');

    done();
  });

  test('create and delete a company', async done => {
    const resp = await api.createCompany({ name: 'Wow!', org_nr: '1234' });
    await api.deleteCompany(resp.id);

    done();
  });

  test('get company by ID', async () => {
    const resp = await api.getCompanyById(143);
    expect(resp.name).toBe('Testing company');
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
});
