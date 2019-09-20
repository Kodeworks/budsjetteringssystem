import React from 'react';

import styled from 'styled-components';

import { useAuthState } from '../../store/contexts/auth';
import { useCompanyDispatch } from '../../store/contexts/company';
import { CompanyActions } from '../../store/reducers/company';
import Button from '../atoms/Button';
import Collapsable from '../atoms/Collapsable';
import CompanyUser from '../atoms/CompanyUser';
import Input from '../atoms/Input';
import UpdateCompanyForm from '../atoms/UpdateCompanyForm';

interface ICompanyProps {
  company: import('../../declarations/company').ICompany;
  className?: string;
}

const Company: React.FC<ICompanyProps> = ({ className, company }) => {
  const [newUserEmail, setNewUserEmail] = React.useState('');
  const [showUpdateForm, setShowUpdateForm] = React.useState<boolean>(false);
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

  const isOwner =
    company.users.find(u => u.user_id === auth!.id)!.role === 'OW';

  const onClickDelete: React.MouseEventHandler = async () => {
    await CompanyActions.doDeleteCompany(company.id, dispatch);
  };

  const toggleShowUpdateForm: React.MouseEventHandler<HTMLButtonElement> = () =>
    setShowUpdateForm(_ => !_);

  return (
    <div className={className}>
      <hr />
      <h2>{company.name}</h2>
      <h5>Organizational number: {company.org_nr}</h5>
      <Button onClick={toggleShowUpdateForm}>
        {showUpdateForm ? 'Hide' : 'Show'} update company form
      </Button>
      <Button onClick={onClickDelete}>Delete company?</Button>
      {showUpdateForm && <UpdateCompanyForm company={company} />}
      <h3>Members</h3>
      <ul>
        {company.users.map(u => (
          <CompanyUser user={u} key={u.user_id} isOwner={isOwner} />
        ))}
      </ul>
      {isOwner && (
        <Collapsable heading={<h3>Add a new user</h3>}>
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
            <Button type="submit">Add user to company</Button>
          </form>
        </Collapsable>
      )}
    </div>
  );
};

export default styled(Company)`
  form {
    margin-bottom: 1em;

    div ~ button {
      margin-top: 0.6em;
    }
  }

  h5 {
    margin-bottom: 1em;

    & ~ button {
      margin: 0.6em 0 1em;
    }

    & ~ button,
    & ~ button ~ button {
      display: inline-block;

      &:not(:last-of-type) {
        margin-right: 0.7em;
      }
    }
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
