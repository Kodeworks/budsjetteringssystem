import React from 'react';
import styled from 'styled-components';

const ToolbarContainer = styled.div`
  /* Pos */
  display: flex;
  justify-content: flex-end;
  padding: 1em;
  position: sticky;
  top: 0;

  /* Coloring */
  background: ${props => props.theme.palette.primary.main};

  box-shadow: 0px 3px 4px 0 #ccc;
`;

const Toolbar: React.FC = () => (
  <ToolbarContainer>
    <p>Welcome, Fredrik August Madsen-Malmo | <strong>Sign out</strong></p>
  </ToolbarContainer>
);

export default Toolbar;
