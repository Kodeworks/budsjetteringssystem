import React from 'react';

import styled from 'styled-components';
import PageTitle from '../atoms/PageTitle';
import Company from '../molecules/Company';

import { useAuth } from '../../store/contexts/auth';
import { useCompany } from '../../store/contexts/company';
import { AuthActions } from '../../store/reducers/auth';
import { CompanyActions } from '../../store/reducers/company';
import Collapsable from '../atoms/Collapsable';
import Form from '../molecules/Form';

const Companies: React.FC<{ className?: string }> = props => {
  const [companies, dispatch] = useCompany();
  const [auth, authDispatch] = useAuth();

  const onSubmit = async ({ name, org_nr }: any) => {
    await CompanyActions.doCreateCompany({ name, org_nr }, dispatch);
    await AuthActions.doSetUser(auth!.id, authDispatch);
  };

  return (
    <div className={props.className}>
      <PageTitle
        title="Companies"
        description="Create and edit your companies"
      />
      {companies
        .sort((c1, c2) => (c1.id > c2.id ? 1 : -1))
        .map(company => (
          <Company company={company} key={company.id} />
        ))}

      <hr />

      <Collapsable heading={<h2>Create a new company</h2>}>
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
              min: 0
            },
          ]}
          onSubmit={onSubmit}
          stateReset={true}
        >
          Create company
        </Form>
      </Collapsable>
    </div>
  );
};

export default styled(Companies)`
  hr {
    margin: 1em 0;
  }

  form:last-of-type {
    margin-top: 1em;
    display: grid;
    grid-gap: 1em;

    grid-template-columns: 1fr 1fr;

    button[type='submit'] {
      grid-column: 1 / span 2;
    }
  }
`;
