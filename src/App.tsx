import React from 'react';

import styled from 'styled-components';

import { Redirect, Route } from 'react-router';

import { fetchUserById, ILoginResponse, logout } from './mitochondria/auth';

import Login from './components/organism/Login';
import Navigation from './components/organism/Navigation';
import Register from './components/organism/Register';
import Transactions from './components/organism/Transactions';
import FAQ from './components/pages/FAQ';
import Homepage from './components/pages/Homepage';
import Page from './components/templates/Page';
import Wrap from './helpers/GlobalWrapper';
import { navbarWidth } from './styling/sizes';

interface IAppProps {
  className?: string;
}

const App: React.FC<IAppProps> = props => {
  const [auth, setAuth] = React.useState<ILoginResponse>({ access: '', refresh: '' });

  React.useEffect(() => {
    (async () => {
      const LSAccess = localStorage.getItem('access');
      const LSRefresh = localStorage.getItem('refresh');
      const LSId = Number(localStorage.getItem('user_id'));

      if (LSAccess && LSRefresh && LSId) {
        try {
          const user = await fetchUserById(LSId, LSAccess);
          setAuth({ access: LSAccess, refresh: LSRefresh, user });
        } catch (e) {
          logout();
        }
      }
    })();
  }, []);

  if (auth.user === undefined && (auth.access && auth.refresh)) {
    return (
      <p>Loading...</p>
    );
  }

  /**
   * Wrap Login and Register to avoid lambdas in jsx. W(rap)Login/Register
   */
  const WLogin = (p: any) => <Login {...p} setAuth={setAuth} />;
  const WRegister = (p: any) => <Register {...p} setAuth={setAuth} />;

  /**
   * We're using this to handle redirects to the login page when logging out or going to a wrong page
   */
  const pageRoutes: Array<string> = [
    '/faq',
    '/transactions',
  ];

  if (!auth.access) {
    return (
      <Wrap className={props.className}>
        <Route path="/" exact={true} component={WLogin} />
        <Route path="/register" component={WRegister} />
        {pageRoutes.map(e => <Route key={e} to={e}><Redirect to="/" /></Route> )}
      </Wrap>
    );
  }

  return (
    <Wrap className={props.className} auth={auth}>
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
