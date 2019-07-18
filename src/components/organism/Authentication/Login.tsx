import React from 'react';

import Authentication, { AuthType, IOnLogin } from './Authentication';

import { useAuthDispatch } from '../../../store/contexts/auth';
import { AuthActions } from '../../../store/reducers/auth';

const Login: React.FC = props => {
  const [error, setError] = React.useState('');
  const dispatch = useAuthDispatch();

  const handleSubmit = ({ email, password }: IOnLogin) => {
    try {
      AuthActions.doLogin(email, password, dispatch);
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
