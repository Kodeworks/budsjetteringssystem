import React from 'react';
import { useAuthState } from '../../store/contexts/auth';
import { useCompanyDispatch } from '../../store/contexts/company';
import { Perform } from '../../store/reducers/company';

export const CompanyLoader: React.FC<{ children?: never }> = () => {
  const auth = useAuthState();
  const companyDispatch = useCompanyDispatch();

  React.useEffect(() => {
    auth.user!.companies.forEach(company => {
      Perform.doAddCompany(company, companyDispatch);
    });
  }, [auth.user, companyDispatch]);

  return null;
};
