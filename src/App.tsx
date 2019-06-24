import React from 'react';

import styled, { ThemeProvider } from 'styled-components';

import { Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { theme } from './styling/theme';

import { AuthCtx } from './contexts/auth';
import { createTransactionCtx, TransactionCtx } from './contexts/transaction';
import { createDummyTransaction } from './helpers/transaction_creator';
import { ActionCreators, initialState, reducer } from './reducers/transactions';

import Login from './components/organism/Login';
import Navigation from './components/organism/Navigation';
import Transactions from './components/organism/Transactions';
import FAQ from './components/pages/FAQ';
import Homepage from './components/pages/Homepage';
import Page from './components/templates/Page';
import { GlobalStyle } from './styling/global';
import { navbarWidth } from './styling/sizes';

interface IProps {
  className?: string;
}

const Wrapper = styled.div`
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

  &>section {
    overflow-y: auto;
  }
`;

const App: React.FC<IProps> = ({ className }) => {
  const [store, dispatch] = React.useReducer(reducer, initialState);
  const { access } = React.useContext(AuthCtx);

  /**
   * If we haven't initialized the context, we want to create it here.
   */
  if (!TransactionCtx) {
    createTransactionCtx(store, dispatch);

    for (let i = 0; i < 100; i++) {
      dispatch(ActionCreators.addTransaction(createDummyTransaction()));
    }
  }

  // Extracted the wrapping to make the business logic easier, and to avoid multiline jsx
  const Burrito: React.FC = stuffing => (
    <AuthCtx.Provider value={{}}>
      <TransactionCtx.Provider value={{store, dispatch}}>
        <ThemeProvider theme={theme}>
          <Wrapper className={className}>
            <BrowserRouter>
              {stuffing.children}
            </BrowserRouter>
            <GlobalStyle />
          </Wrapper>
        </ThemeProvider >
      </TransactionCtx.Provider>
    </AuthCtx.Provider>
  );

  if (!access) {
    return (
      <Burrito>
        <Route path="/" component={Login} />
      </Burrito>
    );
  }

  return (
    <Burrito>
      <Navigation />
      <Page>
        <Route path="/" exact={true} component={Homepage} />
        <Route path="/faq" component={FAQ} />
        <Route path="/transactions" component={Transactions} />
      </Page>
    </Burrito>
  );
};

export default App;
