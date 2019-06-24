import React, { useState } from 'react';
import styled from 'styled-components';
import AccentedLink from '../atoms/AccentedLink';
import CardContainer from '../atoms/CardContainer';
import Input from '../atoms/Input';
import OutlinedButton from '../atoms/OutlinedButton';

interface IAuthenticationCard {
  children?: never;
  onSubmit: (email: string, password: string) => void;
}

const AuthCardContainer = styled(CardContainer)`
  margin: auto;
  width: 30vw;
  margin-left: 10vw;

  &, form * {
    background: ${props => props.theme.main};
  }

  h1 {
    margin-bottom: .7em;
  }

  form>* {
    margin-bottom: .6em;
  }

  form {
    margin-bottom: .6em;
  }

  form~a {
    display: block;
  }
`;

const AuthenticationCard: React.FC<IAuthenticationCard> = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.onSubmit(email, password);
  };

  return (
    <AuthCardContainer>
      <h1>Sign In</h1>

      <form onSubmit={handleSubmit}>
        <Input placeholder="email" id="email" type="text" setState={setEmail} value={email} />
        <Input placeholder="password" id="password" type="password" setState={setPassword} value={password} />
        <OutlinedButton>Sign In</OutlinedButton>
        <AccentedLink to="#">Forgot your password?</AccentedLink>
      </form>
      <AccentedLink to="/register">Don't have an account?</AccentedLink>
    </AuthCardContainer>
  );
};

export default AuthenticationCard;
