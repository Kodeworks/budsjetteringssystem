import React from 'react';

import styled from 'styled-components';

import Routes from './components/atoms/Routes';
import Wrap from './helpers/GlobalWrapper';
import { navbarWidth } from './styling/sizes';

const App: React.FC<{ className?: string }> = props => (
  <Wrap className={props.className}>
    <Routes />
  </Wrap>
);

export default styled(App)`
  /* Grid */
  display: grid;
  grid-template-rows: 100%;
  grid-template-columns: ${navbarWidth} auto;
  height: 100vh;

  /* Colors */
  background: ${props => props.theme.main};

  nav {
    overflow-y: hidden;
  }

  & > section {
    overflow-y: auto;
  }
`;
