import React from 'react';
import { useCompanyDispatch } from '../../store/contexts/company';
import { CompanyActions } from '../../store/reducers/company';
import Input from '../atoms/Input';

const CreateCompany: React.FC = () => {
  const [name, setName] = React.useState('');
  const [orgNr, setOrgNr] = React.useState('');

  const dispatch = useCompanyDispatch();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await CompanyActions.doCreateCompany({ name, org_nr: orgNr }, dispatch);

    window.location.pathname = '/';
  };

  return (
    <>
      <h1>Create a company</h1>

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
    </>
  );
};

export default CreateCompany;
