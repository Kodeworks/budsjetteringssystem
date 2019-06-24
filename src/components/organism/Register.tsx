import React from 'react';

import AuthenticationCard, { AuthType } from './../molecules/AuthenticationCard';

const Register: React.FC = () => {
  const handleSubmit = (username: string, password: string) => alert(`${username}, ${password}`);

  return (
    <AuthenticationCard type={AuthType.Register} onSubmit={handleSubmit} />
  );
};

export default Register;
