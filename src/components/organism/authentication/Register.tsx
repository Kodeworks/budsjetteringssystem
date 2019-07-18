import React from 'react';

import Authentication, { AuthType, IOnRegister } from './Authentication';

import { AuthActions } from '../../../store/reducers/auth';

import { RouteComponentProps, withRouter } from 'react-router';
import { useAuthDispatch } from '../../../store/contexts/auth';

const Register: React.FC<RouteComponentProps<{}>> = props => {
  const authDispatch = useAuthDispatch();
  const [error, setError] = React.useState('');

  const handleSubmit = async ({
    email,
    password,
    firstName,
    lastName,
  }: IOnRegister) => {
    try {
      await AuthActions.doRegister(
        firstName,
        lastName,
        email,
        password,
        authDispatch
      );
      props.history.push('/');
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <Authentication
      type={AuthType.Register}
      error={error}
      onRegister={handleSubmit}
    />
  );
};

export default withRouter(Register);
