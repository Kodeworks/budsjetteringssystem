import React from 'react';

import Authentication, { AuthType, IOnLogin } from './Authentication';

import { useAuthDispatch } from '../../../store/contexts/auth';
import { AuthActions } from '../../../store/reducers/auth';

const Login: React.FC<
  import('react-router').RouteComponentProps<{}>
> = props => {
  const [error, setError] = React.useState('');
  const dispatch = useAuthDispatch();

  const handleSubmit = async ({ email, password }: IOnLogin) => {
    try {
      await AuthActions.doLogin(email, password, dispatch);
      props.history.push('/');
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
