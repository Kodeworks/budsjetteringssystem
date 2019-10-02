import React from 'react';
import { useCompanyDispatch } from '../../store/contexts/company';
import { CompanyActions } from '../../store/reducers/company';
import PageTitle from '../atoms/PageTitle';
import Form from '../molecules/Form';

const CreateCompany: React.FC = () => {
  const dispatch = useCompanyDispatch();

  const onSubmit = async ({ name, org_nr }: any) => {
    await CompanyActions.doCreateCompany({ name, org_nr }, dispatch);

    window.location.pathname = '/';
  };

  return (
    <>
      <PageTitle
        title="Create new company"
        description="Don't have a company? Don't despair. This page will help you out."
      />

      <Form
        schema={[
          {
            id: 'create-company-name',
            label: 'Name',
            name: 'name',
            placeholder: 'Google Inc.',
            type: 'text',
          },
          {
            id: 'create-company-org_nr',
            label: 'Organization number',
            name: 'org_nr',
            placeholder: '01189998819991197253',
            type: 'number',
          },
        ]}
        onSubmit={onSubmit}
      />
    </>
  );
};

export default CreateCompany;
