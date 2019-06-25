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
    try {
      const resp = await register(email, password, firstName, lastName);
      props.setAuth(resp);
    } catch (e) {
      setError(e.detail);
    }
  };

  return (
    <AuthenticationCard type={AuthType.Register} error={error} onRegister={handleSubmit} />
  );
};

export default Register;
