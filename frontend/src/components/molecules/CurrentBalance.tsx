import React from 'react';

import styled from 'styled-components';

import { useCompanyState } from '../../store/contexts/company';
import CurrentBalanceEntry from '../atoms/CurrentBalanceEntry';

const CurrentBalance: React.FC<{ className?: string }> = ({ className }) => {
  const companies = useCompanyState();

  return (
    <div className={className}>
      <h2>Todays balance</h2>
      {companies.map(c => (
        <CurrentBalanceEntry key={c.id} id={c.id} name={c.name} />
      ))}
    </div>
  );
};

export default styled(CurrentBalance)`
  h2 {
    font-weight: 200;
    margin-bottom: 0.7em;
    font-size: 2.2em;
  }
`;
