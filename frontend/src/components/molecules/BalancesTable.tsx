import React from 'react';
import styled from 'styled-components';
import BalanceTableEntry from '../atoms/BalanceTableEntry';

interface ITableProps {
  className?: string;
  entries: Array<import('../../declarations/balanceEntries').IBalanceEntry>;
}

interface IHeadersProps {
  className?: string;
}

const headers: React.FC<IHeadersProps> = props => {
  return (
    <div className={props.className}>
      <h2>Date</h2>
      <h2>Income</h2>
      <h2>Expense</h2>
      <h2>Liquidity</h2>
    </div>
  );
};

const BalancesTableHeaders = styled(headers)`
  display: grid;
  grid-template-columns: 25% 25% 25% 25%;
  width: calc(90% - 1em);
  text-align: right;
  padding: 10px;
  margin-bottom: 0.3em;

  h2:first-of-type {
    text-align: left;
  }
`;

const BalancesTable: React.FC<ITableProps> = props => {
  return (
    <div className={props.className}>
      <BalancesTableHeaders />
      {props.entries.map(e => (
        <BalanceTableEntry data={e} key={e.date} />
      ))}
    </div>
  );
};

export default styled(BalancesTable)`
  width: 100%;
  margin-top: 3em;
  h2 {
    margin-bottom: 0.3em;
  }
`;
