import { ICompany } from '../../../declarations/company';
import { initialState } from '../../contexts/company';
import {
  CompanyActionCreators,
  companyReducer,
  CompanyState,
} from '../company';

const comp: ICompany = {
  id: 0,
  name: 'WHAT DID YOU JUST SAY?',
  org_nr: '424242',
  users: [
    {
      company_id: 0,
      role: 'OW',
      user_id: 0,
    },
  ],
};

test('add company', () => {
  expect(initialState.length).toBe(0);
  const updatedState = companyReducer(
    initialState,
    CompanyActionCreators.addCompany(comp)
  );
  expect(updatedState.length).toBe(1);
  expect(updatedState[0]).toEqual(comp);
});

describe('alter company', () => {
  let state: CompanyState;

  beforeEach(() => {
    state = companyReducer(
      initialState,
      CompanyActionCreators.addCompany(comp)
    );
  });

  test('update company', () => {
    const newState = companyReducer(
      state,
      CompanyActionCreators.updateCompany({
        company_id: comp.id,
        name: 'Supercompany #5',
        org_nr: comp.org_nr,
      })
    );

    expect(newState[0].name).toBe('Supercompany #5');
  });

  test('delete company', () => {
    const newState = companyReducer(
      state,
      CompanyActionCreators.deleteCompany(comp.id)
    );

    expect(newState.length).toBe(0);
  });

  test('add user to company', () => {
    const newState = companyReducer(
      state,
      CompanyActionCreators.addUserToCompany({
        company_id: comp.id,
        role: 'RE',
        user_id: 1,
      })
    );

    expect(newState[0].users.length).toBe(2);
    expect(newState[0].users.find(e => e.user_id === 1)).toBeTruthy();
  });

  describe('alter users', () => {
    beforeEach(() => {
      state = companyReducer(
        state,
        CompanyActionCreators.addUserToCompany({
          company_id: comp.id,
          role: 'RE',
          user_id: 1,
        })
      );
    });

    test('remove user from company', () => {
      const newState = companyReducer(
        state,
        CompanyActionCreators.removeUserFromCompany(comp.id, 1)
      );
      expect(newState[0].users.length).toBe(1);
      expect(newState[0].users.find(e => e.user_id === 1)).toBeUndefined();
    });

    test('set role for user in company', () => {
      const newState = companyReducer(
        state,
        CompanyActionCreators.setRoleForUserInCompany({
          company_id: comp.id,
          role: 'OW',
          user_id: 1,
        })
      );

      expect(newState[0].users.find(e => e.user_id === 1)!.role).toBe('OW');
    });
  });
});
