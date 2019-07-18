import React from 'react';
import { useAuthState } from '../../store/contexts/auth';
import { useCompanyDispatch } from '../../store/contexts/company';
import { CompanyActions } from '../../store/reducers/company';

export const CompanyLoader: React.FC<{ children?: never }> = () => {
  const auth = useAuthState();
  const companyDispatch = useCompanyDispatch();

  React.useEffect(() => {
    auth.user!.companies.forEach(company => {
      CompanyActions.doAddCompany(company, companyDispatch);
    });
  }, [auth.user, companyDispatch]);

  return null;
};
