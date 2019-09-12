import React from 'react';

import styled from 'styled-components';

import { useAuthState } from '../../store/contexts/auth';
import { useCompanyDispatch } from '../../store/contexts/company';
import { CompanyActions } from '../../store/reducers/company';
import CompanyUser from '../atoms/CompanyUser';
import Input from '../atoms/Input';

interface ICompanyProps {
  company: import('../../declarations/company').ICompany;
  className?: string;
}

const Company: React.FC<ICompanyProps> = ({ className, company }) => {
  const [newUserEmail, setNewUserEmail] = React.useState('');
  const dispatch = useCompanyDispatch();
  const auth = useAuthState();

  const onSubmitAddNewUser: React.FormEventHandler = async e => {
    e.preventDefault();

    try {
      await CompanyActions.doAddUserToCompany(
        {
          company_id: company.id,
          email: newUserEmail,
          role: 'US',
        },
        dispatch
      );

      setNewUserEmail('');
    } catch (e) {
      alert('Could not add new user!');
    }
  };

  const onClickDelete: React.MouseEventHandler = async () => {
    await CompanyActions.doDeleteCompany(company.id, dispatch);
  };

  return (
    <div className={className}>
      <h2>{company.name}</h2>
      <h5>Organizational number: {company.org_nr}</h5>
      <h3>Members</h3>
      <ul>
        {company.users.map(u => (
          <CompanyUser user={u} key={u.user_id} />
        ))}
      </ul>
      {company.users.find(u => u.user_id === auth!.id)!.role === 'OW' && (
        <>
          <form onSubmit={onSubmitAddNewUser}>
            <Input
              placeholder="bob@ross.biz"
              value={newUserEmail}
              setState={setNewUserEmail}
              type="text"
              id="newUserEmail"
            >
              Email of user to add
            </Input>
            <input type="submit" value="Add user to company" />
          </form>
          <button onClick={onClickDelete}>Delete company?</button>
        </>
      )}
    </div>
  );
};

export default styled(Company)`
  form {
    margin-bottom: 1em;
  }

  h5 {
    margin-bottom: 1em;
  }

  ul {
    list-style-type: none;
    margin-bottom: 0.5em;

    li {
      font-size: 0.7em;
    }
  }

  &:not(:last-of-type) {
    margin-bottom: 1em;
  }
`;
