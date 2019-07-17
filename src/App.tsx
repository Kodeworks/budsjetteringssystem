import React from 'react';

import styled from 'styled-components';

import { Redirect, Route } from 'react-router';

import { Perform } from './store/reducers/auth';

import { CompanyLoader } from './components/atoms/CompanyLoader';
import Login from './components/organism/Authentication/Login';
import Register from './components/organism/Authentication/Register';
import Navigation from './components/organism/Navigation';
import Transactions from './components/organism/Transactions';
import Balances from './components/pages/Balances';
import { Companies } from './components/pages/Companies';
import FAQ from './components/pages/FAQ';
import Homepage from './components/pages/Homepage';
import Page from './components/templates/Page';
import Wrap from './helpers/GlobalWrapper';
import { TransactionMocker } from './helpers/transaction_creator';
import { useAuth } from './store/contexts/auth';
import { navbarWidth } from './styling/sizes';

interface IAppProps {
  className?: string;
}

const App: React.FC<IAppProps> = props => {
  const [auth, dispatch] = useAuth();
  const [readyToRedirect, setReadyToRedirect] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const LSAccess = localStorage.getItem('access');
      const LSRefresh = localStorage.getItem('refresh');
      const LSId = Number(localStorage.getItem('user_id'));

      if (LSAccess && LSRefresh && LSId) {
        try {
          /**
           * We need to await the doSetUser function, as if not, the error won't be caught
           * by the catch (e), and the user will not be logged out. This leads to a
           * situation where you're stuck on the loading screen with an error saying
           * the refresh token is expired. This is due to the fact that it is async.
           */
          Perform.doSetRefreshToken(LSRefresh, dispatch);
          Perform.doSetAccessToken(LSAccess, dispatch);
          await Perform.doSetUser(LSAccess, LSId, dispatch);
        } catch (e) {
          Perform.doLogout(dispatch);
        }
      } else {
        setReadyToRedirect(true);
      }
    })(); // IIFE
  }, [dispatch]); // Only run on component mount

  // If logging in user
  if (!auth.user && (auth.access && auth.refresh)) {
    return <p>Loading...</p>;
  }

  /**
   * We're using this to handle redirects to the login page when logging out or going to a wrong page
   */
  const pageRoutes: Array<string> = [
    '/faq',
    '/transactions',
    '/companies',
    '/balances',
  ];

  // If not logged in
  if (!auth.access) {
    return (
      <Wrap className={props.className}>
        <Route path="/" exact={true} component={Login} />
        <Route path="/register" component={Register} />
        {readyToRedirect &&
          pageRoutes.map(e => (
            <Route key={e} to={e}>
              <Redirect to="/" />
            </Route>
          ))}
      </Wrap>
    );
  }

  return (
    <Wrap className={props.className}>
      <TransactionMocker quantity={100} />
      <CompanyLoader />
      <Navigation />
      <Page>
        <Route path="/" exact={true} component={Homepage} />
        <Route path="/faq" component={FAQ} />
        <Route path="/transactions" component={Transactions} />
        <Route path="/balances" component={Balances} />
        <Route path="/companies" component={Companies} />
      </Page>
    </Wrap>
  );
};

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
