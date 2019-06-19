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

const IncomeTransactions: React.FC<IProps> = props => (
  <div className={props.className}>
    <h2>Income</h2>
    {props.tx.filter(e => e.type === TT.income).map(txEntry)}
  </div>
);

export default styled(IncomeTransactions)`
  h2 {
    margin-bottom: 1em;
  }
`;
