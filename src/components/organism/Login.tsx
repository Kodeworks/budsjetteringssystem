import React from 'react';

import { login } from '../../mitochondria/auth';
import { IAuth } from './../../declarations/auth';
import AuthenticationCard, { AuthType, IOnLogin } from './../molecules/AuthenticationCard';

interface ILoginProps {
  setAuth: React.Dispatch<React.SetStateAction<IAuth>>;
}

const Login: React.FC<ILoginProps> = props => {
  const [error, setError] = React.useState('');

  // This is mostly the same code as in register, but I haven't DRY-ed it up yet.
  const handleSubmit = async ({ email, password }: IOnLogin) => {
    const resp = await login(email, password);

    if ('detail' in resp) {
      return setError(resp.detail);
    }

    props.setAuth(resp);
  };

  return (
    <AuthenticationCard type={AuthType.Login} error={error} onLogin={handleSubmit} />
  );
};

export default Login;
