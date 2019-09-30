import 'jest-dom/extend-expect';
import React from 'react';
import { cleanup, render } from '../../../helpers/test-utils';
import Authentication, { AuthType } from '../authentication/AuthenticationCard';

afterEach(cleanup);

test('Login form renders with correct headertext, aria-labels and placeholders', () => {
  const { getByTestId, getByLabelText } = render(
    <Authentication type={AuthType.Login} />
  );

  expect(getByTestId('authform-header')).toHaveTextContent(/^Sign in$/);
  expect(getByLabelText('email')).toHaveAttribute('aria-label', 'email');
  expect(getByLabelText('password')).toHaveAttribute('aria-label', 'password');
});

test('Register form renders with correct headertext, aria-labels and placeholders', () => {
  const { getByTestId, getByLabelText } = render(
    <Authentication type={AuthType.Register} />
  );

  expect(getByTestId('authform-header')).toHaveTextContent(/^Sign up$/);
  expect(getByLabelText('email')).toHaveAttribute('aria-label', 'email');
  expect(getByLabelText('password')).toHaveAttribute('aria-label', 'password');
});
