import React from 'react';
import { useAuthState } from '../../store/contexts/auth';

const CurrentBalance: React.FC = props => {
  const auth = useAuthState();

  return <>{auth!.companies.map(c => <h1 key={c.company_id}>{c.company_id}</h1>)}</>;
}

export default CurrentBalance;