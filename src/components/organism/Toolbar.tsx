import React from 'react';
import styled from 'styled-components';

import { AuthCtx } from '../../contexts/auth';

const ToolbarContainer = styled.div`
  /* Pos */
  display: flex;
  justify-content: flex-end;
  padding: 1em;
  position: sticky;
  top: 0;

  /* Coloring */
  background: ${props => props.theme.accent1};

  box-shadow: 0px 3px 4px 0 #ccc;
`;

const Toolbar: React.FC = () => {
  const { user } = React.useContext(AuthCtx);

  return (
    <ToolbarContainer>
      <p>Welcome, {`${user!.first_name} ${user!.last_name}`} | <strong>Sign out</strong></p>
    </ToolbarContainer>
  );
  };

export default Toolbar;
