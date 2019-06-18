import React, { useState } from 'react';
import CardContainer from '../atoms/CardContainer';
import Input from '../atoms/Input';

const AuthenticationCard: React.FC = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(`This form was submitted with username: ${username} and password: ${password}`);
  };

  return (
    <CardContainer>
      <header>
        <h1>Sign In</h1>
      </header>
      <form onSubmit={handleSubmit}>
        <Input id="username" type="text" setState={setUsername} value={username} />
        <Input id="password" type="text" setState={setPassword} value={password} />
      </form>
    </CardContainer>
  );
};

export default AuthenticationCard;
