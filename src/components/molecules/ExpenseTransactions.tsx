import React from 'react';

import { ITransaction, TransactionType as TT } from '../../declarations/transaction';

import TransactionEntry from '../atoms/TransactionEntry';

import styled from 'styled-components';

interface IProps {
  tx: Array<ITransaction>;
  className?: string;
}

const txEntry = (t: ITransaction) => (
  <TransactionEntry hideIncomeExpenseBadge={true} key={t.id} {...t} />
);

const ExpenseTransactions: React.FC<IProps> = props => (
  <div className={props.className}>
    <h2>Expenses</h2>
    {props.tx.filter(e => e.type === TT.expense).map(txEntry)}
  </div>
);

export default styled(ExpenseTransactions)`
  h2 {
    margin-bottom: 1em;
  }
`;
