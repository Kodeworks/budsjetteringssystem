import React from 'react';

import AuthenticationCard, { AuthType, IOnLogin } from './../molecules/AuthenticationCard';

import { Perform } from './../../reducers/auth';

import { AuthCtx } from './../../contexts/auth';

const Login: React.FC = props => {
  const [error, setError] = React.useState('');
  const { dispatch } = React.useContext(AuthCtx);

  const handleSubmit = ({ email, password }: IOnLogin) => {
    try {
      Perform.doLogin(email, password, dispatch);
    } catch (e) {
      setError(e);
    }
  };

  return (
    <AuthenticationCard type={AuthType.Login} error={error} onLogin={handleSubmit} />
  );
};

export default Login;
