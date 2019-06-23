import React from 'react';
import styled, { StyledComponent } from 'styled-components';
import { ITransaction } from '../../declarations/transaction';
import { TransactionCtx } from '../../contexts/transaction';

interface IPropsTable extends ITransaction {
  className?: string;
  tx: Array<ITransaction>;
}

interface IPropsHeaders {
  className?: string;
}

interface IPropsTableEntry {
  className?: string;
  date: Date;
  income?: number;
  expense?: number;
}

const Content = styled.div`
  display: grid;
  grid-template-columns: 20% 20% 20% 20%;
  width: calc(70% - 1em);
  margin-top: 2em;
  margin-left: 2em;
`;

const tableEntry: React.FC<IPropsTableEntry> = props => {
  return (
    <div className={props.className}>
      <h6>{`${props.date.getDate()}.0${props.date.getMonth() + 1}`}</h6>
      <h6>{props.income}</h6>
      <h6>{`(${props.expense})`}</h6>
      <h6>{props.expense}</h6>
    </div>
  );
};

const BalanceTableEntry = styled(tableEntry)`
  display: grid;
  grid-template-columns: 20% 20% 20% 20%;
  width: calc(70% - 1em);
  text-align: right;
  h6 {
    font-weight: 300;
    font-size: 0.8em;
  }
`;

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
  grid-template-columns: 20% 20% 20% 20%;
  width: calc(70% - 1em);
  text-align: right;
  margin-top: 2em;
  margin-bottom: 0.5em;
`;

const BalancesTable: React.FC<IPropsTable> = props => {

  return (
    <div className={props.className}>
      <BalancesTableHeaders />
      <BalanceTableEntry date={new Date()} income={1000} expense={3000} />
    </div>
  );
};

export default styled(BalancesTable)`
  h4 {
    font-weight: 700;
  }
`;
