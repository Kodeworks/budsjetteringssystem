import React from 'react';

import styled from 'styled-components';

import Routes from './components/atoms/Routes';
import Wrap from './helpers/GlobalWrapper';
import { TransactionMocker } from './helpers/transaction_creator';
import { navbarWidth } from './styling/sizes';

interface IAppProps {
  className?: string;
}

const App: React.FC<IAppProps> = props => (
  <Wrap className={props.className}>
    <TransactionMocker quantity={100} />
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
