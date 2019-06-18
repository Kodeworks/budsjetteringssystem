import React from 'react';
import styled from 'styled-components';

import { theme } from '../../styling/theme';

const ToolbarContainer = styled.div`
  /* Pos */
  display: flex;
  justify-content: flex-end;
  padding: 1em;

  /* Coloring */
  background: ${theme.accent1};
`;

const Toolbar: React.FC = () => (
  <ToolbarContainer>
    <p>Welcome, Fredrik August Madsen-Malmo | <strong>Sign out</strong></p>
  </ToolbarContainer>
);

export default Toolbar;
