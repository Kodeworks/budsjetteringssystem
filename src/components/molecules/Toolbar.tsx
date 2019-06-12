import React from 'react';
import styled from 'styled-components';

const ToolbarContainer = styled.div`
  /* Pos */
  display: flex;
  justify-content: flex-end;
  padding: 1em;
`;

const Toolbar: React.FC = () => (
  <ToolbarContainer>
    <p>TODO</p>
  </ToolbarContainer>
);

export default Toolbar;
