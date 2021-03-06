import React from 'react';

import styled from 'styled-components';
import TransactionEntry from '../atoms/TransactionEntry';

interface IDashboardTransactionsProps {
  className?: string;
  transactions: Array<import('../../declarations/transaction').ITransaction>;
}

const DashboardTransactions: React.FC<IDashboardTransactionsProps> = ({
  className,
  transactions,
}) => (
  <div className={className}>
    <h1>Transactions</h1>
    <h5>Last 5 transactions</h5>

    <div>
      {transactions.slice(0, 5).map(e => (
        <TransactionEntry key={e.id} {...e} />
      ))}
    </div>
  </div>
);

export default styled(DashboardTransactions)`
  /* Typography */
  h1 {
    font-size: 1.8em;
    font-weight: 700;
  }

  h5 {
    font-weight: 300;
    line-height: 0.7em;
  }

  & > div {
    margin-top: 2em;

    div:not(:first-child) {
      margin-top: 1.5em;
    }
  }
`;
