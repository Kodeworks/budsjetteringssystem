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

  try {
    user = await api.register({
      first_name: 'Testing',
      last_name: 'Testingsson',
      ...loginDetails,
    });

    company = await api.createCompany({
      name: 'Testing company',
      org_nr: '4242424242',
    });
  } catch (_) {
    user = await api.login(loginDetails.email, loginDetails.password);

    try {
      company = await api.getCompanyById(user.companies[0]!.company_id);
    } catch (_) {
      company = await api.createCompany({
        name: 'Testing company',
        org_nr: '4242424242',
      });
    }
  }

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

export const createTx = async (companyId: number) => {
  const transaction = await api.createTransaction({
    company_id: companyId,
    date: '2018-08-23',
    description: 'Test transaction #1',
    money: 424242,
    notes: 'Nothing really.',
    type: 'EX',
  });

  return [
    transaction,
    async () =>
      await api.deleteTransaction(transaction.company_id, transaction.id),
  ] as [
    import('../declarations/transaction').ITransaction,
    () => Promise<true>
  ];
};
