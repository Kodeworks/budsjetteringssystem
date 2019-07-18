import React from 'react';

import Authentication, { AuthType, IOnLogin } from './Authentication';

import { Perform } from '../../../store/reducers/auth';

import { AuthCtx } from '../../../store/contexts/auth';

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
    <Authentication
      type={AuthType.Login}
      error={error}
      onLogin={handleSubmit}
    />
  );
};

export default Login;
