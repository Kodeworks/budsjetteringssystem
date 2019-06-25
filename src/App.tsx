import React from 'react';

import styled, { ThemeProvider } from 'styled-components';

import { Redirect, Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { theme } from './styling/theme';

import { AuthCtx } from './contexts/auth';
import { createTransactionCtx, TransactionCtx } from './contexts/transaction';
import { createDummyTransaction } from './helpers/transaction_creator';
import { fetchUserById, ILoginResponse } from './mitochondria/auth';
import { ActionCreators, initialState, reducer } from './reducers/transactions';

import Login from './components/organism/Login';
import Navigation from './components/organism/Navigation';
import Register from './components/organism/Register';
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
  const [auth, setAuth] = React.useState<ILoginResponse>({ access: '', refresh: '' });
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const LSAccess = localStorage.getItem('access');
    const LSRefresh = localStorage.getItem('refresh');
    const LSId = Number(localStorage.getItem('user_id'));

    if (LSAccess && LSRefresh && LSId) {
      setLoading(true);
      fetchUserById(LSId, LSAccess).then(user => {
        setAuth({ access: LSAccess, refresh: LSRefresh, user });
        setLoading(false);
      });
    }
  }, []);

  if (loading) {
    return (
      <p>Loading...</p>
    );
  }

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
    <AuthCtx.Provider value={auth}>
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

  /**
   * Wrap Login and Register to avoid lambdas in jsx. W(rap)Login/Register
   */
  const WLogin = (props: any) => <Login {...props} setAuth={setAuth} />;
  const WRegister = (props: any) => <Register {...props} setAuth={setAuth} />;

  /**
   * We're using this to handle redirects to the login page when logging out or going to a wrong page
   */
  const pageRoutes: Array<string> = [
    '/faq',
    '/transactions',
  ];

  if (!auth.access) {
    return (
      <Burrito>
        <Route path="/" component={WLogin} />
        <Route path="/register" component={WRegister} />
        {pageRoutes.map(e => <Route key={e} to={e}><Redirect to="/" /></Route> )}
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
