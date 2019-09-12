import React from 'react';
import styled from 'styled-components';

import * as API from '../../mitochondria';
import { useAuthState } from '../../store/contexts/auth';
import { useCompanyDispatch } from '../../store/contexts/company';
import { CompanyActions } from '../../store/reducers/company';
import Select from './Select';

type Role = import('../../declarations/company').Role;

interface ICompanyUserProps {
  user: import('../../declarations/company').ICompanyUser;
  className?: string;
}

const CompanyUser: React.FC<ICompanyUserProps> = ({ className, user }) => {
  const [name, setName] = React.useState(
    `Loading name of user ${user.user_id}...`
  );

  const [role, setRole] = React.useState<Role>(user.role);

  const auth = useAuthState();
  const companyDispatch = useCompanyDispatch();

  const onRoleChange: React.FormEventHandler<HTMLSelectElement> = async e => {
    await CompanyActions.doSetRoleForUserInCompany(
      {
        ...user,
        role: e.currentTarget.value as Role,
      },
      companyDispatch
    );
  };

  React.useEffect(() => {
    (async () => {
      const { first_name, last_name } = await API.getUserById(user.user_id);
      setName(`${first_name} ${last_name}`);
    })();
  }, [user.user_id]);

  return (
    <div className={className}>
      <li>
        <h2>{name}</h2>
        {auth!.id !== user.user_id && (
          <Select
            values={[
              { name: 'Owner', value: 'OW' },
              { name: 'Reporter', value: 'RE' },
              { name: 'User', value: 'US' },
            ]}
            value={role}
            setState={setRole}
            onChange={onRoleChange}
          />
        )}
      </li>
    </div>
  );
};

export default styled(CompanyUser)`
  h2 {
    font-weight: normal;
  }

  margin-bottom: 0.7em;
`;
