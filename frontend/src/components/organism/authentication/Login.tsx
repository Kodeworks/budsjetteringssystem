import React from 'react';

import { useAuthDispatch } from '../../../store/contexts/auth';
import { AuthActions } from '../../../store/reducers/auth';
import AccentedLink from '../../atoms/AccentedLink';
import AuthenticationCard from '../../molecules/Card';
import Form from '../../molecules/Form';

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
      <h1 data-testid="authform-header">Sign in</h1>

      <Form
        schema={[
          {
            id: 'email',
            label: 'email',
            name: 'email',
            placeholder: 'jon@doe.com',
            type: 'email',
          },
          {
            id: 'password',
            label: 'password',
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
