import React from 'react';
import { useAuthState } from '../../store/contexts/auth';

import { Route, RouteComponentProps, withRouter } from 'react-router-dom';
import Login from '../organism/authentication/Login';
import Register from '../organism/authentication/Register';
import Navigation from '../organism/Navigation';
import Projections from '../organism/Projections';
import Transactions from '../organism/Transactions';
import Balances from '../pages/Balances';
import Companies from '../pages/Companies';
import CreateCompany from '../pages/CreateCompany';
import Dashboard from '../pages/Dashboard';
import FAQ from '../pages/FAQ';
import Page from '../templates/Page';

const Routes: React.FC<RouteComponentProps<{}>> = props => {
  const user = useAuthState();

  /**
   * This is responsible for redirecting the user to the login
   * page when the access and refresh tokens are expired.
   *
   * The solution is not perfect, but it does work.
   */
  React.useEffect(() => {
    if (!localStorage.getItem('access')) {
      props.history.push('/login');
    }
  }, [localStorage]);

  if (!localStorage.getItem('access')) {
    // If path is not /login or /register. Done like this to make the list easy to extend
    if (['/login', '/register'].indexOf(props.location.pathname) === -1) {
      props.history.push('/login');
    }

    return (
      <>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </>
    );
  } else if (!user) {
    return <h1>Loading...</h1>;
  } else {
    return (
      <>
        <Navigation />
        <Page>
          <Route path="/" exact={true} component={Dashboard} />
          <Route path="/faq" component={FAQ} />
          <Route path="/projections" component={Projections} />
          <Route path="/transactions" component={Transactions} />
          <Route path="/balances" component={Balances} />
          <Route path="/companies" component={Companies} />
          <Route path="/create-company" component={CreateCompany} />
        </Page>
      </>
    );
  }
};

export default withRouter(Routes);
