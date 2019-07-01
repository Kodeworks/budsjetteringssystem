import React, { useState } from 'react';
import styled from 'styled-components';
import AccentedLink from '../../atoms/AccentedLink';
import CardContainer from '../../atoms/CardContainer';
import Input from '../../atoms/Input';
import OutlinedButton from '../../atoms/OutlinedButton';

export enum AuthType {
  Login = 'Sign in',
  Register = 'Sign up',
}

export interface IOnLogin {
  email: string;
  password: string;
}

export interface IOnRegister extends IOnLogin {
  firstName: string;
  lastName: string;
}

interface IAuthentication {
  children?: never;
  onRegister?: (args: IOnRegister) => void;
  onLogin?: (args: IOnLogin) => void;
  type: AuthType;
  error?: string;
}

const AuthContainer = styled(CardContainer)`
  margin: auto;
  width: 30vw;
  margin-left: 10vw;

  &,
  form * {
    background: ${props => props.theme.main};
  }

  h1 {
    margin-bottom: 0.7em;
  }

  form > * {
    margin-bottom: 0.6em;
  }

  form {
    margin-bottom: 0.6em;
  }

  form ~ a {
    display: block;
  }
`;

const Authentication: React.FC<IAuthentication> = props => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (props.type === AuthType.Register) {
      props.onRegister!({ email, password, firstName, lastName });
    } else {
      props.onLogin!({ email, password });
    }
  };

  const nameInputs =
    props.type === AuthType.Register ? (
      <>
        <Input
          ariaLabel="first name"
          placeholder="first name"
          id="firstName"
          type="text"
          value={firstName}
          setState={setFirstName}
        />
        <Input
          ariaLabel="last name"
          placeholder="last name"
          id="lastName"
          type="text"
          value={lastName}
          setState={setLastName}
        />
      </>
    ) : null;

  return (
    <AuthContainer>
      <h1 data-testid="authform-header">{props.type}</h1>

      {props.error && <p>{props.error}</p>}

      <form onSubmit={handleSubmit}>
        {nameInputs}
        <Input
          ariaLabel="email"
          placeholder="email"
          id="email"
          type="text"
          setState={setEmail}
          value={email}
        />

        <Input
          ariaLabel="password"
          placeholder="password"
          id="password"
          type="password"
          setState={setPassword}
          value={password}
        />
        <OutlinedButton>{props.type}</OutlinedButton>
        {props.type === AuthType.Login && (
          <AccentedLink to="#">Forgot your password?</AccentedLink>
        )}
      </form>
      <AccentedLink to={props.type === AuthType.Login ? '/register' : '/'}>
        {props.type === AuthType.Login
          ? 'Don\'t have an account?'
          : 'Already have an account?'}
      </AccentedLink>
    </AuthContainer>
  );
};

export default Authentication;
