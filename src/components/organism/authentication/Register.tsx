import React from 'react';

import Authentication, { AuthType, IOnRegister } from './Authentication';

import { Perform } from '../../../store/reducers/auth';

import { RouteComponentProps, withRouter } from 'react-router';
import { AuthCtx } from '../../../store/contexts/auth';

const Register: React.FC<RouteComponentProps<{}>> = props => {
  const { dispatch } = React.useContext(AuthCtx);
  const [error, setError] = React.useState('');

  const handleSubmit = ({
    email,
    password,
    firstName,
    lastName,
  }: IOnRegister) => {
    try {
      Perform.doRegister(firstName, lastName, email, password, dispatch);
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
