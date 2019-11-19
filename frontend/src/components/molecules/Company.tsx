import React from 'react';

import styled from 'styled-components';

import { useAuth } from '../../store/contexts/auth';
import { useCompanyDispatch } from '../../store/contexts/company';
import { AuthActions } from '../../store/reducers/auth';
import { CompanyActions } from '../../store/reducers/company';
import Button from '../atoms/Button';
import Collapsable from '../atoms/Collapsable';
import CompanyUser from '../atoms/CompanyUser';
import UpdateCompanyForm from '../atoms/UpdateCompanyForm';
import Form from './Form';

import { guardAction } from '../../helpers/guardAction';

interface ICompanyProps {
  company: import('../../declarations/company').ICompany;
  className?: string;
}

const Company: React.FC<ICompanyProps> = ({ className, company }) => {
  const [showUpdateForm, setShowUpdateForm] = React.useState<boolean>(false);
  const dispatch = useCompanyDispatch();
  const [auth, authDispatch] = useAuth();

  const onSubmitAddNewUser = async (values: any) => {
    await CompanyActions.doAddUserToCompany(
      {
        company_id: company.id,
        email: values.email,
        role: 'US',
      },
      dispatch
    );
  };

  let isOwner: boolean;
  try {
    isOwner = company.users.find(u => u.user_id === auth!.id)!.role === 'OW';
  } catch (e) {
    isOwner = false;
  }

  const onClickDelete: React.MouseEventHandler = () => {
    guardAction(
      `Are you sure you want to delete the company ${company.name}?`,
      async () => {
        AuthActions.doRemoveCompanyFromUser(company.id, authDispatch);
        await CompanyActions.doDeleteCompany(company.id, dispatch);
      }
    );
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
          <CompanyUser
            companyName={company.name}
            user={u}
            key={u.user_id}
            isOwner={isOwner}
          />
        ))}
      </ul>
      {isOwner && (
        <Collapsable heading={<h3>Add a new user</h3>}>
          <Form
            schema={[
              {
                id: 'add-user-to-company-email',
                label: 'Email of new user',
                name: 'email',
                placeholder: 'bob@ross.com',
                type: 'email',
              },
            ]}
            onSubmit={onSubmitAddNewUser}
          >
            Add new user
          </Form>
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
