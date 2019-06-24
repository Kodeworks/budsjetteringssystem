import React from 'react';

import { register } from '../../mitochondria/auth';
import { IAuth } from './../../declarations/auth';
import AuthenticationCard, { AuthType, IOnRegister } from './../molecules/AuthenticationCard';

interface IRegisterProps {
  setAuth: React.Dispatch<React.SetStateAction<IAuth>>;
}

const Register: React.FC<IRegisterProps> = props => {
  const [error, setError] = React.useState('');

  const handleSubmit = async ({ email, password, firstName, lastName }: IOnRegister) => {
    const resp = await register(email, password, firstName, lastName);

    if ('detail' in resp) {
      return setError(resp.detail);
    }

    props.setAuth(resp);
  };

  return (
    <AuthenticationCard type={AuthType.Register} error={error} onRegister={handleSubmit} />
  );
};

export default Register;
