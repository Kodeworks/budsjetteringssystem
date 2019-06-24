import React from 'react';

import styled, { ThemeProvider } from 'styled-components';

import { Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { theme } from './styling/theme';

import { createTransactionCtx, TransactionCtx } from './contexts/transaction';
import { createDummyTransaction } from './helpers/transaction_creator';
import { ActionCreators, initialState, reducer } from './reducers/transactions';

import Navigation from './components/organism/Navigation';
import Transactions from './components/organism/Transactions';
import FAQ from './components/pages/FAQ';
import Homepage from './components/pages/Homepage';
import Page from './components/templates/Page';
import GlobalWrapper from './helpers/GlobalWrapper';
import { GlobalStyle } from './styling/global';
import { navbarWidth } from './styling/sizes';

interface IProps {
  className?: string;
}

const App: React.FC<IProps> = ({ className }) => {
  return (
    <GlobalWrapper className={className}>
      <Navigation />
      <Page>
        <Route path="/" exact={true} component={Homepage} />
        <Route path="/faq" component={FAQ} />
        <Route path="/transactions" component={Transactions} />
      </Page>

    </GlobalWrapper>
  );
};

export default styled(App)`
  /* Grid */
  display: grid;
  grid-template-rows: 100%;
  grid-template-columns: ${navbarWidth} auto;
  max-height: 100vh;
  background: ${theme.palette.primary.main};

    nav {
    overflow-y: hidden;
  }

  &>section {
    overflow-y: auto;
  }

  /* Colors */
  background-color: ${theme.palette.background.default};
`;
