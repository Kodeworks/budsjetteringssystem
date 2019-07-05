import React from 'react';

import Authentication, { AuthType, IOnRegister } from './Authentication';

import { Perform } from '../../../store/reducers/auth';

import { AuthCtx } from '../../../contexts/auth';

const Register: React.FC = props => {
  const { dispatch } = React.useContext(AuthCtx);
  const [error, setError] = React.useState('');

  const handleSubmit = ({ email, password, firstName, lastName }: IOnRegister) => {
    try {
      Perform.doRegister(firstName, lastName, email, password, dispatch);
    } catch (e) {
      setError(e);
    }
  };

  return (
    <Authentication type={AuthType.Register} error={error} onRegister={handleSubmit} />
  );
};

export default Register;
