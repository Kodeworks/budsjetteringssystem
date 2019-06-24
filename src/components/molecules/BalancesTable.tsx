import React from 'react';
import styled from 'styled-components';

import { ITransaction } from '../../declarations/transaction';

import BalanceTableEntry from '../atoms/BalanceTableEntry';

interface IPropsTable extends ITransaction {
  className?: string;
  tx: Array<ITransaction>;
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
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  return (
    <div className={props.className}>
      <BalancesTableHeaders />
      <BalanceTableEntry data={{date: new Date(), income: 1000, expense: 3000, liquidity: 86700}} />
      <BalanceTableEntry data={{date: tomorrow, expense: 1000, liquidity: 87700}} />
    </div>
  );
};

export default styled(BalancesTable)`
  width: 70%;
  h4 {
    font-weight: 700;
  }
`;
