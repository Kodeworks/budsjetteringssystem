import React from 'react';

import styled from 'styled-components';

import { Redirect, Route } from 'react-router';

import { initialState, Perform, reducer } from './reducers/auth';

import Login from './components/organism/Authentication/Login';
import Register from './components/organism/Authentication/Register';
import Navigation from './components/organism/Navigation';
import Transactions from './components/organism/Transactions';
import FAQ from './components/pages/FAQ';
import Homepage from './components/pages/Homepage';
import Page from './components/templates/Page';
import { AuthCtx, createAuthCtx } from './contexts/auth';
import Wrap from './helpers/GlobalWrapper';
import { navbarWidth } from './styling/sizes';

interface IAppProps {
  className?: string;
}

const App: React.FC<IAppProps> = props => {
  const [auth, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    (async () => {
      const LSAccess = localStorage.getItem('access');
      const LSRefresh = localStorage.getItem('refresh');
      const LSId = Number(localStorage.getItem('user_id'));

      if (LSAccess && LSRefresh && LSId) {
        try {
          Perform.doSetAccessToken(LSAccess, dispatch);
          Perform.doSetRefreshToken(LSRefresh, dispatch);
          Perform.doSetUser(LSAccess, LSId, dispatch);
        } catch (e) {
          Perform.doLogout(dispatch);
        }
      }
    })(); // IIEF
  }, []); // Only run on component mount

  if (auth.user === undefined && (auth.access && auth.refresh)) {
    return (
      <p>Loading...</p>
    );
  }

  if (!AuthCtx) {
    createAuthCtx(auth, dispatch);
  }

  /**
   * We're using this to handle redirects to the login page when logging out or going to a wrong page
   */
  const pageRoutes: Array<string> = [
    '/faq',
    '/transactions',
  ];

  if (!auth.access) {
    return (
      <Wrap className={props.className} auth={{store: auth, dispatch}}>
        <Route path="/" exact={true} component={Login} />
        <Route path="/register" component={Register} />
        {pageRoutes.map(e => <Route key={e} to={e}><Redirect to="/" /></Route> )}
      </Wrap>
    );
  }

  return (
    <Wrap className={props.className} auth={{store: auth, dispatch}}>
      <Navigation />
      <Page>
        <Route path="/" exact={true} component={Homepage} />
        <Route path="/faq" component={FAQ} />
        <Route path="/transactions" component={Transactions} />
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

  &>section {
    overflow-y: auto;
  }
`;
