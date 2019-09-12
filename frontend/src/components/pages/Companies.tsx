import React from 'react';

import styled from 'styled-components';
import Input from '../atoms/Input';
import PageTitle from '../atoms/PageTitle';
import Company from '../molecules/Company';

import { useAuth } from '../../store/contexts/auth';
import { useCompany } from '../../store/contexts/company';
import { AuthActions } from '../../store/reducers/auth';
import { CompanyActions } from '../../store/reducers/company';

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
        .sort((c1, c2) => (c1.name > c2.name ? 1 : -1))
        .map(company => (
          <Company company={company} key={company.id} />
        ))}

      <hr />

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

        <input type="submit" value="Create" />
      </form>
    </div>
  );
};

export default styled(Companies)`
  hr {
    margin: 1em 0;
  }
`;
