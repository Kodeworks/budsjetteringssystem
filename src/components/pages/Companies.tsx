import React from 'react';
import { useCompanyState } from '../../store/contexts/company';

export const Companies: React.FC = props => {
  const companies = useCompanyState();

  return (
    <>
      <h1>All my cool companies :)</h1>
      {companies.map(company => (
        <div key={company.id}>
          <h1>{company.name}</h1>
          <ul>
            {company.users.map(user => (
              <li key={user.userId}>{user.userId}</li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
};
