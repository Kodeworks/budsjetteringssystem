import React from 'react';

import { useAuthDispatch } from '../../../store/contexts/auth';
import { AuthActions } from '../../../store/reducers/auth';
import AccentedLink from '../../atoms/AccentedLink';
import AuthenticationCard from '../../molecules/Card';
import Form from '../../molecules/Form';

const Register: React.FC<
  import('react-router').RouteComponentProps<{}>
> = props => {
  const dispatch = useAuthDispatch();

  const onSubmit = async ({ first_name, last_name, email, password }: any) => {
    await AuthActions.doRegister(
      first_name,
      last_name,
      email,
      password,
      dispatch
    );
  };

  return (
    <AuthenticationCard>
      <h1 data-testid="authform-header">Sign up</h1>

      <Form
        disrupting={true}
        schema={[
          {
            id: 'register-first_name',
            label: 'first name',
            name: 'first_name',
            placeholder: 'John',
            type: 'text',
          },
          {
            id: 'register-last_name',
            label: 'last name',
            name: 'last_name',
            placeholder: 'Doe',
            type: 'text',
          },
          {
            id: 'register-email',
            label: 'email',
            name: 'email',
            placeholder: 'jon@doe.com',
            type: 'email',
          },
          {
            id: 'register-password',
            label: 'password',
            name: 'password',
            placeholder: '********',
            type: 'password',
          },
        ]}
        onSubmit={onSubmit}
      >
        Register
      </Form>

      <AccentedLink to="/login">Already have an account?</AccentedLink>
    </AuthenticationCard>
  );
};

export default Register;
