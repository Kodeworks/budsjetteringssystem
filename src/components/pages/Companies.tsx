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
            {company.users.map(u => (
              <li key={u.user_id}>
                {u.user_id} - {u.role}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <form>
        <input type="text" />
        <input type="number" />
        <input type="submit" value="Create new company" />
      </form>
    </>
  );
};
