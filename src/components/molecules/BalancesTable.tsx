import React from 'react';
import styled from 'styled-components';
import { IBalanceEntry } from '../../declarations/balanceEntries';
import BalanceTableEntry from '../atoms/BalanceTableEntry';

interface IPropsTable {
  className?: string;
  entries: Array<IBalanceEntry>;
}

interface IPropsHeaders {
  className?: string;
}

const headers: React.FC<IPropsHeaders> = props => {
  return (
    <div className={props.className}>
      <h4>Date</h4>
      <h4>Income</h4>
      <h4>Expense</h4>
      <h4>Liquidity</h4>
    </div>
  );
};

const BalancesTableHeaders = styled(headers)`
  display: grid;
  grid-template-columns: 25% 25% 25% 25%;
  width: calc(70% - 1em);
  text-align: right;
  margin-top: 2em;
  margin-bottom: 0.5em;
`;

const BalancesTable: React.FC<IPropsTable> = props => {
  /* Development data for entries */
  const entry1 = {date: '24.06', income: 100000, expense: 300000, liquidity: 8670000};
  const entry2 = {date: '25.06', income: 200050, liquidity: 8870000};

  return (
    <div className={props.className}>
      <BalancesTableHeaders />
      <BalanceTableEntry data={entry1} />
      <BalanceTableEntry data={entry2} />
    </div>
  );
};

export default styled(BalancesTable)`
  width: 70%;
  h4 {
    font-weight: 700;
  }
`;
