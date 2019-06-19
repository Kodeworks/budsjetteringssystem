import React from 'react';

import { ITransaction, TransactionType as TT } from '../../declarations/transaction';

import OutlinedButton from '../atoms/OutlinedButton';
import TransactionEntry from '../atoms/TransactionEntry';

import styled from 'styled-components';

interface IProps {
  tx: Array<ITransaction>;
  className?: string;
  fetchMore: () => void;
}

const txEntry = (t: ITransaction) => (
  <TransactionEntry hideIncomeExpenseBadge={true} key={t.id} {...t} />
);

const IncomeTransactions: React.FC<IProps> = props => (
  <div className={props.className}>
    <h2>Income</h2>
    {props.tx.filter(e => e.type === TT.income).map(txEntry)}
    <OutlinedButton onClick={props.fetchMore}>Fetch more</OutlinedButton>
  </div>
);

export default styled(IncomeTransactions)`
  h2 {
    margin-bottom: 1em;
  }

  button {
    display: block;
    margin: 1em auto;
  }
`;
