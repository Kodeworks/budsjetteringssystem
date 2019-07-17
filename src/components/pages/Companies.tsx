import React from 'react';
import { useCompanyState } from '../../store/contexts/company';

export const Companies: React.FC = props => {
  const companies = useCompanyState();

  return (
    <>
      <h1>All my cool companies :)</h1>
      {companies.map(company => (
        <h1 key={company.id}>{company.name}</h1>
      ))}
    </>
  );
};
