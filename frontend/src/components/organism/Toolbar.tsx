import React from 'react';
import styled from 'styled-components';

import { AuthDispatch, useAuth } from '../../store/contexts/auth';
import { AuthActions } from '../../store/reducers/auth';

import moment from 'moment';

const ToolbarContainer = styled.div`
  /* Pos */
  display: flex;
  justify-content: flex-end;
  padding: 1em 4em;
  position: sticky;
  top: 0;
  /**
   * Don't mind me, just triggering CI.
   * This makes sure the toolbar is rendered above everything.
   */
  z-index: 999;

  /* Coloring */
  background: ${props => props.theme.palette.background.default};
  box-shadow: 0px 3px 4px 0 #ccc;

  * {
    align-self: center;
    vertical-align: middle;

    &:not(:last-child) {
      margin-right: 0.5em;
    }
  }

  & > p:first-child {
    margin-right: auto;
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
  const [user, dispatch] = useAuth() as [
    NonNullable<import('../../declarations/user').IUser>,
    AuthDispatch
  ];

  const onLogout = () => AuthActions.doLogout(dispatch);

  return (
    <ToolbarContainer>
      <p>{moment().format('dddd Do of MMMM YYYY')}</p>
      <p>Welcome, {`${user.first_name} ${user.last_name}`}</p>
      <LogoutButton onClick={onLogout}>Sign out</LogoutButton>
    </ToolbarContainer>
  );
};

export default Toolbar;
