import { render, RenderOptions } from '@testing-library/react';
import { ICompany } from '../declarations/company';
import { IUser } from '../declarations/user';
import * as api from '../mitochondria';
import GlobalWrapper from './GlobalWrapper';

const customRender = (
  ui: React.ReactElement<any>,
  options?: Omit<RenderOptions, 'queries'>
) => render(ui, { wrapper: GlobalWrapper, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };

// Setup functions for tests in mitochondria

export const loginDetails = {
  email: 'testing@liquidator.com',
  password: 'password',
};

export const setupTests = async () => {
  let user: IUser;
  let company: ICompany;

  user = await api.register({
    first_name: 'Testing',
    last_name: 'Testingsson',
    ...loginDetails,
  });

  company = await api.createCompany({
    name: 'Testing company',
    org_nr: '4242424242',
  });

  user = {
    ...user,
    companies: [
      {
        company_id: company.id,
        role: 'OW',
        user_id: user.id,
      },
    ],
  };

  return [user, company] as [IUser, ICompany];
};

export const teardown = async () => {
  const user = await api.login(loginDetails.email, loginDetails.password);

  for (const company of user.companies) {
    await api.deleteCompany(company.company_id);
  }

  await api.deleteUser();
};
