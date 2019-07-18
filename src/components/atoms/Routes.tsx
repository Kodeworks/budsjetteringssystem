import React from 'react';
import { useAuthState } from '../../store/contexts/auth';

import { BrowserRouter, Redirect, Route } from 'react-router-dom';
import Login from '../organism/Authentication/Login';
import Register from '../organism/Authentication/Register';
import Navigation from '../organism/Navigation';
import Transactions from '../organism/Transactions';
import Balances from '../pages/Balances';
import { Companies } from '../pages/Companies';
import FAQ from '../pages/FAQ';
import Homepage from '../pages/Homepage';
import Page from '../templates/Page';

const pageRoutes: Array<string> = [
  '/faq',
  '/transactions',
  '/companies',
  '/balances',
];

const Routes: React.FC = props => {
  const authState = useAuthState();

  if (!authState.access) {
    return (
      <BrowserRouter>
        <>
          <Route path="/" exact={true} component={Login} />
          <Route path="/register" component={Register} />
          {pageRoutes.map(e => (
            <Route key={e} to={e}>
              <Redirect to="/" />
            </Route>
          ))}
        </>
      </BrowserRouter>
    );
  } else if (authState.access && !authState.user) {
    return <h1>Loading...</h1>;
  } else {
    return (
      <BrowserRouter>
        <>
          <Navigation />
          <Page>
            <Route path="/" exact={true} component={Homepage} />
            <Route path="/faq" component={FAQ} />
            <Route path="/transactions" component={Transactions} />
            <Route path="/balances" component={Balances} />
            <Route path="/companies" component={Companies} />
          </Page>
        </>
      </BrowserRouter>
    );
  }
};

export default Routes;
