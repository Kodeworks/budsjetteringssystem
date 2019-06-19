import React, { useState } from 'react';
import styled from 'styled-components';
import AccentedLink from '../atoms/AccentedLink';
import CardContainer from '../atoms/CardContainer';
import Input from '../atoms/Input';
import OutlinedButton from '../atoms/OutlinedButton';

interface IAuthenticationCard {
  children?: never;
}

const AuthCardContainer = styled(CardContainer)`
  max-width: 500px;
  margin: auto;
  header {
    text-align: center;
  }
`;

const Form = styled.form`
  padding: 0 50px;
  margin: 10px 5px 20px 5px;
  button {
    display: block;
    margin: auto;
  }
  Input {
    margin: 10px auto;
  }
`;

const ActionGroup = styled.div`
  & > * {
    display: block;
    margin: auto;
    text-align: center;
  }
`;

/* This is a presentational component without any children */
const AuthenticationCard: React.FC<IAuthenticationCard> = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(`This form was submitted with username: ${username} and password: ${password}`);
  };

  return (
    <AuthCardContainer>
      <header>
        <h1>Sign In</h1>
      </header>
      <Form onSubmit={handleSubmit}>
        <Input placeholder="email/username" id="username" type="text" setState={setUsername} value={username} />
        <Input placeholder="password" id="password" type="text" setState={setPassword} value={password} />
        <OutlinedButton>Sign In</OutlinedButton>
      </Form>
      <ActionGroup>
        <OutlinedButton>Sign Up</OutlinedButton>
        <AccentedLink to="#">Forgot your password?</AccentedLink>
      </ActionGroup>
    </AuthCardContainer>
  );
};

export default AuthenticationCard;
