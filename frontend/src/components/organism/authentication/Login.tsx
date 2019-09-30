import React from 'react';

import { useAuthDispatch } from '../../../store/contexts/auth';
import { AuthActions } from '../../../store/reducers/auth';
import AccentedLink from '../../atoms/AccentedLink';
import Form from '../../molecules/Form';
import AuthenticationCard from './AuthenticationCard';

const Login: React.FC<
  import('react-router').RouteComponentProps<{}>
> = props => {
  const dispatch = useAuthDispatch();

  const onSubmit = async (values: any) => {
    await AuthActions.doLogin(values.email, values.password, dispatch);
    props.history.push('/');
  };

  return (
    <AuthenticationCard>
      <h1>Sign in</h1>

      <Form
        schema={[
          {
            id: 'email',
            label: 'Email',
            name: 'email',
            placeholder: 'jon@doe.com',
            type: 'text',
          },
          {
            id: 'password',
            label: 'Password',
            name: 'password',
            placeholder: '********',
            type: 'password',
          },
        ]}
        onSubmit={onSubmit}
      >
        Login
      </Form>

      <AccentedLink to="/register">Create a new account</AccentedLink>
    </AuthenticationCard>
  );
};

export default Login;
