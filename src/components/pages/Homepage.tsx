import React from 'react';
import styled from 'styled-components';
import DashboardTransactions from '../molecules/DashboardTransactions';

import { useTransactionState } from '../../store/contexts/transactions';

const Homepage: React.FC<{ className?: string }> = ({ className }) => {
  const store = useTransactionState();

  return (
    <div className={className}>
      <DashboardTransactions transactions={store.transactions} />
    </div>
  );
};

export default styled(Homepage)`
  display: grid;
  grid-template-columns: 30% 40% 30%;
`;
