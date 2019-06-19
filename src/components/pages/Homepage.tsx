import React from 'react';
import styled from 'styled-components';
import DashboardTransactions from '../molecules/DashboardTransactions';

import { TransactionCtx } from '../../contexts/transaction';

interface IProps {
  className?: string;
}

const Homepage: React.FC<IProps> = ({ className }) => {
  const { store } = React.useContext(TransactionCtx);

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
