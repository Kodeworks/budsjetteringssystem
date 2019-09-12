import React from 'react';

import styled from 'styled-components';

import { useCompanyDispatch } from '../../store/contexts/company';
import { CompanyActions } from '../../store/reducers/company';
import Input from '../atoms/Input';

interface ICompanyProps {
  company: import('../../declarations/company').ICompany;
  className?: string;
}

const Company: React.FC<ICompanyProps> = ({ className, company }) => {
  const [newUserEmail, setNewUserEmail] = React.useState('');
  const dispatch = useCompanyDispatch();

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
      <form onSubmit={onSubmitAddNewUser}>
        <Input
          placeholder="fredrik@kodeklubben.biz"
          value={newUserEmail}
          setState={setNewUserEmail}
          type="text"
          id="newUserEmail"
        >
          Email of user to add
        </Input>
        <input type="submit" value="Add user to company" />
      </form>
      <h4>Members</h4>
      <ul>
        {company.users.map(u => (
          <li key={u.user_id}>
            {u.user_id} - {u.role}
          </li>
        ))}
      </ul>
      <button onClick={onClickDelete}>Delete company?</button>
    </div>
  );
};

export default styled(Company)`
  h2 {
    font-weight: normal;
  }

  h4 {
    margin-top: 0.7em;
    font-weight: normal;
  }

  h5 {
    margin-bottom: 1em;
  }

  ul {
    list-style-type: none;

    li {
      font-size: 0.7em;
    }
  }

  &:not(:last-of-type) {
    margin-bottom: 1em;
  }
`;
