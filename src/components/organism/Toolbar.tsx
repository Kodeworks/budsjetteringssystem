import React from 'react';
import styled from 'styled-components';

import { AuthCtx } from '../../contexts/auth';

import { logout } from '../../mitochondria/auth';

const ToolbarContainer = styled.div`
  /* Pos */
  display: flex;
  justify-content: flex-end;
  padding: 1em;
  position: sticky;
  top: 0;

  /* Coloring */
  background: ${props => props.theme.main};

  box-shadow: 0px 3px 4px 0 #ccc;

  * {
    align-self: center;
    vertical-align: middle;

    &:not(:last-child) {
      margin-right: .5em;
    }
  }
`;

const LogoutButton = styled.button`
  -webkit-appearance: none;
  background: none;
  border: 0;
  cursor: pointer;
  font-size: 1em;
  font-weight: 300;
  text-decoration: underline;
`;

const Toolbar: React.FC = () => {
  const { user } = React.useContext(AuthCtx);

  return (
    <ToolbarContainer>
      <p>Welcome, {`${user!.first_name} ${user!.last_name}`}</p>
      <LogoutButton onClick={logout}>Sign out</LogoutButton>
    </ToolbarContainer>
  );
  };

export default Toolbar;
