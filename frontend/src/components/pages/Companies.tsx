import React from 'react';

import styled from 'styled-components';
import Input from '../atoms/Input';
import PageTitle from '../atoms/PageTitle';
import Company from '../molecules/Company';

import { useAuth } from '../../store/contexts/auth';
import { useCompany } from '../../store/contexts/company';
import { AuthActions } from '../../store/reducers/auth';
import { CompanyActions } from '../../store/reducers/company';
import Button from '../atoms/Button';

const Companies: React.FC<{ className?: string }> = props => {
  const [companies, dispatch] = useCompany();
  const [auth, authDispatch] = useAuth();

  const [name, setName] = React.useState('');
  const [orgNr, setOrgNr] = React.useState('');

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await CompanyActions.doCreateCompany({ name, org_nr: orgNr }, dispatch);
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

      <h2>Create a new company</h2>

      <form onSubmit={onSubmit}>
        <Input
          placeholder="Goggle Inc."
          value={name}
          setState={setName}
          id="name"
          type="text"
        >
          Name
        </Input>
        <Input
          placeholder="01189998819991197253"
          value={orgNr}
          setState={setOrgNr}
          id="orgnr"
          type="text"
        >
          Organization number
        </Input>

        <Button type="submit">Create</Button>
      </form>
    </div>
  );
};

export default styled(Companies)`
  hr {
    margin: 1em 0;
  }

  & > h2 ~ form > * {
    margin-top: 1em;
  }
`;
