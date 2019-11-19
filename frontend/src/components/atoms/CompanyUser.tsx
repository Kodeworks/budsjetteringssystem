import React from 'react';
import styled from 'styled-components';

import * as API from '../../mitochondria';
import { useAuthState } from '../../store/contexts/auth';
import { useCompanyDispatch } from '../../store/contexts/company';
import { CompanyActions } from '../../store/reducers/company';

import Button from './Button';
import Select from './Select';
import { guardAction } from '../../helpers/guardAction';

type Role = import('../../declarations/company').Role;

interface ICompanyUserProps {
  user: import('../../declarations/company').ICompanyUser;
  className?: string;
  isOwner: boolean;
  companyName: string;
}

const CompanyUser: React.FC<ICompanyUserProps> = ({
  className,
  user,
  isOwner,
  companyName,
}) => {
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

  const onClickRemoveUserFromCompany: React.MouseEventHandler<
    HTMLButtonElement
  > = () => {
    guardAction(
      isOwner
        ? `Are you sure you want to leave ${companyName}?`
        : `Are you sure you want to remove ${name} from ${companyName}?`,
      async () => {
        await CompanyActions.doRemoveUserFromCompany(
          user.company_id,
          user.user_id,
          companyDispatch
        );
      }
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
      <h3>{name}</h3>
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
      {(isOwner || auth!.id === user.user_id) && (
        <Button onClick={onClickRemoveUserFromCompany}>
          {auth!.id === user.user_id
            ? 'Leave company'
            : 'Remove user from company?'}
        </Button>
      )}
    </div>
  );
};

export default styled(CompanyUser)`
  h3 {
    font-weight: normal;
  }

  margin-bottom: 0.7em;
  display: flex;
  justify-content: space-between;
`;
