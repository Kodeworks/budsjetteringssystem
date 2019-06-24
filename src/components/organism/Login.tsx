import React from 'react';

import AuthenticationCard from './../molecules/AuthenticationCard';

const Login: React.FC = () => {
  const handleSubmit = (username: string, password: string) => alert(`${username}, ${password}`);

  return (
    <AuthenticationCard onSubmit={handleSubmit} />
  );
};

export default Login;
