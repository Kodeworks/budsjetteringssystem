import React from 'react';
import { useAuth } from '../../store/contexts/auth';
import { useCompany } from '../../store/contexts/company';
import { AuthActions } from '../../store/reducers/auth';
import { CompanyActions } from '../../store/reducers/company';
import Input from '../atoms/Input';

const Companies: React.FC = props => {
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
    <>
      <h1>All my cool companies :)</h1>
      {companies.map(company => (
        <div key={company.id}>
          <h1>{company.name}</h1>
          <ul>
            {company.users.map(u => (
              <li key={u.user_id}>
                {u.user_id} - {u.role}
              </li>
            ))}
          </ul>
        </div>
      ))}

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

export default Companies;
