import React from 'react';
import { useCompanyDispatch } from '../../store/contexts/company';
import { CompanyActions } from '../../store/reducers/company';
import Form from '../molecules/Form';

interface IUpdateCompanyFormProps {
  company: Omit<import('../../declarations/company').ICompany, 'users'>;
}

const UpdateCompanyForm: React.FC<IUpdateCompanyFormProps> = ({ company }) => {
  const companyDispatch = useCompanyDispatch();

  const onSubmit = async (values: any) => {
    await CompanyActions.doUpdateCompany(
      { ...values, company_id: company.id },
      companyDispatch
    );
  };

  return (
    <Form
      schema={[
        {
          id: 'update-company-name',
          label: 'Name',
          name: 'name',
          type: 'text',
          value: company.name,
        },
        {
          id: 'update-company-org_nr',
          label: 'Organization number',
          min: 0,
          name: 'org_nr',
          type: 'number',
          value: company.org_nr,
        },
      ]}
      onSubmit={onSubmit}
    >
      Update company
    </Form>
  );
};

export default UpdateCompanyForm;
